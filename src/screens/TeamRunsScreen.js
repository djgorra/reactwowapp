import React, {useContext, useState, useEffect} from "react"; 
import {StyleSheet, View, FlatList, SafeAreaView, TouchableOpacity } from "react-native";
import { Button, Text } from '../components';
import BlueButton from "../components/BlueButton";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useIsFocused } from '@react-navigation/native';

const TeamRunsScreen = ({route, navigation}) => {
    const [runs, setRuns] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <View style={styles.itemName}>
                <Text white h5 font="LifeCraft">{item["raid_name"]}</Text>
                <Text white h6>{item["timestamp"]}</Text>
            </View> 
            <BlueButton
                text={"Show"}
                onPress={() =>
                    navigation.navigate('RunScreen', {
                        raidName: item["raid_name"],
                        timestamp: item["timestamp"],
                        teamId: route.params.teamId,
                        runId: item.id,
                    })
                }
            /> 
          </View>
        );
      }

    const getRuns = () => {
        axios({
            url:`${BASE_URL}/api/teams/${route.params.teamId}/runs`,
            method : "GET",
        }).then((res)=>{
            setRuns(res.data);
            setIsLoading(false);
        }).catch((error) => {
            ErrorHandler(error)
        })
    }

    
    const createRun = (name) => {
        if(name){
            axios({
                url:`${BASE_URL}/api/teams/${route.params.teamId}/runs`,
                method : "POST",
            }).then((res)=>{
                
            }).catch((error) => {
                ErrorHandler(error)
            })
        }
    }
    
    useEffect(() => {
        if(route.params.runs) {
            setRuns(route.params.runs);
            setIsLoading(false);
        }else{
            getRuns();
        }
    }, [isFocused]);

    if (isLoading) {
        //todo: add loading screen styling 
        return (
            <View style={styles.container}>
                <Text h5 white style={styles.runName}>Loading...</Text>
            </View>
        );
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <BlueButton
                    text="Start New Run"
                    onPress={() =>
                        navigation.navigate('RaidListScreen', {
                            teamId: route.params.teamId,
                            teamName: route.params.teamName,
                        })
                    }
                />
                {runs.length == 0 ? <Text white h5 style={styles.runName}>No Runs Found!</Text> : null}
                <FlatList
                    data={runs}
                    renderItem={({ item }) => <Item item={item}/>}
                    keyExtractor={item => item.id}
                    extraData={runs}
                />
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('TeamOldRunsScreen', {
                            teamId: route.params.teamId,
                            teamName: route.params.teamName,
                        })
                    }>
                        <BlueButton 
                            text="Show Old Runs"
                            onPress={() =>
                            navigation.navigate('TeamOldRunsScreen', {
                                teamId: route.params.teamId,
                                teamName: route.params.teamName,
                            })
                            }
                        />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02000b',
    },
    listItem:{
        margin:10,
        padding:10,
        borderColor: borderColor,
        borderWidth: 2,
        width:"90%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5,
    },
    itemName:{
        justifyContent:"center",
        flex:4,
    },
    runName: {
        alignSelf:"center",
        margin: 20,
        padding:10,
    },
});

export default TeamRunsScreen;