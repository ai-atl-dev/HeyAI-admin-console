/**
 * Script to seed BigQuery with sample data for dashboard testing
 * 
 * Usage:
 * 1. Make sure you have .env.local with BigQuery credentials
 * 2. Run: node scripts/seed-bigquery.js
 */

const {
    BigQuery
} = require('@google-cloud/bigquery');

// Load environment variables
require('dotenv').config({
    path: '.env.local'
});

const projectId = process.env.BIGQUERY_PROJECT_ID;
const dataset = process.env.BIGQUERY_DATASET || 'agent_data';
const credentials = JSON.parse(process.env.BIGQUERY_CREDENTIALS || '{}');

const bigquery = new BigQuery({
    projectId,
    credentials,
});

// Generate random phone number
function randomPhone() {
    return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

// Generate random agent ID
function randomAgent() {
    const agents = ['agent-001', 'agent-002', 'agent-003', 'agent-004', 'agent-005'];
    return agents[Math.floor(Math.random() * agents.length)];
}

// Generate random status
function randomStatus() {
    const statuses = ['completed', 'completed', 'completed', 'completed', 'failed', 'busy'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

// Generate random duration (30 seconds to 10 minutes)
function randomDuration() {
    return Math.floor(Math.random() * 570 + 30);
}

// Generate random cost based on duration
function randomCost(duration) {
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
            cost: status === 'completed' ? randomCost(duration) : 0,
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
            currency: 'USD',
            status: Math.random() > 0.1 ? 'completed' : 'pending',
            payment_method: Math.random() > 0.5 ? 'credit_card' : 'bank_transfer',
            timestamp: randomTimestamp(60),
        });
    }

    return payments;
}

async function seedData() {
    try {
        console.log('🌱 Starting BigQuery data seeding...\n');

        // Generate data
        console.log('📊 Generating sample data...');
        const calls = generateCalls(100);
        const usageHistory = generateUsageHistory(50);
        const payments = generatePayments(20);

        console.log(`✓ Generated ${calls.length} calls`);
        console.log(`✓ Generated ${usageHistory.length} usage records`);
        console.log(`✓ Generated ${payments.length} payments\n`);

        // Insert calls
        console.log('📤 Inserting calls data...');
        await bigquery
            .dataset(dataset)
            .table('calls')
            .insert(calls);
        console.log('✓ Calls inserted successfully\n');

        // Insert usage history
        console.log('📤 Inserting usage history data...');
        await bigquery
            .dataset(dataset)
            .table('usage_history')
            .insert(usageHistory);
        console.log('✓ Usage history inserted successfully\n');

        // Insert payments
        console.log('📤 Inserting payments data...');
        await bigquery
            .dataset(dataset)
            .table('payments')
            .insert(payments);
        console.log('✓ Payments inserted successfully\n');

        console.log('🎉 Data seeding completed successfully!');
        console.log('\n📈 Summary:');
        console.log(`   - Total calls: ${calls.length}`);
        console.log(`   - Total usage records: ${usageHistory.length}`);
        console.log(`   - Total payments: ${payments.length}`);
        console.log('\n✨ You can now view the data in your dashboard!');

    } catch (error) {
        console.error('❌ Error seeding data:', error.message);
        if (error.errors) {
            console.error('Details:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
}

// Run the seeding
seedData();