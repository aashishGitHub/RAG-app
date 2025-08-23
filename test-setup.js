#!/usr/bin/env node

/**
 * Test script to verify Couchbase connection and basic functionality
 * Run this after setting up your .env file
 */

require('dotenv').config({ path: './server/.env' });

async function testSetup() {
  console.log('🧪 Testing RAG Chat Application Setup');
  console.log('=====================================\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  const requiredVars = [
    'COUCHBASE_CONNECTION_STRING',
    'COUCHBASE_USERNAME', 
    'COUCHBASE_PASSWORD',
    'COUCHBASE_BUCKET_NAME',
    'OPENAI_API_KEY'
  ];

  let envOk = true;
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${varName.includes('PASSWORD') ? '***' : value}`);
    } else {
      console.log(`  ❌ ${varName}: Not set`);
      envOk = false;
    }
  });

  if (!envOk) {
    console.log('\n❌ Please set all required environment variables in server/.env');
    return;
  }

  console.log('\n🔌 Testing Couchbase Connection...');
  
  try {
    // Test Couchbase connection
    const { initializeCouchbase, getTravelSampleData } = require('./server/couchbase');
    
    await initializeCouchbase();
    console.log('  ✅ Couchbase connection successful');
    
    // Test data retrieval
    const travelData = await getTravelSampleData();
    console.log(`  ✅ Retrieved ${travelData.length} travel sample records`);
    
    if (travelData.length > 0) {
      console.log('  📊 Sample data preview:');
      travelData.slice(0, 3).forEach((item, index) => {
        console.log(`    ${index + 1}. ${item.name || 'N/A'} - ${item.city || 'N/A'}, ${item.country || 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.log(`  ❌ Couchbase connection failed: ${error.message}`);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('  1. Ensure Couchbase is running on localhost:8091');
    console.log('  2. Check username/password in .env file');
    console.log('  3. Verify the travel-sample bucket exists');
    return;
  }

  console.log('\n🧪 Testing OpenAI API...');
  
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Test with a simple embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: 'test',
    });
    
    if (response.data && response.data[0].embedding) {
      console.log(`  ✅ OpenAI API working (embedding dimensions: ${response.data[0].embedding.length})`);
    } else {
      console.log('  ❌ OpenAI API response format unexpected');
    }
    
  } catch (error) {
    console.log(`  ❌ OpenAI API test failed: ${error.message}`);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('  1. Check your OpenAI API key is valid');
    console.log('  2. Ensure you have credits in your OpenAI account');
    console.log('  3. Check API rate limits');
    return;
  }

  console.log('\n🎯 Testing Vector Search Index...');
  
  try {
    const { scope } = require('./server/couchbase');
    const queryIndexManager = scope.queryIndexes();
    const indexes = await queryIndexManager.getAllIndexes();
    
    const vectorIndexes = indexes.filter(index => 
      index.indexKey && index.indexKey.some(key => key.includes('vector'))
    );
    
    if (vectorIndexes.length > 0) {
      console.log('  ✅ Vector search indexes found:');
      vectorIndexes.forEach(index => {
        console.log(`    - ${index.name || 'Unnamed'}: ${index.indexKey.join(', ')}`);
      });
    } else {
      console.log('  ⚠️  No vector search indexes found');
      console.log('  📖 Follow the guide to create vector search index:');
      console.log('     https://www.couchbase.com/blog/guide-to-data-prep-for-rag/');
    }
    
  } catch (error) {
    console.log(`  ⚠️  Could not check vector search indexes: ${error.message}`);
  }

  console.log('\n🎉 Setup test completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the backend: cd server && npm run dev');
  console.log('2. Start the frontend: npm run dev');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('4. Try asking questions about travel destinations!');
}

// Run the test
testSetup().catch(console.error);
