"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Earthquake } from "@/lib/api";
import Link from "next/link";

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
        </MapContainer>
    );
}
