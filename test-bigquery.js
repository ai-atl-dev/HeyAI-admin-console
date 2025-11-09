// Quick test script to verify BigQuery connection
require('dotenv').config();
const { BigQuery } = require('@google-cloud/bigquery');

async function testConnection() {
  console.log('Testing BigQuery connection...\n');

  // Check environment variables
  console.log('Environment variables:');
  console.log('- BIGQUERY_PROJECT_ID:', process.env.BIGQUERY_PROJECT_ID || 'MISSING');
  console.log('- BIGQUERY_DATASET:', process.env.BIGQUERY_DATASET || 'MISSING');
  console.log('- BIGQUERY_CREDENTIALS:', process.env.BIGQUERY_CREDENTIALS ? 'SET' : 'MISSING');
  console.log('');

  if (!process.env.BIGQUERY_PROJECT_ID || !process.env.BIGQUERY_CREDENTIALS) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
  }

  try {
    // Parse credentials
    const credentials = JSON.parse(process.env.BIGQUERY_CREDENTIALS);
    console.log('✓ Credentials parsed successfully');
    console.log('  Project ID from credentials:', credentials.project_id);
    console.log('  Client email:', credentials.client_email);
    console.log('');

    // Initialize BigQuery
    const bigquery = new BigQuery({
      projectId: process.env.BIGQUERY_PROJECT_ID,
      credentials: credentials,
    });
    console.log('✓ BigQuery client initialized');
    console.log('');

    // Test query - list datasets
    console.log('Testing query: Listing datasets...');
    const [datasets] = await bigquery.getDatasets();
    console.log('✓ Query successful!');
    console.log('  Available datasets:');
    datasets.forEach(dataset => console.log(`  - ${dataset.id}`));
    console.log('');

    // Check if our dataset exists
    const datasetId = process.env.BIGQUERY_DATASET;
    const datasetExists = datasets.some(ds => ds.id === datasetId);

    if (datasetExists) {
      console.log(`✓ Dataset "${datasetId}" found`);

      // List tables in the dataset
      const [tables] = await bigquery.dataset(datasetId).getTables();
      console.log('  Tables in dataset:');
      tables.forEach(table => console.log(`  - ${table.id}`));
      console.log('');

      // Check if agents table exists
      const agentsTableExists = tables.some(t => t.id === 'agents');
      if (agentsTableExists) {
        console.log('✓ "agents" table exists');

        // Try to count rows
        const query = `SELECT COUNT(*) as count FROM \`${process.env.BIGQUERY_PROJECT_ID}.${datasetId}.agents\``;
        const [rows] = await bigquery.query({ query });
        console.log(`  Current agent count: ${rows[0].count}`);
      } else {
        console.log('❌ "agents" table NOT found - you need to create it using the schema SQL');
      }
    } else {
      console.log(`❌ Dataset "${datasetId}" NOT found`);
      console.log('   You need to create the dataset in BigQuery first');
    }

    console.log('\n✅ BigQuery connection test completed successfully!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    process.exit(1);
  }
}

testConnection();
