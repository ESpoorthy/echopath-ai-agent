# EchoPath AI Documentation

## Quick Start Guide

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ESpoorthy/echopath-ai-agent.git
   cd echopath-ai-agent
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r ../requirements.txt
   uvicorn main:app --reload
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Docker Setup

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Architecture Overview

EchoPath uses a multi-agent AI system with:

- **Frontend**: React + TypeScript with Tailwind CSS
- **Backend**: FastAPI with Python
- **AI Agents**: 5 specialized agents for therapy planning, speech analysis, adaptive learning, progress tracking, and compliance
- **Design**: Child-friendly interface with calm, warm colors

## Key Features

✅ **Multi-Agent AI System**
- Therapy Planner Agent
- Speech Analysis Agent  
- Adaptive Learning Agent
- Progress Tracking Agent
- Compliance Agent

✅ **Child-Friendly Interface**
- Soft beige/cream/orange color palette
- Gentle animations with elephants, rainbows, clouds
- Large, accessible typography
- Smooth interactions optimized for children

✅ **Real-Time Speech Analysis**
- Voice recording with Web Audio API
- AI-powered pronunciation feedback
- Phoneme-specific analysis
- Encouraging, supportive responses

✅ **Progress Tracking**
- Session streak counters
- Accuracy trend charts
- Milestone badges and rewards
- Parent/therapist dashboards

✅ **Safety & Compliance**
- HIPAA-compliant data handling
- Session safety monitoring
- Age-appropriate content filtering
- Comprehensive audit trails

## Demo Script

For hackathon presentations, see `docs/demo_script.md` for a complete 8-minute demo walkthrough.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.