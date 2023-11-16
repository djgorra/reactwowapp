import React, {useContext, useEffect, useState} from "react"; 
import {StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Button, Text } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';
import { useIsFocused } from '@react-navigation/native';




const BattleScreen = ({route, navigation}) => {
    const teamId = route.params.teamId;
    const runId = route.params.runId;
    const bossId = route.params.bossId;

    const [battle, setBattle] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [drops, setDrops] = useState(null);
    const [battleId, setBattleId] = useState(route.params.battleId);
    const isFocused = useIsFocused();

    const getData = async () => {
        axios.post(`${BASE_URL}/api/battles?run_id=${runId}&boss_id=${bossId}`
        ).then((res)=>{
            setBattle(res.data);
            setDrops(res.data["drops"]);
            setBattleId(res.data["id"]);
            setIsLoading(false);
        }).catch((error) => {
            ErrorHandler(error)
        })
    }

    useEffect(() => {
        getData();
    }, [isFocused]);

    function isAssigned (item) {
        if (drops) {
            for (let i = 0; i < drops.length; i++) {
                if (drops[i]["item"]["id"] == item.id) {
                    return true;
                }
            }
        }
        return false;
    }
    

    function Item({ item }) {
        return (
            <View style={[styles.listItem, isAssigned(item) ? styles.assignedListItem : null]}>
                <View style={styles.buttonContainer}>
                    <Image style={styles.itemImage} source={{uri: `${BASE_URL}${item.image_path}`}} />
                    <Text style={{flex:6}}>{item.name}</Text>
                    <Button
                        style={styles.button}
                        title={isAssigned(item) ? "Assigned" : "Assign"}
                          onPress={() =>
                              navigation.navigate('DropScreen', {
                                    teamId: teamId,
                                    runId: runId,
                                    bossId: bossId,
                                    battleId: battleId,
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
            <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>Loading...</Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
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
    },
    runName: {
      alignSelf:"center",
    },
    nameContainer: {
        alignItems:"center",
        borderRadius: 10,
        padding:10,
        margin:10,
        borderBottomWidth: 1,
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
    assignedListItem:{
        backgroundColor: "#42f58a",
        borderWidth: 1,
      },
    itemImage: {
        width: 50,
        height: 50,
        margin: 10,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        width: 70,
        height: 30,
    },
  });
export default BattleScreen;