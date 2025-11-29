import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, password } = body;

        if (!name || !phone || !password) {
            return NextResponse.json(
                { error: "Tüm alanlar zorunludur." },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber: phone },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu telefon numarası zaten kayıtlı." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                phoneNumber: phone,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "Kayıt başarılı.", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu." },
            { status: 500 }
        );
    }
}
