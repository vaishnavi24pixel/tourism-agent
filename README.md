# 🌍 AI Tourism Multi-Agent System

A sophisticated multi-agent tourism planning system that provides real-time weather information and tourist attraction recommendations using AI orchestration and open-source APIs.

## 🔗 Live Demo

**Deployed Application:** https://fluffy-phoenix-671209.netlify.app/

---

## 📋 Project Overview

This project implements a multi-agent system where:
- **Parent Agent (Tourism AI)**: Orchestrates the entire system and intelligently routes requests
- **Child Agent 1 (Weather Agent)**: Fetches real-time weather data
- **Child Agent 2 (Places Agent)**: Retrieves tourist attractions and points of interest
- **Geocoding Service**: Converts location names to coordinates for API queries

---

## 🎯 Key Features

✅ **Intelligent Query Analysis**: Automatically detects user intent (weather, places, or both)  
✅ **Real-time Weather Data**: Current temperature and precipitation probability  
✅ **Dynamic Place Recommendations**: Up to 5 tourist attractions per location  
✅ **Error Handling**: Graceful handling of non-existent locations  
✅ **Responsive Design**: Works seamlessly on desktop and mobile devices  
✅ **Beautiful UI**: Modern glassmorphism design with smooth animations  

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Component-based UI framework
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom animations and glassmorphism effects

### APIs Used (All Free & Open Source)
1. **Nominatim API** - Geocoding (location to coordinates)
2. **Open-Meteo API** - Weather data (no API key required)
3. **Overpass API** - OpenStreetMap data for tourist attractions

---

## 🏗️ Architecture & Approach

### Multi-Agent Design

```
User Input → Parent Agent (Query Analyzer)
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
  Weather Agent           Places Agent
        ↓                       ↓
  Open-Meteo API         Overpass API
        ↓                       ↓
        └───────────┬───────────┘
                    ↓
              Response Aggregator
                    ↓
              User Interface
```

### Key Design Decisions

#### 1. **Smart Query Parser**
Instead of using Claude API for query understanding (which would require API keys), I implemented a regex-based natural language parser that:
- Detects intent keywords ("temperature", "weather", "places", "visit")
- Extracts location names from various query formats
- Determines which agents to activate based on user needs

**Why this approach?**
- ✅ No API costs or rate limits
- ✅ Instant response without network latency
- ✅ Works offline for query parsing
- ✅ Predictable and reliable

#### 2. **API Selection**
Chose APIs that don't require authentication:
- **Open-Meteo**: More reliable than OpenWeatherMap's free tier
- **Overpass API**: Direct access to OpenStreetMap without rate limits
- **Nominatim**: Official OSM geocoding service

#### 3. **Agent Orchestration**
The parent agent decides which child agents to call based on:
```javascript
const needsWeather = /temperature|weather|climate/.test(query);
const needsPlaces = /places|visit|attractions|trip/.test(query);
```

If neither is explicitly mentioned, both agents are called (default behavior).

#### 4. **UI/UX Design**
- **Glassmorphism**: Modern frosted-glass effect with backdrop-filter
- **Animated Gradients**: Floating colored blobs for visual interest
- **Progressive Enhancement**: Content loads smoothly with staggered animations
- **Accessibility**: High contrast text, keyboard navigation support

---

## 🚧 Challenges Encountered & Solutions

### Challenge 1: Query Understanding Without AI
**Problem**: Assignment suggested using Claude API for multi-agent orchestration, but this adds complexity and requires API keys.

**Solution**: Built a lightweight regex-based query parser that:
- Identifies location names from natural language
- Detects user intent through keyword matching
- Routes to appropriate agents deterministically

**Trade-off**: Less flexible than LLM-based parsing, but more reliable and faster.

---

### Challenge 2: Overpass API Response Format
**Problem**: Overpass API returns complex nested JSON with inconsistent data structures.

**Solution**: 
```javascript
return data.elements
  .filter(el => el.tags && el.tags.name)  // Only items with names
  .slice(0, 5)                            // Limit to 5 results
  .map(el => el.tags.name);               // Extract clean names
```

---

### Challenge 3: Location Name Ambiguity
**Problem**: Users might enter "Paris" (could be Paris, France or Paris, Texas).

**Solution**: Nominatim returns the best match based on popularity/size. For future enhancement, could add:
- Country/region disambiguation
- "Did you mean...?" suggestions
- Multiple result selection

---

### Challenge 4: API Rate Limiting
**Problem**: Nominatim and Overpass have rate limits and request throttling.

**Solution**:
- Added proper User-Agent headers
- Implemented error handling with user-friendly messages
- Could add caching in future (localStorage for repeated queries)

---

### Challenge 5: Node.js Version Warning
**Problem**: Vite 7.x requires Node.js 20.19+ but had 20.13.1 installed.

**Solution**: The warnings are non-blocking; application works fine. For production, recommended to upgrade Node.js or use Vite 5.x for broader compatibility.

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/tourism-agent.git
cd tourism-agent

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 🎨 Project Structure

```
tourism-agent/
├── src/
│   ├── App.jsx              # Main component with agent logic
│   ├── TourismAgent.css     # All styling and animations
│   ├── main.jsx             # React entry point
│   └── index.css            # Global resets
├── public/                  # Static assets
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

---

## 🧪 Testing Examples

Try these queries:
1. `I'm going to Bangalore, let's plan my trip`
2. `What's the temperature in Paris?`
3. `Show me weather and places in Tokyo`
4. `Tell me about New York attractions`
5. `Visit London` (tests non-existent location handling with typo)

---

## 🔮 Future Enhancements

- [ ] Add caching layer for repeated queries
- [ ] Implement user location detection
- [ ] Add more tourist data sources (restaurants, hotels)
- [ ] Multi-language support
- [ ] Save favorite locations
- [ ] Historical weather data
- [ ] Travel route planning
- [ ] Integration with booking APIs

---

## 📝 Assignment Requirements Checklist

✅ User can enter a place they want to visit  
✅ Parent Agent orchestrates the system  
✅ Weather Agent fetches current/forecast weather from Open-Meteo API  
✅ Places Agent suggests up to 5 tourist attractions from Overpass API  
✅ Error handling for non-existent places  
✅ All agents use external APIs (not AI's built-in knowledge)  
✅ Clean, modern UI with responsive design  
✅ Deployed on Netlify  
✅ Code hosted on GitHub  

---

## 👨‍💻 Developer

**vaishnavi sharma**  
**Contact**: vaishnavishm082@gmail.com  

---

## 📄 License

This project is created for educational purposes as part of the Inkle AI Internship assignment.

---

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather API
- **OpenStreetMap** - Tourist attraction data
- **Nominatim** - Geocoding services
- **Vite** - Lightning-fast build tool
- **React** - UI framework
