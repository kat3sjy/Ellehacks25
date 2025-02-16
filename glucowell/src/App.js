import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"; // Your home page component
import MealPlans from "./MealPlans"; // Another tab/page
import ActiveLiving from "./ActiveLiving"; // Another tab/page
import NavBar from "./NavBar"; // Navigation bar component
import { TargetProvider } from './TargetContext';

function App() {
  return (
    <TargetProvider>
      <Router>
        {/* Navigation Bar */}
        <NavBar />

        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          {/* About Page */}
          <Route path="/meal_planning" element={<MealPlans />} />
          {/* Dashboard Page */}
          <Route path="/active_living" element={<ActiveLiving />} />
        </Routes>
      </Router>
    </TargetProvider>

  );
}

export default App;
