# 🗄️ SQLite Implementation for HolmesAI

## 📋 **Overview**

This document describes the SQLite database implementation that replaces the localStorage-based storage system in HolmesAI. The new implementation provides persistent, scalable storage with advanced querying capabilities.

## 🏗️ **Architecture**

### **Database Schema**

```sql
-- Questions table
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('spiritual', 'practical', 'metaphysical', 'personal', 'general')),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_bookmarked BOOLEAN DEFAULT 0,
  tags TEXT, -- JSON array of tags
  response_preview TEXT,
  source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Conversations table
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  question_id TEXT,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  source TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- User preferences table
CREATE TABLE user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Performance Indexes**

```sql
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_timestamp ON questions(timestamp);
CREATE INDEX idx_questions_bookmarked ON questions(is_bookmarked);
CREATE INDEX idx_conversations_question_id ON conversations(question_id);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp);
```

## 📁 **File Structure**

```
src/lib/
├── db/
│   ├── database.ts              # Database manager singleton
│   ├── questionRepository.ts    # Question CRUD operations
│   └── conversationRepository.ts # Conversation CRUD operations
├── utils/
│   ├── sqliteStorage.ts         # Main storage interface
│   └── questionStorage.ts       # Legacy localStorage (for migration)
└── routes/api/
    ├── questions/
    │   ├── +server.ts           # Question API endpoints
    │   └── [id]/
    │       ├── +server.ts       # Individual question operations
    │       └── bookmark/
    │           └── +server.ts   # Bookmark operations
    └── stats/
        └── +server.ts           # Database statistics
```

## 🔧 **Key Components**

### **1. DatabaseManager (database.ts)**
- Singleton pattern for database connection
- Automatic schema initialization
- WAL mode for better concurrency
- Foreign key constraints enabled
- Database statistics and backup capabilities

### **2. QuestionRepository (questionRepository.ts)**
- Full CRUD operations for questions
- Advanced search and filtering
- Category-based queries
- Tag-based search
- Export/import functionality

### **3. ConversationRepository (conversationRepository.ts)**
- Conversation storage and retrieval
- Question-conversation relationships
- Date range queries
- Source-based filtering
- Statistics and analytics

### **4. SQLiteStorage (sqliteStorage.ts)**
- Unified interface for all storage operations
- Migration utilities from localStorage
- Backup and restore functionality
- Advanced query methods

## 🚀 **API Endpoints**

### **Questions API**

```typescript
// GET /api/questions - Get questions with filters
GET /api/questions?category=spiritual&search=truth&bookmarked=true&limit=10

// POST /api/questions - Create new question
POST /api/questions
{
  "question": "What is spiritual truth?",
  "category": "spiritual"
}

// PUT /api/questions/[id] - Update question
PUT /api/questions/q_1234567890
{
  "responsePreview": "Spiritual truth is...",
  "source": "claude-3-haiku"
}

// DELETE /api/questions/[id] - Delete question
DELETE /api/questions/q_1234567890

// POST /api/questions/[id]/bookmark - Toggle bookmark
POST /api/questions/q_1234567890/bookmark
```

### **Statistics API**

```typescript
// GET /api/stats - Get database statistics
GET /api/stats
```

**Response:**
```json
{
  "database": {
    "questions": 25,
    "conversations": 50,
    "size": "2.5 MB"
  },
  "conversations": {
    "total": 50,
    "bySource": {
      "claude-3-haiku": 45,
      "fallback": 5
    },
    "byDate": {
      "2025-07-28": 10,
      "2025-07-27": 15
    }
  },
  "questions": {
    "total": 25,
    "bookmarked": 8,
    "byCategory": {
      "spiritual": 10,
      "practical": 5,
      "metaphysical": 3,
      "personal": 4,
      "general": 3
    }
  }
}
```

## 🔄 **Migration from localStorage**

The system includes automatic migration from localStorage to SQLite:

```typescript
// Automatic migration on first load
await sqliteStorage.migrateFromLocalStorage();
```

**Migration Process:**
1. Check for existing localStorage data
2. Import questions to SQLite
3. Clear localStorage after successful migration
4. Log migration statistics

## 📊 **Advanced Features**

### **Search and Filtering**
```typescript
// Search by multiple criteria
const questions = sqliteStorage.searchQuestions({
  category: 'spiritual',
  searchTerm: 'truth',
  bookmarkedOnly: true,
  dateRange: { start: new Date('2025-07-01'), end: new Date() }
});
```

### **Tag-based Search**
```typescript
// Search by tags
const questions = sqliteStorage.searchByTags(['spiritual', 'healing']);
```

### **Conversation Analytics**
```typescript
// Get conversation statistics
const stats = sqliteStorage.getConversationStats();
```

### **Backup and Restore**
```typescript
// Export all data
const data = sqliteStorage.exportAllData();

// Import data
sqliteStorage.importAllData(data);
```

## 🔒 **Data Persistence**

### **Storage Location**
- Database file: `data/holmes.db`
- WAL files: `data/holmes.db-shm`, `data/holmes.db-wal`
- Automatic directory creation

### **Data Integrity**
- Foreign key constraints
- Check constraints for categories
- Automatic timestamps
- JSON validation for tags

### **Performance Optimizations**
- Prepared statements for all queries
- Indexed columns for fast searches
- WAL mode for concurrent access
- Connection pooling via singleton

## 🧪 **Testing**

### **Database Connection Test**
```bash
# Test database functionality
node test-sqlite.js
```

### **API Testing**
```bash
# Test question creation
curl -X POST http://localhost:5173/api/questions \
  -H "Content-Type: application/json" \
  -d '{"question": "What is spiritual truth?", "category": "spiritual"}'

# Test question retrieval
curl http://localhost:5173/api/questions?category=spiritual

# Test statistics
curl http://localhost:5173/api/stats
```

## 📈 **Benefits Over localStorage**

| Feature | localStorage | SQLite |
|---------|-------------|--------|
| **Persistence** | Browser-dependent | File system |
| **Storage Limit** | ~5-10MB | Unlimited |
| **Query Capabilities** | Basic filtering | Advanced SQL queries |
| **Data Relationships** | None | Foreign keys |
| **Backup/Restore** | Manual export | Built-in |
| **Concurrent Access** | Single browser | Multiple processes |
| **Data Integrity** | None | Constraints & validation |
| **Performance** | Linear search | Indexed queries |
| **Scalability** | Limited | High |

## 🚀 **Usage Examples**

### **Basic Question Operations**
```typescript
import sqliteStorage from '$lib/utils/sqliteStorage';

// Save a question
sqliteStorage.saveQuestion({
  question: "How can I find inner peace?",
  category: "spiritual",
  isBookmarked: false,
  tags: ["peace", "meditation", "inner-work"]
});

// Get all questions
const questions = sqliteStorage.getQuestions();

// Search questions
const spiritualQuestions = sqliteStorage.getQuestionsByCategory('spiritual');

// Toggle bookmark
sqliteStorage.toggleBookmark('q_1234567890');
```

### **Conversation Management**
```typescript
// Save a conversation
const conversationId = sqliteStorage.saveConversation({
  questionId: 'q_1234567890',
  userMessage: "How can I find inner peace?",
  assistantMessage: "Inner peace comes from recognizing...",
  source: 'claude-3-haiku'
});

// Get conversations for a question
const conversations = sqliteStorage.getConversationsByQuestionId('q_1234567890');

// Get recent conversations
const recent = sqliteStorage.getRecentConversations(10);
```

## 🔧 **Configuration**

### **Database Settings**
```typescript
// Database configuration in database.ts
const DB_DIR = join(process.cwd(), 'data');
const DB_PATH = join(DB_DIR, 'holmes.db');

// WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Enable foreign key constraints
db.pragma('foreign_keys = ON');
```

### **Performance Tuning**
```typescript
// Adjust query limits
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 1000;

// Cache frequently accessed data
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

## 🛠️ **Maintenance**

### **Database Backup**
```typescript
// Manual backup
const dbManager = DatabaseManager.getInstance();
dbManager.backup('/path/to/backup.db');
```

### **Database Statistics**
```typescript
// Get database stats
const stats = sqliteStorage.getDatabaseStats();
console.log(`Database size: ${stats.size}`);
console.log(`Questions: ${stats.questions}`);
console.log(`Conversations: ${stats.conversations}`);
```

### **Data Cleanup**
```typescript
// Clean old conversations (older than 30 days)
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const oldConversations = sqliteStorage.getConversationsByDateRange(
  new Date(0), 
  thirtyDaysAgo
);
```

## 🎯 **Future Enhancements**

1. **Full-text Search**: Implement FTS5 for advanced text search
2. **Data Encryption**: Add encryption for sensitive data
3. **Replication**: Multi-database synchronization
4. **Analytics Dashboard**: Real-time usage statistics
5. **Data Export Formats**: CSV, XML, and other formats
6. **Automated Backups**: Scheduled backup system
7. **Data Compression**: Compress large text fields
8. **Query Optimization**: Advanced query planning

---

**Last Updated**: July 28, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready 