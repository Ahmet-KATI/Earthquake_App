"use client";

import { useEffect, useState } from "react";
import { Earthquake, getRecentEarthquakes } from "@/lib/api";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import RiskLegend from "@/components/RiskLegend";

const EarthquakeMap = dynamic(() => import("@/components/EarthquakeMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-secondary animate-pulse" />,
});

export default function MapPage() {
    const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    return (
        <div className="flex flex-col h-screen pb-16">
            <header className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/ana-sayfa")}
                        className="h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-900" />
                    </button>
                    <h1 className="text-white font-bold text-lg drop-shadow-md">Deprem Haritası</h1>
                </div>
            </header>

            <div className="flex-1 relative z-0">
                <EarthquakeMap earthquakes={earthquakes} />
                <RiskLegend />
            </div>

            <BottomNav />
        </div>
    );
}
