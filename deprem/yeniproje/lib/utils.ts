import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getMagnitudeColor(magnitude: number): string {
    if (magnitude >= 7.0) return "bg-red-900 text-white";
    if (magnitude >= 6.0) return "bg-red-700 text-white";
    if (magnitude >= 5.0) return "bg-red-500 text-white";
    if (magnitude >= 4.0) return "bg-orange-500 text-white";
    if (magnitude >= 3.0) return "bg-yellow-500 text-black";
    return "bg-green-500 text-white";
}

export function formatDateTime(date: string, time: string) {
    return `${date} ${time}`;
}
