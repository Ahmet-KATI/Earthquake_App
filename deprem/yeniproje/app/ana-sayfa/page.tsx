"use client";

import BottomNav from "@/components/BottomNav";
import { MapPin, Bell, AlertCircle, CheckCircle, Clock, HelpCircle, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const [locationPermission, setLocationPermission] = useState<PermissionState | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

    useEffect(() => {
        // Check current permissions
        if (typeof window !== 'undefined') {
            // Check notification permission
            if ('Notification' in window) {
                setNotificationPermission(Notification.permission);
            }

            // Check location permission
            if ('permissions' in navigator) {
                navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                    setLocationPermission(result.state);
                    result.onchange = () => {
                        setLocationPermission(result.state);
                    };
                });
            }
        }
    }, []);

    const requestLocationPermission = async () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    alert('Konum izni verildi! Koordinatlar: ' + position.coords.latitude + ', ' + position.coords.longitude);
                    // Refresh permission state
                    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                        setLocationPermission(result.state);
                    });
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        alert('Konum izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.');
                    }
                }
            );
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
                new Notification('DepremBilgi', {
                    body: 'Bildirim izni başarıyla verildi!',
                    icon: '/icon.png'
                });
            } else if (permission === 'denied') {
                alert('Bildirim izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.');
            }
        }
    };

    const issuesCount = (
        (locationPermission !== 'granted' ? 1 : 0) +
        (notificationPermission !== 'granted' ? 1 : 0)
    );

    const handleTestAlert = () => {
        // Navigate to test alert page with sample data
        router.push('/deprem-uyari?test=true&magnitude=5.5&distance=150&location=Gürcistan&depth=5&direction=N');
    };

    const handleSimulator = () => {
        alert('Simülatör yakında eklenecek!');
    };

    const handleHowItWorks = () => {
        alert('Nasıl çalışır rehberi yakında eklenecek!');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'DepremBilgi',
                text: 'Türkiye\'deki depremleri anlık takip et!',
                url: window.location.href
            });
        } else {
            alert('Paylaşım özelliği bu cihazda desteklenmiyor.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-background transition-colors duration-300">
            {/* Header with gradient background */}
            <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                <div className="container relative px-6 py-12">
                    <div className="flex items-center gap-3 mb-2">
                        <ActivityIcon className="h-10 w-10" />
                        <h1 className="text-3xl font-black">DepremBilgi</h1>
                    </div>
                    <p className="text-blue-100 text-sm max-w-sm">
                        Türkiye'deki deprem verilerini anlık takip edin ve güvende kalın
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-gradient-to-b from-secondary/30 to-background">
                <div className="container px-4 py-6 space-y-6">
                    {/* Action Buttons Section */}
                    <section className="bg-card text-card-foreground rounded-2xl p-6 shadow-lg border border-border">
                        <h2 className="text-center text-base font-medium mb-4 leading-relaxed">
                            Akıllı telefonunuz tarafından yakın zamanda alınan gerçek zamanlı uyarı yok
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleTestAlert} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl font-medium text-sm transition-colors active:scale-95">
                                <Bell className="h-4 w-4" />
                                Test uyarısı
                            </button>
                            <button onClick={handleShare} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-xl font-medium text-sm transition-colors active:scale-95">
                                <Share2 className="h-4 w-4" />
                                Uygul. Paylaş
                            </button>
                        </div>
                    </section>

                    {/* Required Fixes Section */}
                    <section>
                        <h2 className="text-lg font-bold mb-4 px-2 text-foreground">Zorunlu düzeltmeler</h2>
                        <p className="text-sm text-muted-foreground mb-4 px-2">
                            Gerçek zamanlı deprem uyarıları ve yakındaki bildirim girişimine katkıda bulunmak için gerekli
                        </p>

                        <div className="space-y-3">
                            {/* Location Permission Card */}
                            {locationPermission !== 'granted' && (
                                <button
                                    onClick={requestLocationPermission}
                                    className="w-full bg-card text-card-foreground rounded-2xl border-2 border-border p-5 shadow-sm hover:shadow-md transition-all text-left active:scale-[0.98]"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold mb-1">Cihazınızın konum belirleme özelliği</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Cihazınızın konum belirleme özelliği devre dışıdır. Deprem bildirimleri ve uyarıları almak için aşağıdaki düğmeyi tıklayın ve konum belirleme özelliğini etkinleştirin. Pil tasarruf modunu seçebilirsiniz, GPS gerektirmemektedir.
                                            </p>
                                            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                                                Çözün
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )}

                            {/* Notification Permission Card */}
                            <button
                                onClick={requestNotificationPermission}
                                className="w-full bg-card text-card-foreground rounded-2xl border-2 border-border p-5 shadow-sm hover:shadow-md transition-all text-left active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                                        <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold mb-1">Tam ekran uyarı mesajı</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                            Cihaz kilitlendiğinde sismik uyarı mesajını hemen görmek için uygulamanın tam ekran uyarı göstermesine izin vermek için aşağıdaki düğmeyi tıklayın ve uygulama ayarlarında izin verin.
                                        </p>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                                            Çözün
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* Success Message */}
                    {issuesCount === 0 && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg mb-1">Tüm izinler verildi!</h3>
                                    <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                        Deprem uyarılarını ve bildirimleri almak için tüm gerekli izinler aktif. Güvende kalmaya devam edin!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Section */}
                    <section className="bg-card text-card-foreground rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Deprem Takibi</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Bu uygulama Türkiye'de meydana gelen depremleri anlık olarak takip eder.
                                    Kandilli Rasathanesi ve AFAD kaynaklarından güncel deprem verilerini görebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </section>
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
