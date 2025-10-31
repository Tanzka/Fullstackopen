import { useEffect, useState } from "react"
import weatherService from "../services/weather"

const CountryInfo = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        if (country.capital && country.capital[0]) {
            weatherService 
                .getWeather(country.capital[0])
                .then((data) => setWeather(data))
                .catch((error) => console.log("Failed to fetch weather", error))
        }
    }, [country])

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital?.[0]}</p>
            <p>Area: {country.area}</p>
            <h4>Languages: </h4>
            <ul>
                {Object.values(country.languages || {}).map(lang => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>
            <img src={country.flags.png} width="150"></img>

            {weather && (
                <div>
                    <h2>Weather in {country.capital[0]}</h2>
                    <p>Temperature {weather.main.temp} Celsius</p>
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    />
                    <p>Wind {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default CountryInfo  