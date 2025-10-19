import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ invitationId: string }> }
) {
    const { invitationId } = await params;

    try {
        const data = await auth.api.acceptInvitation({
            body: {
                invitationId,
            },
            headers: await headers(),
        });

        console.log(data);
        return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
}