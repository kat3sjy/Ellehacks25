import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./HomePage"; // Your home page component
import MealPlans from "./MealPlans"; // Another tab/page
import ActiveLiving from "./ActiveLiving"; // Another tab/page
import GlucoseMonitor from "./GlucoseMonitor"; // Glucose Monitor
import NavBar from "./NavBar"; // Navigation bar component
import { TargetProvider } from './TargetContext';
import './App.css'; // Import the CSS file

const BACKEND_URL = "http://localhost:4000";

function App() {
  const loginWithDexcom = () => {
    window.location.href = `${BACKEND_URL}/dexcom/login`;
  };

  return (
    <TargetProvider>
      <Router>
        {/* Navigation Bar */}
        <NavBar />

        <div className="container">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />
            {/* About Page */}
            <Route path="/meal_planning" element={<MealPlans />} />
            {/* ActiveLiving */}
            <Route path="/active_living" element={<ActiveLiving />} />
            {/* Glucose Monitor Page */}
            <Route path="/glucose_monitor" element={<GlucoseMonitor />} />
          </Routes>
          <button onClick={loginWithDexcom}>Login with Dexcom</button>
        </div>
      </Router>
    </TargetProvider>
  );
}

export default App;
