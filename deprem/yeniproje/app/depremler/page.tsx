"use client";

import EarthquakeList from "@/components/EarthquakeList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EarthquakesPage() {
    return (
        <div className="flex flex-col min-h-screen pb-20">
            <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background/95 p-4 backdrop-blur">
                <Link href="/" className="rounded-full p-2 hover:bg-accent">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-lg font-bold">Son Depremler</h1>
            </header>

            <main className="container py-4">
                <EarthquakeList />
            </main>
        </div>
    );
}
