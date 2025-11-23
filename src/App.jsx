import { useState } from 'react';
import './TourismAgent.css';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const getCoordinates = async (place) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'TourismApp/1.0' } }
    );
    const data = await response.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  };

  const getWeather = async (lat, lon) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation_probability&timezone=auto`
    );
    const data = await response.json();
    return {
      temperature: data.current.temperature_2m,
      rainChance: data.current.precipitation_probability || 0
    };
  };

  const getPlaces = async (lat, lon) => {
    const query = `
      [out:json];
      (
        node["tourism"="attraction"](around:10000,${lat},${lon});
        node["historic"](around:10000,${lat},${lon});
        node["leisure"="park"](around:10000,${lat},${lon});
      );
      out body 5;
    `;
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    return data.elements
      .filter(el => el.tags && el.tags.name)
      .slice(0, 5)
      .map(el => el.tags.name);
  };

  const analyzeTourismQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    const needsWeather = /temperature|weather|climate|hot|cold|rain/.test(lowerQuery);
    const needsPlaces = /places|visit|attractions|tourist|spots|things to do|plan|trip/.test(lowerQuery);
    
    const placeMatch = query.match(/(?:to|in|visit)\s+([A-Z][a-zA-Z\s]+?)(?:[,.]|$|\?)/i);
    const place = placeMatch ? placeMatch[1].trim() : query.split(/,|\?/)[0].replace(/^(I'm going to|go to|visit)/i, '').trim();
    
    return { place, needsWeather, needsPlaces };
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { place, needsWeather, needsPlaces } = analyzeTourismQuery(input);
      
      const coords = await getCoordinates(place);
      if (!coords) {
        setError(`I don't know if "${place}" exists or I couldn't find it in my database.`);
        setLoading(false);
        return;
      }

      const response = {};

      if (needsWeather || !needsPlaces) {
        response.weather = await getWeather(coords.lat, coords.lon);
      }

      if (needsPlaces || !needsWeather) {
        response.places = await getPlaces(coords.lat, coords.lon);
      }

      response.location = place;
      setResult(response);
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tourism-container">
      {/* Animated Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-icon-wrapper">
            <div className="header-icon">🌍</div>
            <div className="sparkle-icon">✨</div>
          </div>
          <h1 className="main-title">AI Tourism Guide</h1>
          <p className="subtitle">
            🧭 Discover your next adventure with AI-powered insights
          </p>
        </div>

        {/* Search Box */}
        <div className="search-box">
          <div className="search-card">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Where would you like to explore? (e.g., Paris, Tokyo, New York...)"
                className="search-input"
                disabled={loading}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="search-button"
              >
                {loading ? (
                  <>
                    <span className="spinner">⏳</span>
                    Exploring...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Explore
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-box">
            <div className="error-card">
              <p className="error-text">⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="results-container">
            {/* Weather Card */}
            {result.weather && (
              <div className="weather-card">
                <div className="card-header">
                  <div className="icon-badge weather-icon-badge">
                    <span>☁️</span>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>Weather Forecast</h2>
                    <p>{result.location}</p>
                  </div>
                </div>
                <div className="weather-content">
                  <div className="weather-info">
                    <div className="temperature-section">
                      <p>Current Temperature</p>
                      <div className="temperature">{result.weather.temperature}°C</div>
                    </div>
                    {result.weather.rainChance > 0 && (
                      <div className="rain-section">
                        <p>Rain Probability</p>
                        <div className="rain-chance">{result.weather.rainChance}%</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Places Card */}
            {result.places && result.places.length > 0 && (
              <div className="places-card">
                <div className="card-header">
                  <div className="icon-badge places-icon-badge">
                    <span>📍</span>
                  </div>
                  <div className="card-title-wrapper">
                    <h2>Top Attractions</h2>
                    <p>{result.location}</p>
                  </div>
                </div>
                <div className="places-list">
                  {result.places.map((place, idx) => (
                    <div key={idx} className="place-item">
                      <div className="place-number">{idx + 1}</div>
                      <div className="place-name">{place}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        {!result && !loading && (
          <div className="examples-section">
            <h3 className="examples-title">
              <span>✨</span>
              Try These Examples
            </h3>
            <div className="examples-list">
              <button onClick={() => setInput("I'm going to Bangalore, let's plan my trip")} className="example-button">
                <span className="example-emoji">🏰</span>
                I'm going to Bangalore, let's plan my trip
              </button>
              <button onClick={() => setInput("What's the temperature in Paris?")} className="example-button">
                <span className="example-emoji">🌡️</span>
                What's the temperature in Paris?
              </button>
              <button onClick={() => setInput("Show me weather and places in Tokyo")} className="example-button">
                <span className="example-emoji">🗾</span>
                Show me weather and places in Tokyo
              </button>
              <button onClick={() => setInput("Tell me about New York attractions")} className="example-button">
                <span className="example-emoji">🗽</span>
                Tell me about New York attractions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}