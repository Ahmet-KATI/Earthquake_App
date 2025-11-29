"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Earthquake } from "@/lib/api";
import Link from "next/link";
import { turkeyFaultLines } from "@/lib/faultLines";
import {
    TURKEY_GEOJSON_URL, getRiskColor,
    getRiskLabel,
    getProvinceRisk,
} from "@/lib/earthquakeRiskZones";

// Fix for default marker icon not showing
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
// Fix for default marker icon not showing
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
const icon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconRetinaUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface EarthquakeMapProps {
    latitude?: number;
    longitude?: number;
    popupText?: string;
    earthquakes?: Earthquake[];
}

export default function EarthquakeMap({ latitude, longitude, popupText, earthquakes }: EarthquakeMapProps) {
    const center: [number, number] = latitude && longitude ? [latitude, longitude] : [39.0, 35.0]; // Default to Turkey center
    const zoom = latitude && longitude ? 8 : 6;

    const [provincesData, setProvincesData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Turkey provinces GeoJSON
        fetch(TURKEY_GEOJSON_URL)
            .then((res) => res.json())
            .then((data) => {
                // Add risk degree to each province feature
                const enrichedData = {
                    ...data,
                    features: data.features.map((feature: any) => ({
                        ...feature,
                        properties: {
                            ...feature.properties,
                            riskDegree: getProvinceRisk(feature.id),
                            riskColor: getRiskColor(getProvinceRisk(feature.id)),
                            riskLabel: getRiskLabel(getProvinceRisk(feature.id)),
                        },
                    })),
                };
                setProvincesData(enrichedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to load provinces data:", error);
                setLoading(false);
            });
    }, []);

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Risk Zones Layer - Rendered first (bottom layer) */}
            {!loading && provincesData && (
                <GeoJSON
                    data={provincesData}
                    style={(feature) => ({
                        fillColor: feature?.properties?.riskColor || "#CCCCCC",
                        fillOpacity: 0.4,
                        color: "#FFFFFF",
                        weight: 1,
                        opacity: 0.8,
                    })}
                    onEachFeature={(feature, layer) => {
                        layer.on({
                            mouseover: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    fillOpacity: 0.6,
                                });
                            },
                            mouseout: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    fillOpacity: 0.4,
                                });
                            },
                        });

                        const popupContent = `
                            <div class="text-sm">
                                <div class="font-bold">${feature.properties.name}</div>
                                <div class="text-xs mt-1">${feature.properties.riskLabel}</div>
                            </div>
                        `;
                        layer.bindPopup(popupContent);
                    }}
                />
            )}

            {/* Single Marker Mode */}
            {latitude && longitude && (
                <Marker position={[latitude, longitude]} icon={icon}>
                    <Popup>{popupText}</Popup>
                </Marker>
            )}

            {/* Multiple Markers Mode */}
            {earthquakes?.map((eq) => (
                <Marker key={eq.id} position={[eq.latitude, eq.longitude]} icon={icon}>
                    <Popup>
                        <div className="text-sm">
                            <div className="font-bold">{eq.location}</div>
                            <div>Büyüklük: {eq.magnitude}</div>
                            <div>Derinlik: {eq.depth} km</div>
                            <div className="mt-2">
                                <Link href={`/depremler/${eq.id}`} className="text-primary hover:underline">
                                    Detaylar
                                </Link>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Fault Lines */}
            {turkeyFaultLines.features.map((feature, index) => {
                const isMajor = feature.properties.type === "major";
                const weight = isMajor ? 3 : 2;

                if (feature.geometry.type === "LineString") {
                    return (
                        <Polyline
                            key={`fault-${index}`}
                            positions={feature.geometry.coordinates.map(coord => [coord[1], coord[0]])}
                            pathOptions={{
                                color: "#DC2626",
                                weight: weight,
                                opacity: 0.8,
                            }}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <div className="font-bold">{feature.properties.name}</div>
                                    <div className="text-xs text-gray-600">{feature.properties.description}</div>
                                </div>
                            </Popup>
                        </Polyline>
                    );
                } else if (feature.geometry.type === "MultiLineString") {
                    return feature.geometry.coordinates.map((lineCoords, lineIndex) => (
                        <Polyline
                            key={`fault-${index}-${lineIndex}`}
                            positions={lineCoords.map(coord => [coord[1], coord[0]])}
                            pathOptions={{
                                color: "#DC2626",
                                weight: weight,
                                opacity: 0.8,
                            }}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <div className="font-bold">{feature.properties.name}</div>
                                    <div className="text-xs text-gray-600">{feature.properties.description}</div>
                                </div>
                            </Popup>
                        </Polyline>
                    ));
                }
                return null;
            })}
        </MapContainer>
    );
}
