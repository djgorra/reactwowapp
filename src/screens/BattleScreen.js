import React, {useContext, useEffect, useState} from "react"; 
import {StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Button, Text } from '../components';
import BlueButton from "../components/BlueButton";
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
    const [search, setSearch] = useState("");
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

    const filterData = (item) => {
        if (search === "") {
            return ( <Item item={item}/> )
        } else {
            if (item["name"].toLowerCase().includes(search.toLowerCase())) {
                return ( <Item item={item}/> )
            }
        }
    
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
                    <Text white bold style={{flex:6}}>{item.name}</Text>
                    <BlueButton
                        text={isAssigned(item) ? "Assigned" : "Assign"}
                          onPress={() =>
                              navigation.navigate('DropScreen', {
                                    teamId: teamId,
                                    runId: runId,
                                    bossId: bossId,
                                    battleId: battleId,
                                    itemId: item.id,
                              })
                          }
                    />
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
                <TextInput style={styles.input} placeholder="Search" placeholderTextColor="#aaaaaa" onChangeText = {(text) => setSearch(text)} />

                <FlatList
                    style={{flex:1}}
                    data={battle["boss"]["items"]}
                    renderItem={({ item, index }) => filterData(item)}
                    keyExtractor={item => item.id}
                    />
            </View>
        );
    }
}

borderColor = '#34455e';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#02000b',
    },
    runName: {
      alignSelf:"center",
    },
    input: {
        backgroundColor: '#02000b',
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
        margin: 10,
        padding: 10,
        width: "90%",
        alignSelf: "center",
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
      borderColor: borderColor,
      borderWidth: 2,
      width:"90%",
      flex:1,
      alignSelf:"center",
      borderRadius:5
    },    
    assignedListItem:{
        backgroundColor: "#008a3e",
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
  });
export default BattleScreen;