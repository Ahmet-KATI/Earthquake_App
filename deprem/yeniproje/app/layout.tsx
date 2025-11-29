import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Deprem Bildirim Sistemi",
    description: "Anlık deprem bildirimleri ve acil durum yönetimi",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <ThemeProvider defaultTheme="system" storageKey="deprem-theme">
                    <main className="min-h-screen bg-background pb-16 transition-colors duration-300">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
