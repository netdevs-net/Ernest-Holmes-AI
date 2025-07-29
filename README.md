# 🤖 Holmes AI - Ernest Holmes AI Application

A cutting-edge AI application that provides authentic spiritual guidance in the voice of Ernest Holmes, founder of Religious Science and author of *The Science of Mind*.

## 🌟 Overview

Holmes AI is a production-ready web application that allows users to have meaningful spiritual conversations with an AI trained on Ernest Holmes' complete works. The application maintains the authenticity of Holmes' voice while providing modern accessibility and user experience.

## ✨ Key Features

### 🤖 **Authentic AI Responses**
- Trained on 463,000+ words from Ernest Holmes' complete works
- Maintains authentic voice and teaching style
- Provides spiritually accurate guidance

### 💬 **Dual Response Modes**
- **"In His Words"** - Authentic Ernest Holmes voice and style
- **"Modern"** - Contemporary language while maintaining spiritual accuracy

### 📚 **Treatment Generator**
- Create personalized spiritual mind treatments
- Based on Ernest Holmes' treatment methodology
- Customizable for specific spiritual needs

### 💾 **Persistent Storage**
- SQLite database for question history
- Bookmark favorite questions and responses
- Anonymous user identification system

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Accessibility compliant (WCAG standards)
- Dark/light theme support
- Real-time typing indicators

### 📊 **Analytics Dashboard**
- User interaction insights
- Question and response analytics
- Performance metrics
- Usage patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/HolmesAI.git
   cd HolmesAI/holmes-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main app: `http://localhost:5173`
   - Admin dashboard: `http://localhost:5173/admin`

## 🏗️ Architecture

### **Frontend**
- **Framework**: Svelte 5 + SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Svelte stores
- **Routing**: SvelteKit file-based routing

### **Backend**
- **Runtime**: Node.js
- **Database**: SQLite with better-sqlite3
- **API**: SvelteKit API routes
- **Authentication**: Anonymous user identification

### **AI Integration**
- **Provider**: Anthropic Claude 3 Haiku
- **Training Data**: Ernest Holmes' complete works
- **Response Styles**: Dual-mode system
- **Context Management**: Conversation history

### **Data Processing**
- **Training Data**: 463,000+ words from authentic sources
- **Quote Integration**: 1,000+ verified Holmes quotes
- **Processing Scripts**: Python automation pipeline

## 📁 Project Structure

```
holmes-gpt/
├── src/
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   │   ├── ChatInterface.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── MessageBubble.svelte
│   │   │   ├── QuestionHistory.svelte
│   │   │   └── ...
│   │   ├── stores/              # Svelte stores
│   │   ├── db/                  # Database utilities
│   │   └── utils/               # Utility functions
│   ├── routes/
│   │   ├── api/                 # API endpoints
│   │   │   ├── chat/+server.ts
│   │   │   ├── questions/+server.ts
│   │   │   └── ...
│   │   ├── admin/+page.svelte   # Admin dashboard
│   │   ├── about/+page.svelte   # About page
│   │   ├── support/+page.svelte # Support page
│   │   ├── privacy/+page.svelte # Privacy policy
│   │   └── +page.svelte         # Main chat interface
│   └── app.css                  # Global styles
├── downloads/                   # Data processing
│   ├── training_data/           # AI training datasets
│   ├── scripts/                 # Python processing scripts
│   └── ...
├── resources/                   # Training materials
├── docs/                        # Documentation
└── static/                      # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database Configuration
DATABASE_PATH=./data/holmes.db

# Application Configuration
NODE_ENV=development
PORT=5173

# Security
SESSION_SECRET=your_session_secret
```

### Database Setup

The application uses SQLite for data storage. The database is automatically created on first run.

```bash
# Database will be created at: ./data/holmes.db
npm run dev
```

## 🎯 Usage

### **For Users**

1. **Start a Conversation**
   - Visit the application at `http://localhost:5173`
   - Type your spiritual question in the chat interface
   - Choose between "Modern" or "In His Words" response style

2. **Use the Treatment Generator**
   - Click the "Generate Treatment" button
   - Describe your spiritual need or concern
   - Receive a personalized spiritual mind treatment

3. **Manage Your History**
   - View your question history in the sidebar
   - Bookmark important questions and responses
   - Export your conversation data

### **For Administrators**

1. **Access Admin Dashboard**
   - Visit `http://localhost:5173/admin`
   - View user analytics and insights
   - Monitor system performance

2. **View Statistics**
   - User interaction metrics
   - Popular questions and topics
   - System usage patterns

## 🔐 Privacy & Security

### **Data Protection**
- **Anonymous Users**: No personal information collected
- **Secure Storage**: SQLite database with encryption
- **No Data Sales**: We never sell or trade user data
- **CSL Ownership**: All data owned by Centers for Spiritual Living

### **User Privacy**
- Anonymous user identification via device fingerprinting
- Optional data export and deletion
- Secure API communication
- Privacy-first design principles

## 🧪 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run test suite
npm run test:ui      # Run tests with UI

# Database
npm run db:reset     # Reset database
npm run db:migrate   # Run database migrations

# Linting
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### **Code Style**

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Svelte**: Component-based architecture

### **Testing**

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- src/lib/stores/themeStore.test.ts

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance

### **Optimizations**
- **Lazy Loading**: Components loaded on demand
- **Caching**: API responses cached for performance
- **Compression**: Assets compressed for faster loading
- **CDN Ready**: Static assets optimized for CDN delivery

### **Monitoring**
- **Real-time Metrics**: User interaction tracking
- **Performance Monitoring**: Response time analytics
- **Error Tracking**: Automated error reporting
- **Usage Analytics**: Comprehensive usage insights

## 🚀 Deployment

### **Production Build**

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### **Deployment Options**

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   npm run build
   # Deploy dist/ folder to Netlify
   ```

3. **Docker**
   ```bash
   docker build -t holmes-ai .
   docker run -p 3000:3000 holmes-ai
   ```

## 🤝 Contributing

### **Development Setup**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Submit a pull request**

### **Code Guidelines**

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation as needed
- Maintain accessibility standards
- Follow Svelte conventions

## 📚 Documentation

### **Technical Documentation**
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Component Library](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

### **Spiritual Resources**
- [Ernest Holmes' Works](./resources/holmes-writings.md)
- [Training Data](./downloads/training_data/)
- [Speech Patterns](./resources/speech-patterns-detailed.md)

## 🆘 Support

### **Getting Help**

- **Documentation**: Check the [docs](./docs/) folder
- **Issues**: Report bugs on GitHub
- **Discussions**: Join community discussions
- **Email**: support@holmesai.org

### **Common Issues**

1. **API Key Issues**
   - Ensure your Anthropic API key is valid
   - Check environment variable configuration

2. **Database Issues**
   - Verify database file permissions
   - Check database path configuration

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **Ernest Holmes** - For his timeless spiritual wisdom
- **Centers for Spiritual Living** - For spiritual guidance and authenticity
- **Anthropic** - For providing the Claude AI platform
- **Svelte Team** - For the amazing Svelte framework
- **Open Source Community** - For the tools and libraries that make this possible

---

## 🌟 Experience Holmes AI

Ready to experience authentic spiritual guidance from Ernest Holmes? 

**[Start your spiritual journey now](http://localhost:5173)**

---

*"The Science of Mind is a correlation of laws of science, opinions of philosophy, and revelations of religion, applied to human needs and the aspirations of man."* - Ernest Holmes

**Holmes AI** - Preserving Ernest Holmes' legacy through innovative technology. 🤖✨
