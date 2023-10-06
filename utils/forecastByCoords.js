"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function ForecastByCoords(props) {

    const [imgSrc, setImgSrc] = useState('');
    const [formData, setFormData] = useState({
        weather: '',
        temp: '',
        temp_min: '',
        temp_max: '',
        humidity: '',
        wind: 0,
        visibility: '',
        weatherIcon: '',
        name: ''
    });


    const lat = props.latLong.split('%2C')[0];
    const lon = props.latLong.split('%2C')[1];
    const icon = "http://openweathermap.org/img/wn/" + formData.weatherIcon + "@2x.png";


    useEffect(() => {
        const getCityWeather = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_OPEN_WEATHER_API_KEY}&units=metric#`);
                const weatherData = await response.data;
                setFormData({
                    weather: weatherData.weather[0].main,
                    temp: weatherData.main.temp,
                    temp_min: weatherData.main.temp_min,
                    temp_max: weatherData.main.temp_max,
                    humidity: weatherData.main.humidity,
                    wind: weatherData.wind.speed,
                    visibility: weatherData.visibility,
                    weatherIcon: weatherData.weather[0].icon,
                    name: weatherData.name
                });
            }
            catch (err) {
                console.log(err);
            }

        }
        getCityWeather();
    }, [props.latLong]);

    useEffect(() => {
        const getImg = async () => {
            const url = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${formData.name}/images/`);
            const src = await url.data.photos[0].image.web;
            setImgSrc(src);
        }
        getImg();
    }, []);

    const date = new Date();
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };

    const formattedDate = date.toLocaleDateString('en-US', options);

    return <div style={{ backgroundImage: `url(${imgSrc || '/City-Backup.jpg'})` }} className='bg-no-repeat bg-center bg-cover h-full rounded-3xl weather-card grid grid-rows-8 grid-cols-8 gap-y-10 gap-x-1 p-2 md:p-4 '>
        <div className='text-black glass-box items-center justify-center flex flex-col py-2 px-4 md:px-7 md:py-5 col-start-1 row-start-1 row-span-4 w-fit'>
            <h1 className='text-xl max-[320px]:text-base sm:text-3xl md:text-4xl'>{formData.name.charAt(0).toUpperCase() + formData.name.slice(1).toLowerCase()}</h1>
            <h5 className='text-xs max-[300px]:text-[8px] mt-2 md:text-base'>{formattedDate}</h5>
        </div>

        <div className='glass-box items-center py-2 px-5 justify-center flex flex-col row-start-1 col-start-6 row-end-6 col-end-9 md:col-start-7 gap-y-3'>
            <h1 className='text-3xl min-[480px]:text-5xl xl:text-6xl text-center'>{formData.temp.toString().split('.')[0]}°<span className='text-base'>C</span></h1>
            <div className='flex justify-center items-center gap-x-2 xl:gap-x-5'>
                <h6 className='text-xs sm:text-sm xl:text-lg'>{formData.temp_max.toString().split('.')[0]}°</h6>/
                <h6 className='text-xs sm:text-sm xl:text-lg'>{formData.temp_min.toString().split('.')[0]}°</h6>
            </div>
        </div>
        <div className='text-black flex items-center justify-center glass-box py-2 px-2 md:px-5 mr-2 row-start-6 col-start-1 col-span-2 row-span-1'>
            <div className='flex gap-y-5 flex-col items-center '>
                <img src={icon} className='border glass-box2 rounded-2xl' />
                <h6 className='text-xs max-[300px]:text-[8px] sm:text-sm xl:text-lg'>{formData.weather}</h6>
            </div>
        </div>

        <div className='text-black flex items-center justify-center glass-box py-2 px-2 md:px-5 mr-2 row-start-6 col-start-3 col-span-2 row-span-1'>
            <div className='flex gap-y-5 flex-col items-center '>
                <h2 className='text-lg min-[400px]:text-2xl min-[500px]:text-3xl  lg:text-4xl'>{formData.humidity}<span className='text-xs md:text-base lg:text-lg'>%</span></h2>
                <h6 className='text-xs max-[300px]:text-[8px] min-[420px]:text-lg  xl:text-xl'>Humidity</h6>
            </div>
        </div>

        <div className='text-black flex justify-center items-center  glass-box py-2 px-2 md:px-5 mr-2 row-start-6 col-start-5  col-span-2 row-span-1'>
            <div className='flex gap-y-5 flex-col items-center '>
                <h2 className='text-lg min-[400px]:text-2xl min-[500px]:text-3xl  lg:text-4xl'>{formData.visibility / 1000}<span className='text-xs md:text-base lg:text-lg'> km</span></h2>
                <h6 className='text-xs max-[300px]:text-[8px] min-[420px]:text-lg  xl:text-xl'>Visibility</h6>
            </div>
        </div>
        <div className='text-black flex justify-center items-center glass-box py-2 px-2 md:px-5 row-start-6 col-start-7  col-span-2 row-span-1'>
            <div className='flex flex-col items-center '>
                <h2 className='text-lg min-[400px]:text-2xl min-[500px]:text-3xl lg:text-4xl'>{formData.wind.toPrecision(2)}<span className='text-[8px] md:text-base lg:text-lg'> m/s</span></h2>
                <h6 className='text-[10px] max-[300px]:text-[8px] min-[420px]:text-lg xl:text-xl mt-2'>Wind Speed</h6>
            </div>
        </div>
    </div>
}

export default ForecastByCoords;