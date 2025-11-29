"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AlertTriangle, Navigation, Clock, MapPin, X } from "lucide-react";
import dynamic from "next/dynamic";

const EarthquakeMap = dynamic(() => import("@/components/EarthquakeMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-800 animate-pulse" />,
});

function AlertContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Get alert data from URL params or use test data
    const isTest = searchParams.get('test') === 'true';
    const magnitude = parseFloat(searchParams.get('magnitude') || '5.5');
    const distance = parseFloat(searchParams.get('distance') || '150');
    const location = searchParams.get('location') || 'Gürcistan';
    const depth = parseFloat(searchParams.get('depth') || '5');
    const direction = searchParams.get('direction') || 'N';

    // Determine severity level and colors
    const getSeverityInfo = (mag: number) => {
        if (mag < 4.0) {
            return {
                level: 'info',
                color: 'bg-green-600',
                textColor: 'text-green-100',
                borderColor: 'border-green-500',
                title: 'Hafif Deprem',
                description: 'Genelde hissedilmez ya da çok hafif hissedilir',
                icon: '🟢'
            };
        } else if (mag < 5.5) {
            return {
                level: 'warning',
                color: 'bg-yellow-600',
                textColor: 'text-yellow-100',
                borderColor: 'border-yellow-500',
                title: 'Dikkat',
                description: 'Hissedilebilir, hafif sarsıntı, nadiren küçük hasar',
                icon: '🟡'
            };
        } else {
            return {
                level: 'critical',
                color: 'bg-red-600',
                textColor: 'text-red-100',
                borderColor: 'border-red-500',
                title: 'Kritik Uyarı',
                description: 'Hasar oluşturabilecek düzeyde deprem, dikkatli olunmalı',
                icon: '🔴'
            };
        }
    };

    const severity = getSeverityInfo(magnitude);

    // Audio and vibration effects
    useEffect(() => {
        let audioContext: AudioContext;
        let oscillator: OscillatorNode;
        let gainNode: GainNode;
        let vibrateInterval: NodeJS.Timeout;

        const startSiren = () => {
            try {
                // Create siren sound
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.3;

                oscillator.start();

                // Alternate frequency for siren effect
                let high = true;
                const sirenInterval = setInterval(() => {
                    oscillator.frequency.value = high ? 800 : 600;
                    high = !high;
                }, 500);

                // Vibration pattern (vibrate, pause, vibrate, pause...)
                if ('vibrate' in navigator) {
                    const vibratePattern = () => {
                        navigator.vibrate([500, 200, 500, 200, 500]);
                    };
                    vibratePattern();
                    vibrateInterval = setInterval(vibratePattern, 3000);
                }

                return () => {
                    clearInterval(sirenInterval);
                    if (vibrateInterval) clearInterval(vibrateInterval);
                    if (oscillator) oscillator.stop();
                    if (audioContext) audioContext.close();
                };
            } catch (error) {
                console.error('Audio/Vibration error:', error);
            }
        };

        const cleanup = startSiren();
        return cleanup;
    }, []);

    // Time elapsed counter
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleClose = () => {
        router.push('/ana-sayfa');
    };

    // Mock earthquake data for map
    const earthquakeData = [{
        id: '1',
        magnitude,
        location,
        latitude: 41.5,
        longitude: 44.5,
        depth,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('tr-TR'),
        time: new Date().toLocaleTimeString('tr-TR'),
        provider: (isTest ? 'Kandilli' : 'Kandilli') as 'Kandilli' | 'AFAD' | 'USGS'
    }];

    return (
        <div className={`min-h-screen ${severity.color} flex flex-col`}>
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
            >
                <X className="h-6 w-6 text-white" />
            </button>

            {/* Header */}
            <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-10 w-10 ${severity.textColor} animate-pulse`} />
                    <div>
                        <h1 className="text-white text-2xl font-black">
                            {isTest ? 'Test: ' : ''}{severity.title}
                        </h1>
                        <p className={`text-sm ${severity.textColor}`}>
                            {severity.description}
                        </p>
                    </div>
                </div>

                {/* Earthquake Info */}
                <div className={`bg-white/10 backdrop-blur rounded-xl p-4 border-2 ${severity.borderColor}`}>
                    <h2 className="text-white text-lg font-bold mb-2">
                        Deprem M{magnitude.toFixed(1)} {isTest ? '(tahmini)' : ''} {distance} km
                    </h2>
                    <p className="text-white/90 text-sm mb-3">
                        {isTest && '(Test) '}Size {distance} km uzaklıkta. Yön {direction}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-white">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            <span className="text-sm">Derinlik: {depth} km</span>
                        </div>
                    </div>
                </div>

                {/* Warning Message */}
                <div className="bg-orange-500 rounded-xl p-5 text-center shadow-lg">
                    <p className="text-white text-xl font-bold leading-tight">
                        {distance < 50 ? `${Math.round(distance)} km uzaklıkta deprem` : `${Math.round(distance)} km uzaklıkta sismik dalga`}
                    </p>
                    <p className="text-orange-100 text-sm mt-1">
                        Orta derecede sallanma bekliyoruz
                    </p>
                </div>

                {/* Time Counter */}
                <div className="flex items-center justify-center gap-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                        {timeElapsed} saniye önce
                    </span>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <EarthquakeMap earthquakes={earthquakeData} />
            </div>
        </div>
    );
}

export default function EarthquakeAlertPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-red-600 flex items-center justify-center">
            <div className="text-white text-xl">Yükleniyor...</div>
        </div>}>
            <AlertContent />
        </Suspense>
    );
}
