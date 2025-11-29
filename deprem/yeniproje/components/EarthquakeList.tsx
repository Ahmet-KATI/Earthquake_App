"use client";

import { useEffect, useState } from "react";
import { Earthquake, getRecentEarthquakes } from "@/lib/api";
import { getMagnitudeColor, cn } from "@/lib/utils";
import { MapPin, Clock, Activity } from "lucide-react";
import Link from "next/link";

export default function EarthquakeList() {
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getRecentEarthquakes();
                setEarthquakes(data);
            } catch (error) {
                console.error("Failed to fetch earthquakes", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="space-y-4 p-4">
            {earthquakes.map((eq) => (
                <Link key={eq.id} href={`/depremler/${eq.id}`}>
                    <div
                        className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-full font-bold shadow-sm",
                                    getMagnitudeColor(eq.magnitude)
                                )}
                            >
                                {eq.magnitude.toFixed(1)}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium leading-none">{eq.location}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{eq.time}</span>
                                    <span className="text-xs">•</span>
                                    <span>{eq.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Activity className="h-3 w-3" />
                                    <span>Derinlik: {eq.depth} km</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                            <span className="rounded-full bg-secondary px-2 py-1">
                                {eq.provider}
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
