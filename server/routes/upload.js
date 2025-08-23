const express = require('express');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const cheerio = require('cheerio');
const { storeDocumentWithEmbedding } = require('../couchbase');

const router = express.Router();

// PDF upload endpoint
router.post('/', async (req, res) => {
  try {
    const { type } = req.body;
    
    if (type === 'pdf') {
      if (!req.file) {
        return res.status(400).json({ error: 'PDF file is required' });
      }
      
      console.log(`📄 Processing PDF upload: ${req.file.originalname}`);
      
      // Parse PDF content
      const pdfData = await pdfParse(req.file.buffer);
      const textContent = pdfData.text;
      
      if (!textContent || textContent.trim().length === 0) {
        return res.status(400).json({ error: 'Could not extract text from PDF' });
      }
      
      // Store in Couchbase with embeddings
      const document = {
        content: textContent,
        source: req.file.originalname,
        metadata: {
          fileName: req.file.originalname,
          fileSize: req.file.size,
          pageCount: pdfData.numpages,
          contentType: 'pdf'
        }
      };
      
      const docId = await storeDocumentWithEmbedding(document, 'pdf');
      
      res.json({
        success: true,
        message: 'PDF uploaded and processed successfully',
        documentId: docId,
        contentLength: textContent.length,
        pageCount: pdfData.numpages
      });
      
    } else if (type === 'web') {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      console.log(`🌐 Processing web page: ${url}`);
      
      // Fetch and parse web page
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RAG-Chat-Bot/1.0)'
        }
      });
      
      const $ = cheerio.load(response.data);
      
      // Extract text content (remove scripts, styles, etc.)
      $('script, style, nav, footer, header').remove();
      const textContent = $('body').text().replace(/\s+/g, ' ').trim();
      
      if (!textContent || textContent.length < 100) {
        return res.status(400).json({ error: 'Could not extract meaningful content from web page' });
      }
      
      // Store in Couchbase with embeddings
      const document = {
        content: textContent,
        source: url,
        metadata: {
          url: url,
          title: $('title').text().trim(),
          contentType: 'web',
          contentLength: textContent.length
        }
      };
      
      const docId = await storeDocumentWithEmbedding(document, 'web');
      
      res.json({
        success: true,
        message: 'Web page processed and stored successfully',
        documentId: docId,
        contentLength: textContent.length,
        title: $('title').text().trim()
      });
      
    } else {
      return res.status(400).json({ error: 'Invalid upload type. Use "pdf" or "web"' });
    }
    
  } catch (error) {
    console.error('❌ Error in upload endpoint:', error);
    
    if (error.code === 'ENOTFOUND') {
      return res.status(400).json({ error: 'Could not reach the specified URL' });
    }
    
    if (error.code === 'ECONNABORTED') {
      return res.status(400).json({ error: 'Request timeout. URL might be too slow to respond.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to process upload',
      message: error.message 
    });
  }
});

module.exports = router;
