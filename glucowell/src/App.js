import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePageComponent from "./HomePage"; // Your home page component
import MealRecommendationComponent from "./MealPlans"; // Another tab/page
import ActiveLivingComponent from "./ActiveLiving"; // Another tab/page
import NavBar from "./NavBar"; // Navigation bar component
import { TargetProvider } from './TargetContext';
import { Container } from "@mui/material";


function App() {
  return (
    <Container>
      <TargetProvider>
        <Router>
          {/* Navigation Bar */}
          <NavBar />

          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePageComponent />} />
            {/* About Page */}
            <Route path="/meal_planning" element={<MealRecommendationComponent />} />
            {/* Dashboard Page */}
            <Route path="/active_living" element={<ActiveLivingComponent />} />
            {/* <Route path="/dexcom" element={<DexcomAPI />} /> */}
          
          </Routes>
          {/* DexcomAPI Route */}

        </Router>
      </TargetProvider>
    </Container>
  );
}

export default App;