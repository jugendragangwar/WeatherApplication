import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from "react-icons/fa"
import clear from '../assets/clear.png'
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import humidity from '../assets/humidity.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'

const Weather = () => {
  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")
  
  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  }

  const search = async (city) => {
    if (city === "") {
      alert("Enter city name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        feelslike: Math.floor(data.main.feels_like),
        tempmax: Math.floor(data.main.temp_max),
        tempmin: Math.floor(data.main.temp_min),
        icon: icon
      });

      setSuccessMessage(`Successfully found weather for ${data.name}!`);
      setTimeout(() => setSuccessMessage(""), 2000); 
    } catch (error) {
      setWeatherData(null);
      console.error("Error in fetching data", error);
    }
  }

  useEffect(() => {
    search("Bareilly");
  }, [])

  return (
    <div className='bg-slate-600 min-h-screen flex items-center justify-center'>
      {/* Weather Container */}
      <div className='bg-white/50 p-8 rounded-xl shadow-lg w-full max-w-md space-y-6'>

        {/* Search Bar */}
        <div className='flex justify-between items-center bg-gray-200 rounded-full p-2'>
          <input
            type="text"
            placeholder='Enter your city name'
            ref={inputRef}
            className='bg-transparent outline-none px-4 text-sm text-gray-700 flex-grow'
          />
          <button
            className='ml-4 p-3 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition'
            onClick={() => search(inputRef.current.value)}>
            <FaSearch />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className='bg-green-100 text-green-700 p-2 rounded-md text-center'>
            {successMessage}
          </div>
        )}

        {weatherData ? (
          <>
            {/* Weather Icon */}
            <div className='flex justify-center mb-4'>
              <img className='w-24 h-24' src={weatherData.icon} alt="Weather icon" />
            </div>

            {/* Temperature and City Name */}
            <div className='text-center'>
              <h2 className='text-4xl font-bold text-gray-800'>{weatherData.temperature}°C</h2>
              <p className='text-xl text-gray-600'>Feels like {weatherData.feelslike}°C</p>
              <p className='text-lg text-gray-600'>{weatherData.location}</p>
            </div>

            {/* Weather Details */}
            <div className='grid grid-cols-2 gap-4 text-gray-600'>
              {/* Humidity */}
              <div className='flex items-center justify-center'>
                <img className='w-5 h-5 mr-2' src={humidity} alt="Humidity icon" />
                <div>
                  <p className='text-sm'>Humidity</p>
                  <p className='font-semibold'>{weatherData.humidity}%</p>
                </div>
              </div>

              {/* Wind */}
              <div className='flex items-center justify-center'>
                <img className='w-5 h-5 object-cover mr-2' src={wind} alt="Wind icon" />
                <div>
                  <p className='text-sm'>Wind</p>
                  <p className='font-semibold'>{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className='text-center text-gray-500'>Enter a city to get the weather data.</p>
        )}
      </div>
    </div>
  )
}

export default Weather;
