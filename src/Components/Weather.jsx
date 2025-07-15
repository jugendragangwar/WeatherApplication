import React, { useEffect, useRef, useState } from "react";
import { Search, Eye, Droplets, Wind, Thermometer, Gauge, Cloud, Sun, Moon } from "lucide-react";

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const allIcons = {
    "01d": "☀️",
    "01n": "🌙",
    "02d": "⛅",
    "02n": "☁️",
    "03d": "☁️",
    "03n": "☁️",
    "04d": "🌦️",
    "04n": "🌦️",
    "09d": "🌧️",
    "09n": "🌧️",
    "10d": "🌧️",
    "10n": "🌧️",
    "13d": "❄️",
    "13n": "❄️",
  };

  const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toUTCString().slice(17, 22);
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || "☀️";
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        feelslike: Math.floor(data.main.feels_like),
        tempmax: Math.floor(data.main.temp_max),
        tempmin: Math.floor(data.main.temp_min),
        pressure: data.main.pressure,
        visibility: data.visibility,
        weather: data.weather[0].main,
        description: data.weather[0].description,
        rain: data.rain?.["1h"] || 0,
        clouds: data.clouds.all,
        sunrise: formatTime(data.sys.sunrise, data.timezone),
        sunset: formatTime(data.sys.sunset, data.timezone),
        icon: icon,
      });

      setSuccessMessage(`Successfully found weather for ${data.name}!`);
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      setWeatherData(null);
      console.error("Error in fetching data", error);
    }
  };

  useEffect(() => {
    search("Noida");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 p-4">
      <div className="max-w-7xl mx-auto">

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a city..."
              ref={inputRef}
              className="w-full px-6 py-4 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-lg"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition-all duration-200 shadow-md"
              onClick={() => search(inputRef.current.value)}
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center shadow-sm">
              {successMessage}
            </div>
          </div>
        )}

        {weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Weather Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl p-8 h-full shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{weatherData.location}</h2>
                    <p className="text-gray-600 text-lg capitalize">{weatherData.description}</p>
                  </div>
                  <div className="text-6xl">{weatherData.icon}</div>
                </div>
                
                <div className="flex items-end space-x-4 mb-8">
                  <div className="text-7xl font-bold text-gray-800">{weatherData.temperature}°</div>
                  <div className="text-2xl text-gray-600 pb-2">C</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="text-orange-500" size={20} />
                      <span className="text-gray-700">Feels Like</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{weatherData.feelslike}°C</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <Wind className="text-blue-500" size={20} />
                      <span className="text-gray-700">Wind Speed</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{weatherData.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Temperature Range */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Temperature Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max</span>
                    <span className="text-2xl font-bold text-red-500">{weatherData.tempmax}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Min</span>
                    <span className="text-2xl font-bold text-blue-500">{weatherData.tempmin}°C</span>
                  </div>
                </div>
              </div>

              {/* Sun Times */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Sun Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Sun className="text-yellow-500" size={20} />
                      <span className="text-gray-600">Sunrise</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{weatherData.sunrise}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Moon className="text-purple-500" size={20} />
                      <span className="text-gray-600">Sunset</span>
                    </div>
                    <span className="text-lg font-bold text-gray-800">{weatherData.sunset}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌤️</div>
            <p className="text-xl text-gray-600">Enter a city to get started</p>
          </div>
        )}

        {/* Weather Details Grid */}
        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <WeatherCard 
              icon={<Droplets className="text-blue-500" />}
              label="Humidity"
              value={`${weatherData.humidity}%`}
            />
            <WeatherCard 
              icon={<Gauge className="text-green-500" />}
              label="Pressure"
              value={`${weatherData.pressure} hPa`}
            />
            <WeatherCard 
              icon={<Eye className="text-purple-500" />}
              label="Visibility"
              value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
            />
            <WeatherCard 
              icon={<Cloud className="text-gray-500" />}
              label="Clouds"
              value={`${weatherData.clouds}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Weather Card Component
const WeatherCard = ({ icon, label, value }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="p-2 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="text-gray-600 text-sm mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

export default Weather;