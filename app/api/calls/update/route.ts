import { NextRequest, NextResponse } from "next/server";
import { getBigQueryClient, DATASET } from "@/lib/bigquery";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { call_id, ...updates } = body;

    if (!call_id) {
      return NextResponse.json(
        { error: "call_id is required" },
        { status: 400 }
      );
    }

    const bigquery = getBigQueryClient();

    // Build update query dynamically
    const updateFields: string[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) return;

      if (value === null) {
        updateFields.push(`${key} = NULL`);
      } else if (typeof value === 'string') {
        // Escape single quotes
        const escapedValue = value.replace(/'/g, "\\'");
        updateFields.push(`${key} = '${escapedValue}'`);
      } else if (typeof value === 'number') {
        updateFields.push(`${key} = ${value}`);
      } else if (typeof value === 'object') {
        updateFields.push(`${key} = JSON '${JSON.stringify(value)}'`);
      } else {
        updateFields.push(`${key} = '${value}'`);
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE \`${DATASET}.calls\`
      SET ${updateFields.join(', ')}
      WHERE call_id = '${call_id.replace(/'/g, "\\'")}'
    `;

    await bigquery.query({ query });

    return NextResponse.json({
      success: true,
      message: "Call record updated successfully"
    });
  } catch (error) {
    console.error("Error updating call record:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update call record"
      },
      { status: 500 }
    );
  }
}
