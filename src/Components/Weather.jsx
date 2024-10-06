import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from "react-icons/fa"
import clear from '../assets/clear.png'
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import humidity from '../assets/humidity.png'
// import icon from '../assets/icon.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'

const Weather = () => {

  const inputRef = useRef()


  const [weatherData, setWeatherData] = useState(false)

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
    if (city == "") {
      alert("Enter city Name")
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url)
      const data = await response.json()
      if (!response.ok) {
        alert(data.message);
        return
      }


      //  console.log(data)
      const icon = allIcons[data.weather[0].icon] || clear;
      //  console.log(icon,"Icon code")
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      });
    }
    catch (error) {
      setWeatherData(false);
      console.error("Error in fething data", error)
    }
  }
  useEffect(() => {
    search("Uttar Pradesh")
  }, [])


  return (
    <div className='bg-slate-600 min-h-screen flex items-center justify-center'>
      {/* Weather Container */}
      <div className='bg-white/50 p-8 rounded-xl shadow-lg w-full max-w-md'>

        {/* Search Bar */}
        <div className='flex justify-around items-center'>
          {/* Input Field Container */}
          <div className='flex-grow bg-gray-200 rounded-full p-2 '>
            <input
              type="text"
              placeholder='Enter your city name'
              ref={inputRef}
              className='bg-transparent outline-none px-4 text-sm text-gray-700 w-full'
            />
          </div>

          {/* Search Icon Container */}
          <div className='ml-4 p-3 rounded-full bg-slate-100 shadow-md'>
            <FaSearch className='text-gray-500 ' onClick={() => search(inputRef.current.value)} />
          </div>
        </div>

        {weatherData ? <>
          {/* Weather Icon */}
          <div className='flex justify-center mb-4'>
            <img className='w-24 h-24' src={weatherData.icon} alt="Weather icon" />
          </div>

          {/* Temperature and City Name */}
          <div className='text-center mb-6'>
            <h2 className='text-4xl font-bold text-gray-800'>{weatherData.temperature}°C</h2>
            <p className='text-lg text-gray-600'>{weatherData.location}</p>
          </div>

          {/* Weather Details (Humidity and Wind) */}
          <div className='flex justify-between items-center text-gray-600'>
            {/* Humidity */}
            <div className='flex items-center'>
              <img className='w-12 h-12 mb-2 ' src={humidity} alt="Humidity icon" />
              <div><p className='text-sm'>Humidity</p>
                <p className='font-semibold'>{weatherData.humidity}</p>
              </div>
            </div>

            {/* Wind */}
            <div className='flex  items-center'>
              <img className='w-12 h-12 mb-2' src={wind} alt="Wind icon" />
              <div>
                <p className='text-sm'>Wind</p>
                <p className='font-semibold'>{weatherData.windSpeed}km/h</p>
              </div>
            </div>
          </div>
        </> : <></>}

      </div>
    </div>
  )
}

export default Weather
