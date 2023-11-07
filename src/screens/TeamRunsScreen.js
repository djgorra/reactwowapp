import React, {useContext, useState, useEffect} from "react"; 
import {Button, StyleSheet, View, FlatList,SafeAreaView } from "react-native";
import { Input, Text } from '../components';
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

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <View style={styles.nameContainer}>
                <Text h6 style={styles.itemName}>{item["raid_name"]}</Text>
                <Text h6>{item["timestamp"]}</Text>

            </View>

            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    title={"Show Drops"}
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
                        Show Drops
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.nameContainer}>
                <Text h5 style={styles.itemName}>{route.params.teamName} Runs</Text>
            </View>
            <Button
                style={styles.button}
                title="Start New Run"
                onPress={() =>
                    navigation.navigate('RaidListScreen', {
                        teamId: route.params.teamId,
                        teamName: route.params.teamName,
                    })
                }
            ></Button>
            <FlatList
                style={{flex:1}}
                data={runs}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.id}
                extraData={runs}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F7F7F7',
        marginTop:20,
        marginLeft: 20,
        marginRight:20
    },
    listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5,
    },
    itemName:{
        alignSelf:"center",
    },
    nameContainer:{
        alignContent:"center",
    },
    button:{
        alignSelf:"right",
        marginLeft: 20,
    },
    buttonContainer:{
        flex:2,
        alignSelf:"",
    },
});

export default TeamRunsScreen;