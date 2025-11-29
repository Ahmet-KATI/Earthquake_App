"use client";

import { Home, Activity, Map, AlertTriangle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/ana-sayfa", icon: Home, label: "Ana Ekran" },
        { href: "/", icon: Activity, label: "Durum" },
        { href: "/harita", icon: Map, label: "Haritalar" },
        { href: "/acil-durum", icon: AlertTriangle, label: "Acil", destructive: true },
        { href: "/ayarlar", icon: Settings, label: "Ayarlar" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2 z-50 border-border">
            <div className="grid grid-cols-5 gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all duration-200",
                                isActive
                                    ? "text-primary bg-primary/10 font-medium"
                                    : item.destructive
                                        ? "text-destructive hover:bg-destructive/10"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current opacity-20")} />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
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
