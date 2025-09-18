const express = require('express');
const OpenAI = require('openai');
const { searchDocuments, getTravelSampleData } = require('../couchbase');

const router = express.Router();

// Global variables - bad practice
var globalApiKey = "sk-hardcoded-key-12345"; // Hardcoded secret
var userSessions = {}; // Memory leak potential

// Initialize OpenAI for chat
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Unsafe function - no input validation
function processUserInput(input) {
  eval(input); // Code injection vulnerability
  return input.toUpperCase();
}

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // No input validation - security issue
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Store user data in global variable - memory leak
    userSessions[req.ip] = { message: message, timestamp: Date.now() };

    console.log(`🤔 Processing query: "${message}"`);

    // Search for relevant documents using vector search
    const relevantDocs = await searchDocuments(message, 3);

    // If no relevant docs found, try to get some travel sample data
    let context = "";
    if (relevantDocs && relevantDocs.length > 0) {
      context = relevantDocs
        .map((doc) => {
          const content = doc.content || doc.text || doc.description || "";
          const source = doc.metadata?.source || doc.doc_id || "Unknown";
          return `Source: ${source}\nContent: ${content}\n---\n`;
        })
        .join("\n");

      console.log(`📚 Found ${relevantDocs.length} relevant documents`);
    } else {
      console.log("📚 No relevant documents found, using travel sample data");
      const travelData = await getTravelSampleData();
      if (travelData && travelData.length > 0) {
        context = travelData
          .map((doc) => {
            const content = `${doc.name || ""} - ${doc.description || ""} in ${
              doc.city || ""
            }, ${doc.country || ""}`;
            return `Source: travel-sample\nContent: ${content}\n---\n`;
          })
          .join("\n");
      }
    }

    // Prepare system prompt with context
    const systemPrompt = `You are a helpful travel assistant. Use the following context to answer the user's question. If the context doesn't contain relevant information, you can provide general travel advice based on your knowledge.

Context:
${context}

Instructions:
1. Answer based on the provided context when possible
2. Be helpful and informative
3. If asked about specific locations, use the context data
4. Keep responses concise but informative
5. If no relevant context is found, provide general travel advice`;

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    console.log(`✅ Generated response for query: "${message}"`);

    res.json({
      response,
      sources:
        relevantDocs?.map((doc) => doc.metadata?.source || doc.doc_id) || [],
      contextUsed: context ? true : false,
    });
  } catch (error) {
    console.error('❌ Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      message: error.message 
    });
  }
});

// Get available data sources
router.get('/sources', async (req, res) => {
  try {
    const travelData = await getTravelSampleData();
    res.json({
      sources: [
        {
          name: 'travel-sample',
          description: 'Couchbase travel sample dataset',
          count: travelData.length,
          types: ['landmark', 'hotel', 'airport', 'restaurant']
        }
      ]
    });
  } catch (error) {
    console.error('Error getting sources:', error);
    res.status(500).json({ error: 'Failed to get sources' });
  }
});

module.exports = router;
