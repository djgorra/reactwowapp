import React, {useContext, useState, useEffect} from "react"; 
import {StyleSheet, View, FlatList,SafeAreaView } from "react-native";
import { Button, Text } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import { set } from "react-native-reanimated";

const TeamRunsScreen = ({route, navigation}) => {
    const {teams, setTeams, getTeams} = useContext(AuthContext);
    const [runs, setRuns] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <View style={styles.itemName}>
                <Text h5>{item["raid_name"]}</Text>
                <Text h6>{item["timestamp"]}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    title={"Show"}
                    onPress={() =>
                        navigation.navigate('RunScreen', {
                            raidName: item["raid_name"],
                            timestamp: item["timestamp"],
                            teamId: route.params.teamId,
                            runId: item.id,
                        })
                    }
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}>
                    <Text bold white transform="uppercase">
                        Show
                    </Text>
                </Button>
            </View>
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
        getRuns();
    }, []);

    if (isLoading) {
        //todo: add loading screen styling 
        return (
            <View style={{flex:1}}>
                <Text h5 style={styles.runName}>Loading...</Text>
            </View>
        );
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <Button
                    style={styles.newRunButton}
                    title="Start New Run"
                    onPress={() =>
                        navigation.navigate('RaidListScreen', {
                            teamId: route.params.teamId,
                            teamName: route.params.teamName,
                        })
                    }
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}
                >
                    <Text white bold transform="uppercase">
                        Start New Run
                    </Text>
                </Button>
                <FlatList
                    data={runs}
                    renderItem={({ item }) => <Item item={item}/>}
                    keyExtractor={item => item.id}
                    extraData={runs}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex:2,
    },
    button:{
        width: 70,
        height: 30,
    },
    newRunButton:{
        width: 200,
        alignSelf:"center",
        margin:10,
    },
});

export default TeamRunsScreen;