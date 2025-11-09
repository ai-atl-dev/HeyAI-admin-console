import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "https://heyai-backend-127756525541.us-central1.run.app";

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/live-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            liveUsers: data.liveUsers || 0,
            byAgent: data.byAgent || {},
        });
    } catch (error) {
        console.error("Error fetching live users:", error);
        return NextResponse.json(
            {
                success: false,
                liveUsers: 0,
                byAgent: {},
                error: error instanceof Error ? error.message : "Failed to fetch live users",
            },
            { status: 500 }
        );
    }
}
