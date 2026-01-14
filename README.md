# AegisAI - Multi-Agent Decision Intelligence Platform

> Transform complex business decisions into confident actions with explainable multi-agent AI

**AegisAI** is an advanced decision intelligence platform that leverages a multi-agent AI architecture to provide comprehensive, explainable business analysis. Unlike traditional AI tools that give you a black-box answer, AegisAI shows you exactly how it reached its conclusions through transparent reasoning and step-by-step analysis.

---

## Overview

AegisAI uses four specialized AI agents that work together to analyze business decisions from multiple angles:

- **Research Agent** - Gathers market data and competitive intelligence
- **Analysis Agent** - Evaluates viability, feasibility, and business potential  
- **Risk Agent** - Identifies and assesses risks with mitigation strategies
- **Decision Agent** - Synthesizes all data to make final GO/NO-GO/CONDITIONAL recommendations

Every decision comes with complete reasoning transparency, showing exactly how the AI reached its conclusions.

---

## Key Features

### Explainable AI
- Complete reasoning timeline showing how each agent contributed
- Confidence scores for every analysis phase
- Clear identification of key factors influencing decisions
- Transparent risk assessment with severity and probability ratings

### Multi-Agent Intelligence
Four specialized agents collaborate in sequence, each bringing domain expertise:
- Market research and competitive analysis
- Viability assessment across multiple dimensions
- Comprehensive risk identification and mitigation
- Final synthesis into actionable recommendations

### Learning System
- Vector-based semantic memory using ChromaDB
- System learns from user feedback to improve recommendations
- Similar past cases inform new analyses
- Continuous improvement through feedback loop

### Premium User Experience
- Real-time progress tracking as agents work
- Smooth animations and intuitive interface
- Brutalist design with warm earth tones
- Fully responsive across all devices

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Hooks

### Backend
- **Framework**: FastAPI 0.115
- **Language**: Python 3.11+
- **AI/LLM**: LangChain, OpenRouter
- **Database**: MongoDB Atlas (Beanie ODM)
- **Vector Store**: ChromaDB
- **Validation**: Pydantic V2

### DevOps
- **Testing**: pytest, Jest, Playwright
- **CI/CD**: GitHub Actions
- **Code Quality**: Ruff, Black, ESLint
- **Coverage**: 44% (target: 80%+)

---

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │   Hooks  │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Backend (FastAPI)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Agent Orchestrator                        │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │  │
│  │  │Research│→│Analysis│→│ Risk │→│Decision│           │  │
│  │  │ Agent  │  │ Agent  │  │Agent │  │ Agent  │       │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   MongoDB    │              │   ChromaDB   │            │
│  │    Atlas     │              │ Vector Store │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Agent Workflow

1. **User submits** business question or decision problem
2. **Orchestrator** coordinates sequential agent execution
3. **Research Agent** gathers market intelligence and competitive data
4. **Analysis Agent** evaluates viability across multiple dimensions
5. **Risk Agent** identifies and assesses potential risks
6. **Decision Agent** synthesizes all data into final recommendation
7. **Results delivered** with complete reasoning transparency

---

## Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- OpenRouter API key

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## Usage

### Creating an Analysis

1. Navigate to the homepage
2. Enter your business question or decision problem
3. Optionally add context (budget, timeline, constraints)
4. Click "Start Analysis"
5. Watch real-time progress as agents work
6. Review comprehensive results with reasoning

### Example Prompts

**Startup Idea Validation:**
```
Should I launch a SaaS platform for AI-powered inventory management 
targeting small businesses with 50-200 employees?

Context: $500k budget, 6-month timeline, team of 5 engineers
```

**Product Feature Assessment:**
```
Is it viable to add real-time collaboration features to our 
project management tool?

Context: 10k active users, $200k development budget, 3-month timeline
```

### Interpreting Results

- **GO**: Strong opportunity with manageable risks → Proceed with execution
- **CONDITIONAL**: Viable but requires specific conditions → Address concerns first  
- **NO-GO**: Significant risks or low viability → Reconsider or pivot

Each verdict includes:
- Confidence score (0-100%)
- Executive summary
- Key factors (positive and negative)
- Risk assessment with mitigation strategies
- Actionable recommendations
- Next steps

---

## API Documentation

### Base Endpoints

```
POST   /api/v1/analysis           # Create new analysis
GET    /api/v1/analysis/{id}      # Get analysis results
GET    /api/v1/analysis/{id}/status  # Get real-time status
POST   /api/v1/feedback           # Submit feedback
GET    /api/v1/history            # Get analysis history
GET    /api/v1/history/stats      # Get statistics
```

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "problem_statement": "Should I launch a mobile app for Gen Z finance?",
    "context": "Target: 18-25 age group, Budget: $200k"
  }'
```

### Example Response

```json
{
  "id": "uuid-here",
  "status": "completed",
  "result": {
    "decision": {
      "verdict": "CONDITIONAL",
      "confidence": 0.75,
      "summary": "Viable opportunity with specific conditions...",
      "key_factors": ["Large target market", "High competition"],
      "risks": ["User acquisition cost", "Monetization challenges"],
      "recommendations": ["Start with MVP", "Focus on differentiation"],
      "next_steps": ["Conduct user research", "Build prototype"]
    },
    "reasoning_steps": [...]
  }
}
```

Interactive API documentation available at `/docs` endpoint.

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_analysis_routes.py -v
```

**Current Coverage**: 44% (13 tests passing)
**Target**: 80%+

### Test Suite Includes
- Unit tests for API routes (analysis, history, feedback)
- Input validation tests
- Error handling tests
- Integration tests (in progress)

### CI/CD

Automated testing runs on every push via GitHub Actions:
- Backend unit tests
- Code linting (Ruff, Black, ESLint)
- Type checking
- Coverage reporting

---

## Project Structure

```
aegis-ai/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities & API client
│   │   └── types/              # TypeScript definitions
│   └── public/                 # Static assets
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── agents/             # Multi-agent system
│   │   ├── api/                # API routes
│   │   ├── db/                 # Database models
│   │   ├── memory/             # Vector store
│   │   ├── reasoning/          # Reasoning logger
│   │   └── schemas/            # Pydantic models
│   └── tests/                  # Test suite
│
└── .github/
    └── workflows/              # CI/CD pipelines
```

---

## Key Achievements

### Technical Excellence
- Multi-agent AI architecture with orchestrated workflow
- Explainable AI with complete reasoning transparency
- Vector-based memory system for continuous learning
- Real-time progress tracking with WebSocket-like polling
- Comprehensive test suite with CI/CD automation

### Code Quality
- Type-safe codebase (TypeScript + Python type hints)
- Pydantic validation for data integrity
- Modular, maintainable architecture
- Automated testing and linting
- Professional error handling

### User Experience
- Intuitive interface with smooth animations
- Real-time feedback during analysis
- Clear visualization of reasoning steps
- Responsive design for all devices
- Accessibility considerations

---

## Performance

### Analysis Speed
- Average analysis time: 60-120 seconds
- Concurrent processing: Up to 10 analyses
- Real-time status updates every 2 seconds

### Scalability
- Stateless backend design for horizontal scaling
- MongoDB Atlas with automatic scaling
- Optimized database queries with indexes
- Caching strategy ready for Redis integration

---

## Security

### Current Implementation
- Input validation with Pydantic schemas
- CORS configuration for allowed origins
- Environment variable management
- MongoDB connection encryption
- HTTPS in production

### Planned Enhancements
- JWT-based authentication
- Rate limiting per IP/user
- API key management
- Audit logging
- Data encryption at rest

---

## Future Roadmap

### Phase 1 (Completed)
- Multi-agent architecture
- Explainable AI reasoning
- Vector memory system
- Testing infrastructure
- CI/CD pipeline

### Phase 2 (In Progress)
- Increase test coverage to 80%+
- Production deployment
- Performance optimization
- Analytics dashboard

### Phase 3 (Planned)
- User authentication
- Share & export features
- Advanced analytics
- Multi-model support
- Collaborative workspaces

---

## Development Highlights

### Problem Solving
- Designed and implemented complex multi-agent orchestration
- Built explainable AI system with reasoning transparency
- Integrated vector database for semantic memory
- Solved real-time status update challenges
- Implemented comprehensive error handling

### Technical Skills Demonstrated
- Full-stack development (Next.js + FastAPI)
- AI/ML integration (LangChain, OpenRouter)
- Database design (MongoDB, ChromaDB)
- API design and implementation
- Testing and CI/CD
- Type-safe programming (TypeScript, Python)

### Best Practices
- Clean code architecture
- Separation of concerns
- DRY principles
- Comprehensive testing
- Documentation-first approach
- Version control with Git

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pytest` for backend, `npm test` for frontend)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- Python: PEP 8, Black formatter
- TypeScript: Airbnb style guide, ESLint
- Commits: Conventional commits format

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

Built with modern technologies and best practices:
- OpenRouter for universal LLM API access
- LangChain for agent framework
- MongoDB Atlas for cloud database
- Next.js for frontend framework
- FastAPI for high-performance backend

---

## Contact

**Pusri** - Full Stack Developer

For questions, suggestions, or collaboration opportunities, please open an issue or reach out via GitHub.

---

**Made with dedication for smarter decision-making**

*This project demonstrates advanced full-stack development, AI integration, and software engineering best practices.*
