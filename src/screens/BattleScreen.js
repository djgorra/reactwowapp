import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Input, Text } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';
import { useIsFocused } from '@react-navigation/native';




const BattleScreen = ({route, navigation}) => {
    const battleId = route.params.battleId;
    const teamId = route.params.teamId;
    const runId = route.params.runId;
    const bossId = route.params.bossId;

    const [battle, setBattle] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [drops, setDrops] = useState(null);
    const isFocused = useIsFocused();

    const getData = async () => {
        if (route.params.requestType == "show") {
            axios({
                url:`${BASE_URL}/api/battles/${route.params.battleId}`,
                method : "GET"
            }).then((res)=>{
                setBattle(res.data);
                setDrops(res.data["drops"]);
                setIsLoading(false);
            }).catch((error) => {
                ErrorHandler(error)
            })
        } else if (route.params.requestType == "create") {
            axios.post(`${BASE_URL}/api/battles?run_id=${runId}&boss_id=${bossId}`
            ).then((res)=>{
                setBattle(res.data);
                setDrops(res.data["drops"]);
                setIsLoading(false);
            }).catch((error) => {
                ErrorHandler(error)
            })
        }
    }

    useEffect(() => {
        console.log(battle)
        getData();
    }, [isFocused]);

    function isAssigned (item) {
        if (drops) {
            for (let i = 0; i < drops.length; i++) {
                if (drops[i]["item"]["id"] == item.id) {
                    console.log("hello!")
                    return true;
                }
            }
        }
        return false;
    }
    

    function Item({ item }) {
        return (
            <View style={styles.listItem}>
                <View style={styles.buttonContainer}>
                    <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${item.image_path}`}} />
                    <Text style={styles.itemInActive} >{item.name}</Text>
                    <Button
                        style={styles.button}
                        title={isAssigned(item) ? "Assigned" : "Assign"}
                          onPress={() =>
                              navigation.navigate('DropScreen', {
                                    teamId: teamId,
                                    battleId: battle.id,
                                    itemId: item.id,
                              })
                          }
                          marginVertical={sizes.s}
                          marginHorizontal={sizes.sm}
                          gradient={gradients.primary}>
                          <Text bold white transform="uppercase">
                            {isAssigned(item) ? "Assigned" : "Assign"}
                          </Text>
                      </Button>
                </View>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>Loading...</Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>{battle ? battle["boss"]["name"] : ""}</Text>
                </View>

                <FlatList
                    style={{flex:1}}
                    data={battle["boss"]["items"]}
                    renderItem={({ item }) => <Item item={item}/>}
                    keyExtractor={item => item.id}
                    />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      marginTop:60
    },
    runName: {
      alignSelf:"center",
    },
    listItem:{
      margin:10,
      padding:10,
      backgroundColor:"#FFF",
      width:"90%",
      flex:1,
      alignSelf:"center",
      borderRadius:5
    },    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
  });
export default BattleScreen;