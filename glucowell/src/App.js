import React from "react";
import TabsComponent from "./Tabs";
import DexcomAPI from './DexcomAPI';

function App() {
  return (
    <div>
      <TabsComponent />
      <DexcomAPI />
    </div>
  );
}

export default App;
