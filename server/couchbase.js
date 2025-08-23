const couchbase = require('couchbase');
const OpenAI = require('openai');

let cluster, bucket, scope, collection;
let openai;

// Initialize OpenAI for embeddings
function initializeOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  openai = new OpenAI({ apiKey });
}

// Initialize Couchbase connection
async function initializeCouchbase() {
  try {
    initializeOpenAI();
    
    const connectionString = process.env.COUCHBASE_CONNECTION_STRING || 'couchbase://localhost';
    const username = process.env.COUCHBASE_USERNAME || 'Administrator';
    const password = process.env.COUCHBASE_PASSWORD || 'password';
    const bucketName = process.env.COUCHBASE_BUCKET_NAME || 'travel-sample';
    const scopeName = process.env.COUCHBASE_SCOPE_NAME || '_default';
    const collectionName = process.env.COUCHBASE_COLLECTION_NAME || '_default';

    // Connect to cluster
    cluster = await couchbase.connect(connectionString, {
      username,
      password,
    });

    // Open bucket, scope, and collection
    bucket = cluster.bucket(bucketName);
    scope = bucket.scope(scopeName);
    collection = scope.collection(collectionName);

    console.log(`Connected to bucket: ${bucketName}, scope: ${scopeName}, collection: ${collectionName}`);
    
    // Initialize vector search index if it doesn't exist
    await initializeVectorSearch();
    
  } catch (error) {
    console.error('Error initializing Couchbase:', error);
    throw error;
  }
}

// Initialize vector search index
async function initializeVectorSearch() {
  try {
    const queryIndexManager = scope.queryIndexes();
    
    // Check if vector search index exists
    const indexes = await queryIndexManager.getAllIndexes();
    const vectorIndexExists = indexes.some(index => 
      index.name === 'vector_search_index' || 
      index.indexKey.includes('vector')
    );

    if (!vectorIndexExists) {
      console.log('⚠️  Vector search index not found. You need to create it manually in Couchbase UI.');
      console.log('📖 Follow the guide: https://www.couchbase.com/blog/guide-to-data-prep-for-rag/');
    } else {
      console.log('✅ Vector search index found');
    }
  } catch (error) {
    console.warn('Could not check vector search index:', error.message);
  }
}

// Generate embeddings using OpenAI
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

// Store document with embeddings
async function storeDocumentWithEmbedding(document, type = 'custom') {
  try {
    const docId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate embedding for the content
    const content = document.content || document.text || '';
    const embedding = await generateEmbedding(content);
    
    // Prepare document for storage
    const docToStore = {
      ...document,
      type,
      embedding,
      timestamp: new Date().toISOString(),
      metadata: {
        source: document.source || 'unknown',
        contentType: type,
        ...document.metadata
      }
    };

    // Store in Couchbase
    await collection.insert(docId, docToStore);
    
    console.log(`✅ Document stored with ID: ${docId}`);
    return docId;
  } catch (error) {
    console.error('Error storing document:', error);
    throw error;
  }
}

// Search documents using vector similarity
async function searchDocuments(query, limit = 5) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    
    // Vector search query (this assumes you have a vector search index)
    const searchQuery = `
      SELECT 
        META().id as doc_id,
        content,
        text,
        metadata,
        VECTOR_DISTANCE(embedding, $queryEmbedding, 'cosine') as similarity
      FROM \`${process.env.COUCHBASE_BUCKET_NAME}\`.\`${process.env.COUCHBASE_SCOPE_NAME}\`.\`${process.env.COUCHBASE_COLLECTION_NAME}\`
      WHERE embedding IS NOT NULL
      ORDER BY similarity ASC
      LIMIT $limit
    `;

    const result = await scope.query(searchQuery, {
      parameters: {
        queryEmbedding,
        limit
      }
    });

    return result.rows;
  } catch (error) {
    console.error('Error searching documents:', error);
    
    // Fallback to simple text search if vector search fails
    console.log('Falling back to text search...');
    return await fallbackTextSearch(query, limit);
  }
}

// Fallback text search
async function fallbackTextSearch(query, limit = 5) {
  try {
    const searchQuery = `
      SELECT 
        META().id as doc_id,
        content,
        text,
        metadata,
        1.0 as similarity
      FROM \`${process.env.COUCHBASE_BUCKET_NAME}\`.\`${process.env.COUCHBASE_SCOPE_NAME}\`.\`${process.env.COUCHBASE_COLLECTION_NAME}\`
      WHERE content LIKE $queryPattern OR text LIKE $queryPattern
      LIMIT $limit
    `;

    const queryPattern = `%${query}%`;
    const result = await scope.query(searchQuery, {
      parameters: {
        queryPattern,
        limit
      }
    });

    return result.rows;
  } catch (error) {
    console.error('Error in fallback search:', error);
    return [];
  }
}

// Get travel sample data for initial testing
async function getTravelSampleData() {
  try {
    const query = `
      SELECT 
        META().id as doc_id,
        name,
        description,
        city,
        country,
        type
      FROM \`travel-sample\`.\`_default\`.\`_default\`
      WHERE type IN ['landmark', 'hotel', 'airport', 'restaurant']
      LIMIT 10
    `;

    const result = await scope.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting travel sample data:', error);
    return [];
  }
}

// Close Couchbase connection
async function closeCouchbase() {
  try {
    if (cluster) {
      await cluster.close();
      console.log('✅ Couchbase connection closed');
    }
  } catch (error) {
    console.error('Error closing Couchbase connection:', error);
  }
}

module.exports = {
  initializeCouchbase,
  closeCouchbase,
  storeDocumentWithEmbedding,
  searchDocuments,
  getTravelSampleData,
  generateEmbedding,
  collection,
  scope,
  bucket,
  cluster
};
