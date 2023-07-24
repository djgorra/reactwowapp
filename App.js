import React from "react"; 
import { Text, View } from "react-native";
import Navigation from "./src/components/Navigation";
import { AuthProvider } from "./src/context/AuthContext";
import {DataProvider} from './src/hooks';

const App = () => {
    return (
      <DataProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
      </DataProvider>
    );
};

export default App;