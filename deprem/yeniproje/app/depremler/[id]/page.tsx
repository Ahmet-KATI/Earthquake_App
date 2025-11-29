"use client";

import { useEffect, useState } from "react";
import { Earthquake, getRecentEarthquakes } from "@/lib/api";
import { getMagnitudeColor, cn } from "@/lib/utils";
import { ArrowLeft, Clock, Activity, MapPin, Share2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues with Leaflet
const EarthquakeMap = dynamic(() => import("@/components/EarthquakeMap"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-secondary animate-pulse rounded-lg" />,
});

export default function EarthquakeDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [earthquake, setEarthquake] = useState<Earthquake | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // In a real app, we would fetch by ID. For now, we find it in the mock list.
            const data = await getRecentEarthquakes();
            const found = data.find((eq) => eq.id === params.id);
            setEarthquake(found || null);
            setLoading(false);
        }
        fetchData();
    }, [params.id]);

    if (loading) return <div className="p-4 text-center">Yükleniyor...</div>;
    if (!earthquake) return <div className="p-4 text-center">Deprem bulunamadı.</div>;

    return (
        <div className="flex flex-col min-h-screen pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background/95 p-4 backdrop-blur">
                <button onClick={() => router.back()} className="rounded-full p-2 hover:bg-accent">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-lg font-bold truncate">{earthquake.location}</h1>
            </header>

            <main className="p-4 space-y-6">
                {/* Magnitude Card */}
                <div className="flex items-center justify-between rounded-xl border bg-card p-6 shadow-sm">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Büyüklük</p>
                        <p className="text-4xl font-bold text-foreground">
                            {earthquake.magnitude.toFixed(1)}
                        </p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-sm text-muted-foreground">Derinlik</p>
                        <p className="text-2xl font-semibold">{earthquake.depth} km</p>
                    </div>
                </div>

                {/* Map */}
                <div className="rounded-xl border overflow-hidden shadow-sm">
                    <EarthquakeMap
                        latitude={earthquake.latitude}
                        longitude={earthquake.longitude}
                        popupText={earthquake.location}
                    />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">Tarih</p>
                            <p className="font-medium">{earthquake.date}</p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">Saat</p>
                            <p className="font-medium">{earthquake.time}</p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">Enlem</p>
                            <p className="font-medium">{earthquake.latitude}</p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 space-y-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">Boylam</p>
                            <p className="font-medium">{earthquake.longitude}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `Deprem: ${earthquake.location}`,
                                    text: `${earthquake.location} bölgesinde ${earthquake.magnitude} büyüklüğünde deprem oldu.`,
                                    url: window.location.href,
                                }).catch(console.error);
                            } else {
                                // Fallback
                                navigator.clipboard.writeText(`${earthquake.location} - ${earthquake.magnitude} büyüklüğünde deprem. ${window.location.href}`);
                                alert("Bağlantı kopyalandı!");
                            }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Share2 className="h-5 w-5" />
                        Paylaş
                    </button>
                </div>
            </main>
        </div>
    );
}
