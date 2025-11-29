"use client";

import { useState, useEffect } from "react";
import { Volume2, Phone, MessageSquare, AlertTriangle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

// Add type definition for ImageCapture if it's not available in the environment
declare global {
    class ImageCapture {
        constructor(track: MediaStreamTrack);
        getPhotoCapabilities(): Promise<any>;
        takePhoto(): Promise<Blob>;
    }
}

export default function EmergencyPage() {
    const [sirenActive, setSirenActive] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const router = useRouter();

    // Flashlight logic
    useEffect(() => {
        let track: MediaStreamTrack | null = null;

        const toggleFlash = async () => {
            if (flashActive) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: 'environment'
                        }
                    });
                    track = stream.getVideoTracks()[0];
                    const imageCapture = new ImageCapture(track);
                    const capabilities = await imageCapture.getPhotoCapabilities();

                    // Note: 'torch' is not standard in all browsers yet, but this is the common way to access it
                    // We use 'advanced' constraints for torch
                    await track.applyConstraints({
                        advanced: [{ torch: true } as any]
                    });
                } catch (err) {
                    console.error("Flashlight access denied or not supported:", err);
                    // Fallback to screen flash if hardware flash fails
                    const interval = setInterval(() => {
                        document.body.classList.toggle("bg-white");
                        document.body.classList.toggle("bg-red-600");
                    }, 500);
                    return () => {
                        clearInterval(interval);
                        document.body.classList.remove("bg-white", "bg-red-600");
                    };
                }
            } else {
                if (track) {
                    track.stop();
                    track = null;
                }
            }
        };

        const cleanup = toggleFlash();

        return () => {
            if (track) {
                track.stop();
            }
            // Ensure cleanup of fallback effect
            document.body.classList.remove("bg-white", "bg-red-600");
        };
    }, [flashActive]);

    const handleCallEmergency = () => {
        window.open('tel:112');
    };

    const sendEmergencyMessage = async (message: string) => {
        const savedContacts = localStorage.getItem('emergencyContacts');
        if (!savedContacts) {
            alert('Lütfen önce ayarlardan acil durum kişisi ekleyin!');
            router.push('/ayarlar');
            return;
        }

        const contacts = JSON.parse(savedContacts);
        if (contacts.length === 0) {
            alert('Lütfen önce ayarlardan acil durum kişisi ekleyin!');
            router.push('/ayarlar');
            return;
        }

        let locationText = '';
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            locationText = `Konumum: https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;
        } catch (error) {
            console.error('Location error:', error);
            locationText = 'Konum alınamadı.';
        }

        const fullMessage = `${message} ${locationText}`;
        const phoneNumbers = contacts.map((c: any) => c.number).join(',');

        // Open SMS app
        window.open(`sms:${phoneNumbers}?body=${encodeURIComponent(fullMessage)}`);
    };

    const handleImSafe = () => {
        sendEmergencyMessage('Ben güvendeyim, merak etmeyin.');
    };

    const handleUnderDebris = () => {
        sendEmergencyMessage('ENKAZ ALTINDAYIM! LÜTFEN YARDIM EDİN!');
    };

    return (
        <div className="min-h-screen bg-red-600 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden pb-20">
            {/* Back Button */}
            <button
                onClick={() => router.push("/ana-sayfa")}
                className="absolute top-4 left-4 z-20 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
                <ArrowLeft className="h-5 w-5 text-red-600" />
            </button>

            {/* Background Pulse Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-red-500 rounded-full animate-ping opacity-20"></div>
            </div>

            <div className="z-10 w-full max-w-md space-y-8 text-center">
                <div className="space-y-2">
                    <AlertTriangle className="h-16 w-16 mx-auto animate-bounce" />
                    <h1 className="text-4xl font-black uppercase tracking-wider">ACİL DURUM</h1>
                    <p className="text-red-100 font-medium">Sakin olun ve güvenli bir yere geçin.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleUnderDebris}
                        className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-white/20 bg-red-800 hover:bg-red-900 transition-all active:scale-95 animate-pulse"
                    >
                        <AlertTriangle className="h-8 w-8" />
                        <span className="font-bold text-sm">ENKAZ ALTINDAYIM</span>
                    </button>

                    <button
                        onClick={() => setFlashActive(!flashActive)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-white/20 transition-all active:scale-95",
                            flashActive ? "bg-white text-red-600" : "bg-red-700 hover:bg-red-800"
                        )}
                    >
                        <div className="h-8 w-8 rounded-full border-4 border-current" />
                        <span className="font-bold">FLAŞ</span>
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleCallEmergency}
                        className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95"
                    >
                        <Phone className="h-6 w-6" />
                        112 ACİL ARA
                    </button>

                    <button
                        onClick={handleImSafe}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 border border-white/20 transition-transform active:scale-95 shadow-lg"
                    >
                        <MessageSquare className="h-6 w-6" />
                        GÜVENDEYİM MESAJI AT
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
