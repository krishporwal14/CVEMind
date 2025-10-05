# CVEMind 🧠🔒

A modern, AI-powered CVE (Common Vulnerabilities and Exposures) analysis platform that combines real-time vulnerability data with intelligent insights through a beautiful 3D interface.

![CVEMind Demo](https://img.shields.io/badge/Status-Active-green) ![Java](https://img.shields.io/badge/Java-17+-orange) ![React](https://img.shields.io/badge/React-18+-blue) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0+-green)

## 🚀 Features

### 🎯 Core Functionality
- **Real-time CVE Data**: Integration with NVD (National Vulnerability Database)
- **AI-Powered Analysis**: Intelligent vulnerability assessment and recommendations
- **Advanced Search**: Multi-parameter search with filtering and sorting
- **3D Visualization**: Interactive globe displaying vulnerability data
- **Modern UI/UX**: Clean, responsive design with light/dark themes

### 🔍 Search & Analysis
- Search by CVE ID, keywords, or severity levels
- Filter by publication date, CVSS scores, and impact metrics
- Export results to CSV format
- Detailed vulnerability analysis with AI insights
- Markdown rendering for rich content display

### 🎨 User Interface
- **Interactive 3D Globe**: Visualize global vulnerability trends
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Theme Support**: Light and dark mode with smooth transitions
- **Syntax Highlighting**: Code blocks with copy functionality
- **Loading States**: Skeleton loaders and progress indicators

## 🏗️ Architecture

### Frontend (React + Vite)
```
frontend/cvemind_frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── contexts/           # React contexts (Theme)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API integration
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles and themes
```

### Backend (Spring Boot)
```
backend/cvemind_backend/
├── src/main/java/com/cvemind/cvemind_backend/
│   ├── config/             # Configuration classes
│   ├── controller/         # REST API controllers
│   ├── dto/                # Data Transfer Objects
│   ├── entity/             # JPA entities
│   ├── repository/         # Data repositories
│   ├── service/            # Business logic
│   └── utils/              # Utility classes
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics and visualization
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering with syntax highlighting
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Spring Boot 3** - Enterprise Java framework
- **Spring Data JPA** - Database abstraction layer
- **Spring Web** - RESTful web services
- **Maven** - Dependency management
- **H2/PostgreSQL** - Database options
- **AI Integration** - For intelligent vulnerability analysis

### External APIs
- **NVD API** - National Vulnerability Database
- **AI Services** - For vulnerability analysis and insights

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **pnpm**
- **Java 17+** and **Maven**
- **Git**

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/krishporwal/CVEMind.git
cd CVEMind/backend/cvemind_backend

# Install dependencies and run
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../../frontend/cvemind_frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The frontend will start on `http://localhost:5173`

## 📡 API Endpoints

### CVE Operations
```http
GET    /api/v1/cve/all                    # Get all CVEs
GET    /api/v1/cve/search?keyword={term}  # Search CVEs
GET    /api/v1/cve/{cveId}                # Get specific CVE
POST   /api/v1/cve/{cveId}/summarize      # AI analysis
```

### Example Response
```json
{
  "cveId": "CVE-2024-1234",
  "description": "Remote code execution vulnerability...",
  "severity": "HIGH",
  "cvssScore": 8.5,
  "publishedDate": "2024-01-15T10:30:00Z",
  "lastModifiedDate": "2024-01-20T14:22:00Z",
  "affectedProducts": ["Product A", "Product B"],
  "references": ["https://example.com/advisory"]
}
```

## 🎨 Pages

### 🏠 Landing Page
- Hero section with animated 3D globe
- Quick access to search and browse functionality
- Modern, clean design with theme support

### 🔍 Search Results
- Advanced filtering and sorting options
- CVE cards with severity indicators
- Export and pagination capabilities

### 📊 CVE Analysis
- Detailed vulnerability information
- AI-powered insights and recommendations
- Markdown rendering for rich content

### 🌐 3D Visualization
- Interactive globe with vulnerability data points
- Smooth animations and responsive controls
- Performance-optimized rendering

## 🔧 Configuration

### Backend Configuration
```properties
# application.properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:testdb
nvd.api.key=your-nvd-api-key
ai.service.endpoint=your-ai-endpoint
```

### Frontend Configuration
```javascript
// src/config/env.js
export const API_BASE_URL = 'http://localhost:8080/api/v1';
export const ENABLE_3D_GLOBE = true;
export const DEFAULT_THEME = 'dark';
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build JAR file
./mvnw clean package

# Run production build
java -jar target/cvemind-backend-1.0.0.jar
```

### Frontend Deployment
```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 👨‍💻 Developer

**Krish Porwal**
- GitHub: [@krishporwal](https://github.com/krishporwal)
- Email: krishporwal18@gmail.com

## 🙏 Acknowledgments

- **NIST NVD** for providing comprehensive vulnerability data
- **Three.js Community** for amazing 3D graphics capabilities
- **React Community** for excellent documentation and resources
- **Spring Boot Team** for the robust backend framework

---

<p align="center">
  <strong>Built by Krish Porwal</strong>
</p>

<p align="center">
  <sub>⭐ Star this repository if you find it helpful!</sub>
</p>
