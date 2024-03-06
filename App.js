import React from "react"; 
import { Text, View, StatusBar } from "react-native";
import Navigation from "./src/components/Navigation";
import { AuthProvider } from "./src/context/AuthContext";
import {DataProvider} from './src/hooks';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <DataProvider>
          <AuthProvider>
            <StatusBar barStyle="light-content" />
            <Navigation />
          </AuthProvider>
        </DataProvider>
      </GestureHandlerRootView>
    );
};

export default App;