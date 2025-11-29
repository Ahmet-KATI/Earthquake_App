import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, password } = body;

        if (!phone || !password) {
            return NextResponse.json(
                { error: "Telefon ve şifre zorunludur." },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { phoneNumber: phone },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı veya şifre hatalı." },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: "Şifre hatalı." },
                { status: 401 }
            );
        }

        // In a real app, we would set a session cookie here (JWT or similar).
        // For this MVP, we will return success and handle client-side state.

        return NextResponse.json(
            {
                message: "Giriş başarılı.",
                user: {
                    id: user.id,
                    name: user.name,
                    phone: user.phoneNumber
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu." },
            { status: 500 }
        );
    }
}
