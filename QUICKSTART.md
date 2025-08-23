# 🚀 Quick Start Guide

Get your RAG Chat Application running in 5 minutes!

## ⚡ Prerequisites Check

- ✅ Couchbase Server running on `localhost:8091`
- ✅ Node.js 18+ installed
- ✅ OpenAI API key ready

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# Run the setup script (macOS/Linux)
./setup.sh

# Or on Windows
setup.bat

# Or manually
npm install
cd server && npm install && cd ..
```

### 2. Configure Environment
```bash
# Copy and edit the environment file
cp server/env.example server/.env
# Edit server/.env with your credentials
```

### 3. Test Setup
```bash
# Verify everything is working
node test-setup.js
```

### 4. Start the Application
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend  
npm run dev
```

### 5. Open Your Browser
Navigate to `http://localhost:3000` and start chatting!

## 🧪 Test It Out

Try these sample queries:
- "Tell me about hotels in Paris"
- "What landmarks are in London?"
- "Recommend restaurants in New York"

## 🔧 If Something Goes Wrong

1. **Check Couchbase**: Open `http://localhost:8091/ui/index.html`
2. **Verify .env**: Ensure all variables are set correctly
3. **Run test script**: `node test-setup.js` for diagnostics
4. **Check logs**: Look at terminal output for error messages

## 📖 Need More Help?

- 📚 Full documentation: [README.md](README.md)
- 🔗 Couchbase RAG Guide: [https://www.couchbase.com/blog/guide-to-data-prep-for-rag/](https://www.couchbase.com/blog/guide-to-data-prep-for-rag/)
- 🐛 Issues: Check the troubleshooting section in README.md

---

**Happy Chatting! 🎉**
