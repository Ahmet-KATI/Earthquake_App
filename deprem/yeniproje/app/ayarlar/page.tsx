"use client";

import { Bell, MapPin, Moon, Volume2, ShieldAlert, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const { theme, setTheme } = useTheme();
    const [minMagnitude, setMinMagnitude] = useState(3.0);
    const [emergencyContacts, setEmergencyContacts] = useState<{ id: string, name: string, number: string }[]>([]);
    const [mounted, setMounted] = useState(false);

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load contacts from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('emergencyContacts');
        if (saved) {
            setEmergencyContacts(JSON.parse(saved));
        }
    }, []);

    // Save contacts to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    }, [emergencyContacts]);

    const handleAddContact = async () => {
        // In a real mobile app, this would use the Contacts API
        // For web demo, we'll simulate or use a prompt
        if ('contacts' in navigator && 'ContactsManager' in window) {
            try {
                const props = ['name', 'tel'];
                const opts = { multiple: true };
                const contacts = await (navigator as any).contacts.select(props, opts);
                if (contacts.length) {
                    const newContacts = contacts.map((c: any) => ({
                        id: Math.random().toString(36).substr(2, 9),
                        name: c.name[0],
                        number: c.tel[0]
                    }));
                    setEmergencyContacts(prev => [...prev, ...newContacts]);
                }
            } catch (ex) {
                // Fallback
                const name = prompt("Kişi Adı:");
                const number = prompt("Telefon Numarası:");
                if (name && number) {
                    setEmergencyContacts(prev => [...prev, { id: Date.now().toString(), name, number }]);
                }
            }
        } else {
            // Fallback for browsers without Contact Picker API
            const name = prompt("Kişi Adı:");
            const number = prompt("Telefon Numarası:");
            if (name && number) {
                setEmergencyContacts(prev => [...prev, { id: Date.now().toString(), name, number }]);
            }
        }
    };

    const handleFileSelect = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                alert(`Seçilen ses dosyası: ${file.name}`);
                // Here you would typically save the file or its path to state/storage
            }
        };
        input.click();
    };

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-background transition-colors duration-300">
            <header className="sticky top-0 z-10 border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border">
                <h1 className="text-lg font-bold text-foreground">Ayarlar</h1>
            </header>

            <div className="p-4 space-y-6">
                {/* Bildirim Ayarları */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Bildirimler
                    </h2>
                    <div className="bg-card text-card-foreground rounded-lg border border-border divide-y divide-border shadow-sm">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Deprem Bildirimleri</p>
                                    <p className="text-sm text-muted-foreground">
                                        Yeni depremlerden haberdar ol
                                    </p>
                                </div>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Minimum Büyüklük</span>
                                <span className="font-bold text-primary">{minMagnitude.toFixed(1)}</span>
                            </div>
                            <input
                                type="range"
                                min="1.0"
                                max="9.0"
                                step="0.1"
                                value={minMagnitude}
                                onChange={(e) => setMinMagnitude(parseFloat(e.target.value))}
                                className="w-full h-2 bg-secondary dark:bg-white rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-xs text-muted-foreground">
                                Sadece {minMagnitude} ve üzeri depremler için bildirim alırsınız.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Görünüm */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Uygulama Ayarları
                    </h2>
                    <div className="bg-card text-card-foreground rounded-lg border border-border divide-y divide-border shadow-sm">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center h-5 w-5">
                                    {mounted ? (
                                        theme === 'dark' ? (
                                            <Moon className="h-5 w-5 text-purple-500" />
                                        ) : theme === 'light' ? (
                                            <Sun className="h-5 w-5 text-orange-500" />
                                        ) : (
                                            <Monitor className="h-5 w-5 text-blue-500" />
                                        )
                                    ) : (
                                        <div className="h-5 w-5" /> // Placeholder to avoid layout shift
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">Tema</p>
                                    <p className="text-sm text-muted-foreground">
                                        {mounted ? (theme === 'dark' ? 'Karanlık' : theme === 'light' ? 'Aydınlık' : 'Sistem') : 'Sistem'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
                                <button
                                    onClick={() => setTheme("light")}
                                    className={cn(
                                        "p-1.5 rounded-full transition-all",
                                        theme === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    title="Aydınlık"
                                >
                                    <Sun className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setTheme("system")}
                                    className={cn(
                                        "p-1.5 rounded-full transition-all",
                                        theme === "system" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    title="Sistem"
                                >
                                    <Monitor className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setTheme("dark")}
                                    className={cn(
                                        "p-1.5 rounded-full transition-all",
                                        theme === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    title="Karanlık"
                                >
                                    <Moon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Volume2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="font-medium">Alarm Sesi</p>
                                    <p className="text-sm text-muted-foreground">
                                        Acil durum siren sesi
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleFileSelect}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Seç
                            </button>
                        </div>
                    </div>
                </section>

                {/* Acil Durum */}
                <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Güvenlik
                    </h2>
                    <div className="bg-card text-card-foreground rounded-lg border border-border p-4 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">Acil Durum Kişileri</p>
                                <p className="text-sm text-muted-foreground">
                                    Deprem anında SMS gönderilecek kişiler
                                </p>
                            </div>
                            <button
                                onClick={handleAddContact}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg transition-colors"
                            >
                                Seç
                            </button>
                        </div>

                        {emergencyContacts.length > 0 && (
                            <div className="space-y-2 mt-2 pt-2 border-t border-border">
                                {emergencyContacts.map(contact => (
                                    <div key={contact.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                                        <div>
                                            <p className="font-medium text-sm">{contact.name}</p>
                                            <p className="text-xs text-muted-foreground">{contact.number}</p>
                                        </div>
                                        <button
                                            onClick={() => setEmergencyContacts(prev => prev.filter(c => c.id !== contact.id))}
                                            className="text-destructive hover:text-destructive/90 text-xs font-medium"
                                        >
                                            Kaldır
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <BottomNav />
        </div>
    );
}

function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (c: boolean) => void }) {
    return (
        <button
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                checked ? "bg-primary" : "bg-input"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-background transition-transform shadow-sm",
                    checked ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    );
}
