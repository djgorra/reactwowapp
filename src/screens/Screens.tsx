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
import SummaryScreen from './SummaryScreen'
import { Image, View, Text, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';

function italicizeRaidName(title) {
    if(title.indexOf(" - ") < 0){
       return (<Text style={styles.headerText}>{title}</Text>)
    } else {
       let parts = title.split(" - ");
       return (<Text style={styles.headerText}><Text style={{fontFamily:"LifeCraft"}}>{parts[0]}</Text><Text style={{fontSize:16, fontFamily:"OpenSans-Regular"}}> - {parts[1]}</Text></Text>)
    }
}
function CustomNavigationBar({ navigation, route, options, back = null }) {
    const title = getHeaderTitle(options, route.name);
  
    return (
        <View style={styles.headerContainer}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} color="#dff0f8" style={{width:10}}/> : null}
            <View style={styles.logoColumn}>
                <Text style={styles.headerText}>{italicizeRaidName(title) }</Text>
                <View style={styles.headerDivider}>
                    <Text style={[styles.headerFont, styles.left]}>|</Text>
                    <Text style={[styles.headerFont, styles.center]}>  +  </Text>
                    <Text style={[styles.headerFont, styles.right]}>|</Text>
                    <View style={{margin:10}}></View>
                </View>
            </View>
            <View style={styles.headerSpacer}>
                <Text>
                    {/* tip: a dummy element to center the title */}
                </Text>
            </View>
        </View>
    );
  }

const Stack = createStackNavigator();

export default () => {
  // const {t} = useTranslation();
  // const screenOptions = useScreenOptions();
  return (
    <Stack.Navigator screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
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
          options={{title: 'Select Raid'}}
      />
      <Stack.Screen 
          name="ItemListScreen" 
          component={ItemListScreen} 
          options={{title: 'Select Items'}}
      />
      <Stack.Screen
          name="FriendsListScreen"
          component={FriendsListScreen}
          options={{title: 'Friends'}}
      />
      <Stack.Screen
          name="TeamListScreen"
          component={TeamListScreen}
          options={{title: 'Teams'}}
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
      <Stack.Screen
          name="SummaryScreen"
          component={SummaryScreen}
          options={{headerShown: true, title: 'Run Summary'}}
        />


    </Stack.Navigator>
  );

};

const styles = StyleSheet.create(
    {
        headerDivider: {
            flexDirection: 'row', alignSelf:"center", transform: [{translateY:0}]
        },
        headerFont: {
            fontFamily:"LifeCraft",  fontSize:50, fontWeight:"bold", color:"#506986"
        },
        left: {
            transform: [{rotate: '-90deg'}]
        },
        right: {
            transform: [{rotate: '90deg'}]
        },
        center: {
            transform: [{translateY: 3}]
        },
        logoColumn: {
            flexDirection: 'column', 
            alignSelf: 'center', 
            justifyContent: "flex-start",
            width:"88%",
        },
        headerContainer: {
            flexDirection: 'row',
            backgroundColor: '#000',
            justifyContent:'space-between', 
            width:"100%"
        },
        headerSpacer: {
            height:"100%", 
            width:10, 
            backgroundColor: "#000"
        },
        headerText: { 
            color: '#dff0f8', 
            fontFamily: "OpenSans-Bold", 
            fontWeight: "bold", 
            textTransform: 'uppercase',
            fontSize: 20,
            letterSpacing: 2,
            textAlign: 'center',
            transform: [{translateY: 10}]
        },
    }
);
