import React from "react";
// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
// import {
//     Box,
//     Button,
//     Container,
//     TextField,
//     Typography,
//     Paper,
// } from "@mui/material";
import DexcomAPI from './DexcomAPI';
import LineChartComponent from "./LineChartComponent";
console.log("Imported LineChartComponent:", LineChartComponent);
console.log("Keys of Imported Object:", Object.keys(LineChartComponent));
console.log("Type of Imported Object:", typeof LineChartComponent);


// insert data later
const HomePageComponent = () => {
    return (
    <div>
        <LineChartComponent/>
        <div>
            <DexcomAPI />
        </div>
    </div>

    );
};

export default HomePageComponent;

// import React from "react";
// import MinimalComponent from "./MinimalComponent"; // Adjust the path if needed

// const HomePage = () => {
//   return (
//     <div>
//       <h2>Testing Minimal Component</h2>
//       <MinimalComponent />
//     </div>
//   );
// };

// export default HomePage;