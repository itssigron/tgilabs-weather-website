import lightningIcon from '../assets/lightning.svg';
import cloudIcon from '../assets/cloud.svg';
import sunIcon from '../assets/sun.svg';
import { Row, Col } from 'react-bootstrap';
import "./WeatherCard.css"

export default function WeatherCard({ city, measuredTemp, feelsLikeTemp, humidity, condition, isCloudy, isStormy }) {
    return (
        <Col sm={6} md={6} lg={6} xl={6}>
            <div className="weather-card">
                <img className="image" alt="Condition Icon" src={feelsLikeTemp >= 30 ? sunIcon : feelsLikeTemp >= 20 ? cloudIcon : lightningIcon} />
                <div className="city-name">{city}</div>
                <div className="condition">{condition}</div>
                <Row style={{ marginTop: "45px" }}>
                    <Col>
                        <div className="text-center">
                            <label className="label">טמפ' נמדדת</label>
                            <span className="text">{measuredTemp}°C</span>

                        </div>
                    </Col>
                    <Col>
                        <div className="text-center">
                            <label className="label">טמפ' מורגשת</label>
                            <span className="text">{feelsLikeTemp}°C</span>
                        </div>
                    </Col>
                    <Col>
                        <div className="text-center">
                            <label className="label">לחות</label>
                            <span className="text">{humidity}%</span>
                        </div>
                    </Col>
                </Row>
            </div>
        </Col >
    );
};