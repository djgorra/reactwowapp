import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useScreenOptions, useTranslation} from '../hooks';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import CharacterListScreen from './CharacterListScreen';
import RaidListScreen from './RaidListScreen'
import ItemListScreen from './ItemListScreen'
import FriendsListScreen from './FriendsListScreen'
import TeamListScreen from './TeamListScreen'
import TeamCreateScreen from './TeamCreateScreen'
import TeamRunsScreen from './TeamRunsScreen'
import RunScreen from './RunScreen'
import BattleScreen from './BattleScreen'
import DropScreen from './DropScreen'

const Stack = createStackNavigator();

export default () => {
  // const {t} = useTranslation();
  // const screenOptions = useScreenOptions();
  return (
    <Stack.Navigator screenOptions={{
        headerTitleStyle: { fontFamily: 'LifeCraft' },
        headerStyle: {
          backgroundColor: '#0d1c3a',
        },
        headerTintColor: '#fff',
    }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen 
          name="Characters" 
          component={CharacterListScreen} 
          options={{title: 'Characters'}}
      />
      <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{headerShown: false}}
      />
      <Stack.Screen 
          name="RaidListScreen" 
          component={RaidListScreen} 
          options={{title: 'Edit Wishlist - Select Raid'}}
      />
      <Stack.Screen 
          name="ItemListScreen" 
          component={ItemListScreen} 
          options={{title: 'Edit Wishlist - Select Items'}}
      />
      <Stack.Screen
          name="FriendsListScreen"
          component={FriendsListScreen}
          options={{title: 'Friends List'}}
      />
      <Stack.Screen
          name="TeamListScreen"
          component={TeamListScreen}
          options={{title: 'Team List'}}
      />
      <Stack.Screen
          name="TeamCreateScreen"
          component={TeamCreateScreen}
          options={({ route }) => ({ title: `Edit ${route.params.teamName}` })}
      />
      <Stack.Screen
          name="TeamRunsScreen"
          component={TeamRunsScreen}
          options={({ route }) => ({ title: `${route.params.teamName} Runs` })}
      />
      <Stack.Screen
          name="RunScreen"
          component={RunScreen}
          options={({ route }) => ({ title: `${route.params.raidName} - ${route.params.timestamp}` })}
      />
      <Stack.Screen
          name="BattleScreen"
          component={BattleScreen}
          options={({ route }) => ({ title: route.params.bossName })}
      />
      <Stack.Screen
          name="DropScreen"
          component={DropScreen}
          options={{headerShown: true, title: 'Assign Drop'}}
      />


    </Stack.Navigator>
  );

};