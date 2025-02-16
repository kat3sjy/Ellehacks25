import React, { useContext } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TargetContext } from "./TargetContext";

const LineChartComponent = () => {
    const { glucoseData } = useContext(TargetContext);

    console.log("data", glucoseData)

    return (
        <div style={{ width: "100%", height: 400 }}>
            {/* Add a title above the chart */}
            <div style={{ textAlign: "center", marginBottom: 10 }}>
                <h2>Glucose Data Over Time</h2>
            </div>
            <ResponsiveContainer>
                <LineChart
                    data={glucoseData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


console.log(LineChartComponent)

export default LineChartComponent;