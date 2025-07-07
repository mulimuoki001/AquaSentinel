import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="overlay">
                <div className="landing-content">
                    <h1 className="landing-title">Welcome to AquaSentinel Dashboard</h1>
                    <p className="landing-subtitle">
                        Smart Monitoring. Smarter Irrigation.
                    </p>
                    <div className="landing-buttons">
                        <Link to="/login" className="landing-btn primary">Login</Link>
                        <Link to="/register" className="landing-btn secondary">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
