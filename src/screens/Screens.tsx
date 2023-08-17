import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useScreenOptions, useTranslation} from '../hooks';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import CharacterListScreen from './CharacterListScreen';
import RaidListScreen from './RaidListScreen'
import ItemListScreen from './ItemListScreen'
const Stack = createStackNavigator();

export default () => {
  // const {t} = useTranslation();
  // const screenOptions = useScreenOptions();
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen 
          name="Characters" 
          component={CharacterListScreen} 
          options={{headerShown: false}}
      />
      <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{headerShown: false}}
      />
      <Stack.Screen 
          name="RaidListScreen" 
          component={RaidListScreen} 
          options={{headerShown: true}}
      />
      <Stack.Screen 
          name="ItemListScreen" 
          component={ItemListScreen} 
          options={{headerShown: true}}
      />
    </Stack.Navigator>
  );

};