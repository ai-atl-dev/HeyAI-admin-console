import { NextResponse } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

// Generate random phone number
function randomPhone() {
    return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

// Generate random agent ID
function randomAgent() {
    const agents = ["agent-001", "agent-002", "agent-003", "agent-004", "agent-005"];
    return agents[Math.floor(Math.random() * agents.length)];
}

// Generate random status
function randomStatus() {
    const statuses = ["completed", "completed", "completed", "completed", "failed", "busy"];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Generate random duration (30 seconds to 10 minutes)
function randomDuration() {
    return Math.floor(Math.random() * 570 + 30);
}

// Generate random cost based on duration
function randomCost(duration: number) {
    const costPerMinute = 0.05;
    return (duration / 60) * costPerMinute;
}

// Generate timestamp within last N days
function randomTimestamp(daysAgo = 30) {
    const now = new Date();
    const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(randomTime).toISOString();
}

// Generate sample calls data
function generateCalls(count = 100) {
    const calls = [];

    for (let i = 0; i < count; i++) {
        const duration = randomDuration();
        const status = randomStatus();
        const startTime = randomTimestamp(30);

        calls.push({
            call_id: `call-${Date.now()}-${i}`,
            caller_number: randomPhone(),
            agent_id: randomAgent(),
            status: status,
            duration: duration,
            cost: status === "completed" ? randomCost(duration) : 0,
            start_time: startTime,
            end_time: new Date(new Date(startTime).getTime() + duration * 1000).toISOString(),
        });
    }

    return calls;
}

// Generate sample usage history data
function generateUsageHistory(count = 50) {
    const usage = [];

    for (let i = 0; i < count; i++) {
        const timestamp = randomTimestamp(30);
        const callCount = Math.floor(Math.random() * 50 + 10);
        const totalMinutes = Math.floor(Math.random() * 500 + 100);

        usage.push({
            usage_id: `usage-${Date.now()}-${i}`,
            agent_id: randomAgent(),
            timestamp: timestamp,
            call_count: callCount,
            total_minutes: totalMinutes,
            total_cost: totalMinutes * 0.05,
        });
    }

    return usage;
}

// Generate sample payments data
function generatePayments(count = 20) {
    const payments = [];

    for (let i = 0; i < count; i++) {
        const amount = Math.floor(Math.random() * 500 + 50);

        payments.push({
            payment_id: `pay-${Date.now()}-${i}`,
            user_id: `user-${Math.floor(Math.random() * 10 + 1)}`,
            amount: amount,
            currency: "USD",
            status: Math.random() > 0.1 ? "completed" : "pending",
            payment_method: Math.random() > 0.5 ? "credit_card" : "bank_transfer",
            timestamp: randomTimestamp(60),
        });
    }

    return payments;
}

export async function POST(request: Request) {
    try {
        // Optional: Check for authorization
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get("secret");
        const seedSecret = process.env.SEED_SECRET;

        // Only check secret if SEED_SECRET is set in environment
        if (seedSecret && secret !== seedSecret) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const projectId = process.env.BIGQUERY_PROJECT_ID;
        const dataset = process.env.BIGQUERY_DATASET || "agent_data";
        const credentials = process.env.BIGQUERY_CREDENTIALS;

        if (!projectId || !credentials) {
            return NextResponse.json(
                { error: "Missing BigQuery configuration" },
                { status: 500 }
            );
        }

        const bigquery = new BigQuery({
            projectId,
            credentials: JSON.parse(credentials),
        });

        // Generate data
        const calls = generateCalls(100);
        const usageHistory = generateUsageHistory(50);
        const payments = generatePayments(20);

        // Insert calls
        await bigquery.dataset(dataset).table("calls").insert(calls);

        // Insert usage history
        await bigquery.dataset(dataset).table("usage_history").insert(usageHistory);

        // Insert payments
        await bigquery.dataset(dataset).table("payments").insert(payments);

        return NextResponse.json({
            success: true,
            message: "Data seeded successfully",
            summary: {
                calls: calls.length,
                usageHistory: usageHistory.length,
                payments: payments.length,
            },
        });
    } catch (error) {
        console.error("Error seeding data:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to seed data",
            },
            { status: 500 }
        );
    }
}
