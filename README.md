# EchoPath AI - Speech Therapy Platform

A prototype AI-powered speech therapy platform designed for autistic children, featuring multi-agent AI systems and real-time speech analysis.

## 🎯 Overview

EchoPath is a web-based speech therapy platform that uses artificial intelligence to provide personalized speech exercises and real-time pronunciation feedback. The platform features a child-friendly interface with autism-friendly design principles and comprehensive progress tracking.

## 🚀 Features

### 🧠 Multi-Agent AI System
- **Therapy Planner Agent**: Generates personalized session plans
- **Speech Analysis Agent**: Real-time pronunciation accuracy evaluation
- **Adaptive Learning Agent**: Dynamic difficulty adjustment based on performance
- **Progress Tracking Agent**: Comprehensive analytics and progress monitoring
- **Compliance Agent**: Session logging and data handling

### 👶 Child-Centered Design
- Autism-friendly color palette (soft beige, cream, light orange)
- Gentle animations and intuitive controls
- Large, accessible typography
- Reward systems with progress visualization and badges

### 📊 Speech Analysis Features
- Real-time speech-to-text using browser Speech Recognition API
- Pronunciation accuracy scoring using Levenshtein distance algorithm
- Phoneme-specific feedback and tips
- Text-to-speech instructions for accessibility
- Session progress tracking and analytics

### 🔒 Privacy & Safety
- Local browser-based speech processing
- No audio data stored on servers
- Environment-based configuration for security
- Child-safe interface design

## 🏗️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Web Speech API** for speech processing
- **React Router** for navigation

### Backend
- **FastAPI** with Python 3.9+
- **Multi-Agent Architecture** with mock AI responses
- **Environment-based configuration**
- **RESTful API** design
- **CORS** enabled for local development

### Development Tools
- **Docker** support with docker-compose
- **Hot reload** for development
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** 16+ and npm
- **Python** 3.9+
- **Git**

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/ESpoorthy/echopath-ai-agent.git
cd echopath-ai-agent
```

2. **Setup environment variables**
```bash
cp .env.example .env
# The default .env values work for local development
```

3. **Install backend dependencies**
```bash
pip install -r requirements.txt
```

4. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

5. **Start the backend server**
```bash
cd backend
python3 main.py
# Backend will run on http://localhost:8000
```

6. **Start the frontend (in a new terminal)**
```bash
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

### Alternative: Docker Setup

```bash
# Build and start both services
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 🎮 Demo Flow

1. **Landing Page**: Visit http://localhost:3000
2. **Create Profile**: Click "Start Your Journey" to add a child profile
3. **Dashboard**: View child profiles and progress analytics
4. **Speech Session**: Click "Try Voice Demo" or "Start Session" on any child card
5. **Voice Practice**: Follow on-screen instructions to practice pronunciation
6. **Real-time Feedback**: Receive AI-powered pronunciation analysis
7. **Progress Tracking**: View session results and improvement metrics

## 📁 Project Structure

```
echopath-ai-agent/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API and speech services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions and mock data
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # FastAPI Python backend
│   ├── agents/             # AI agent implementations
│   ├── models/             # Data models
│   ├── routes/             # API route handlers
│   ├── utils/              # Backend utilities
│   └── main.py             # FastAPI application entry point
├── docs/                   # Documentation files
├── .env.example            # Environment variables template
├── requirements.txt        # Python dependencies
└── docker-compose.yml      # Docker configuration
```

## 🧪 Testing

### Backend API Testing
```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test speech analysis
curl -X POST http://localhost:8000/api/analyze-pronunciation \
  -F "transcription=red" \
  -F "target_word=red" \
  -F "target_sound=r" \
  -F "child_id=1"
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📞 Support

- 📧 **Email**: saispoorthyeturu6@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/ESpoorthy/echopath-ai-agent/issues)
- 📖 **Documentation**: Available in `/docs` folder

## 📄 License

Licensed under MIT License. See [LICENSE](LICENSE) for details.

---

**Built with ❤️ for children, families, and speech-language pathologists worldwide.**

*EchoPath AI - Where technology meets compassionate care.*
