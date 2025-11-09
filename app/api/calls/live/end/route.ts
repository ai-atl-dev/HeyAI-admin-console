import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { call_id } = body;

    if (!call_id) {
      return NextResponse.json(
        { error: "call_id is required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Delete from live_calls when call ends
    const query = `
      DELETE FROM \`${DATASET}.live_calls\`
      WHERE call_id = '${call_id.replace(/'/g, "\\'")}'
    `;

    await bigquery.query({ query });

    return NextResponse.json({
      success: true,
      message: "Live call ended and removed from tracking"
    });
  } catch (error) {
    console.error("Error ending live call:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to end live call"
      },
      { status: 500 }
    );
  }
}
