"use client";

import EarthquakeList from "@/components/EarthquakeList";
import BottomNav from "@/components/BottomNav";
import { Bell, Map, Settings, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <ActivityIcon className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-bold">DepremBilgi</h1>
                    </div>
                    <button
                        className="rounded-full p-2 hover:bg-accent"
                        onClick={() => alert("Bildirimler henüz aktif değil.")}
                    >
                        <Bell className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="container py-4">
                    <div className="mb-4 flex items-center justify-between px-4">
                        <h2 className="text-lg font-semibold">Son Depremler</h2>
                        <Link href="/depremler" className="text-sm text-primary hover:underline">
                            Tümünü Gör
                        </Link>
                    </div>

                    <EarthquakeList />
                </div>
            </main>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}

function ActivityIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}
