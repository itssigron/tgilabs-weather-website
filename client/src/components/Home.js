import React, { useState, useEffect } from "react";
import { Alert, Container, Row } from 'react-bootstrap'
import WeatherCard from "./WeatherCard";
import userService from "../services/user.service";
import AuthService from '../services/auth.service';
import EventBus from "../services/EventBus.service";
import './Home.css';

// Define a function to fetch weather data for the cities we want
const fetchWeatherData = async () => {
    const cities = ["לונדון", "ניו יורק", "אלסקה", "אילת"];
    const user = AuthService.getCurrentUser();
    const unauthorizedErrorMessage = "אינך מחובר למערכת.";

    // Client-side checking to avoid fetch the api for no reason
    if (!user) throw new Error(unauthorizedErrorMessage);

    const weatherDataPromises = cities.map(async (city) => {
        // Fetch the data from our api and parse it
        return await userService.getWeather(city).then(
            response => {
                let weatherData = response.data;

                return {
                    city: weatherData.name,
                    measuredTemp: weatherData.main.temp,
                    feelsLikeTemp: weatherData.main.feels_like,
                    humidity: weatherData.main.humidity,
                    condition: weatherData.weather[0].description
                };
            },
            error => {
                const errorMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();


                // If an unauthorized error has been return, then log out the user
                if (error.response.status === 401) {
                    EventBus.dispatch("logout");
                    throw new Error(unauthorizedErrorMessage);
                }

                // Otherwise, just re-throw the error to allow the UI rendering it
                throw new Error(errorMessage);
            });
    });

    return await Promise.all(weatherDataPromises);
};

function Home() {
    // Define state to store weather data
    const [weatherData, setWeatherData] = useState([]);
    const [loadingAlert, setLoadingAlert] = useState(<Alert className="home-alert" variant='warning'>טוען תחזית...</Alert>);

    // Fetch data when the component mounts and update the state
    useEffect(() => {
        fetchWeatherData().then(result => {
            setLoadingAlert(null);
            setWeatherData(result)
        }).catch(error => {
            setLoadingAlert(<Alert className="home-alert" variant='danger'>{error.message ?? error.toString()}</Alert>)
            console.error("Error fetching weather data: ", error);
        })
    }, []);

    return (
        <>
            <center>
                <div className="header">
                    <div className="header-text">תחזית מסביב לעולם</div>
                </div>
                {/*Build the weather cards*/}
                <Container fluid className="mx-auto">
                    {loadingAlert}
                    <Row xs={1} md={2} className="g-4">
                        {weatherData.map((weather, index) => (
                            <WeatherCard
                                key={index}
                                city={weather.city}
                                measuredTemp={weather.measuredTemp}
                                feelsLikeTemp={weather.feelsLikeTemp}
                                humidity={weather.humidity}
                                condition={weather.condition}
                            />
                        ))}
                    </Row>
                </Container>
            </center>
        </>
    );
}

export default Home;