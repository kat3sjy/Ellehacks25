
import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import MealRecommendationComponent from "./MealPlans";
import ActiveLivingComponent from "./ActiveLiving";

const TabsComponent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Tabs value={activeTab} onChange={handleChange} centered>
        <Tab label="Meal Recommendations" />
        <Tab label="Active Living Routine" />
      </Tabs>

      {activeTab === 0 && <MealRecommendationComponent />}
      {activeTab === 1 && <ActiveLivingComponent />}
    </Box>
  );
};

export default TabsComponent;