import React, {useEffect, useState} from "react"; 
import {StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Text, Button } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';
import CharacterButton from "../components/CharacterButton";
import { set } from "react-native-reanimated";
import alertBox from '../components/AlertBox'
import Checkbox from 'expo-checkbox';



const DropScreen = ({route, navigation}) => {

    const battleId = route.params.battleId;
    const teamId = route.params.teamId;
    const [characters, setCharacters] = useState(null);
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);
    const [drop, setDrop] = useState(null);
    const [dropItem, setDropItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    const {assets, colors, gradients, sizes} = useTheme();

    const getData = async () => {
        axios({
            url:`${BASE_URL}/api/battles/${battleId}/drops/${route.params.itemId}`,
            method : "GET",
        }).then((res)=>{
            setCharacters(res.data["characters"]);
            if (res.data["drop"] != null) {
                setDrop(res.data["drop"]);
                setToggleCheckBox(res.data["drop"]["disenchanted"]);
            }
            setDropItem(res.data["item"]);
            setIsLoading(false);
        }).catch((error) => {
            ErrorHandler(error)
        })
    };

    const createDrop = (characterId, disenchanted) => {
        drop ? url = `${BASE_URL}/api/battles/${battleId}/drops/${drop.id}` : url = `${BASE_URL}/api/battles/${battleId}/drops`
        // if drop exists post to update, else post to create
        console.log(url)
        if (characterId) {
            axios.post(`${url}?character_id=${characterId}&item_id=${dropItem.id}&disenchanted=${disenchanted}`
            ).then((res)=>{
                navigation.navigate('BattleScreen', {
                    battleId: battleId,
                    runId: route.params.runId,
                    bossId: route.params.bossId,
                })
            }).catch((error) => {
                ErrorHandler(error)
            })
        } else {
            alertBox("Please select a character")
        }
    }

    function isAssigned (id) {
        if (characters) {
            if (selectedCharacterId == id) {
                return styles.selected;
            }
            if (drop && drop["character_id"] == id) {
                return styles.currentSelected;
            }
        }
    }

    useEffect(() => {
      getData();
    }, []);

    if (isLoading) {

        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>Loading...</Text>
                </View>
            </View>
        )

    } else {

        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${dropItem.image_path}`}} />
                    <Text h4 style={styles.itemName}>{dropItem.name}</Text>
                </View>
                    <Text h5 style={{alignSelf:'center'}}>{drop ? `Currently assigned to: ${drop.character_name}` : ""}</Text>
                    <Text h5 danger style={{alignSelf:'center'}}>{drop ? `${drop.disenchanted ? "Disenchanted" : ""}` : ""}</Text>

                <FlatList
                    data={characters}
                    renderItem={({item}) =>
                            
                        <View
                            style={{marginTop: 0, width: '100%', justifyContent: 'center', alignItems: 'center'}} >
                            <View style={{paddingTop: 10,paddingBottom:0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{width: "100%", paddingHorizontal: 20, borderRadius: 10}}>
                                    <Text white bold backgroundColor={colors.primary}>{item.title}</Text>
                                </View>


                                <FlatList 
                                    data={item.data}
                                    extraData={selectedCharacterId}
                                    numColumns={5}
                                    style={{marginTop: 10}}
                                    renderItem={({ item: innerData, index }) =>
                                        <TouchableOpacity 
                                            style={[styles.character, isAssigned(innerData["id"])]}
                                            onPress={() => setSelectedCharacterId(innerData["id"])}
                                            key={innerData["id"]}>
                                                <CharacterButton 
                                                    item={innerData} 
                                                    size={60} />
                                        </TouchableOpacity>
                                }/>

                            </View>
                        </View>
                    }
                />
                <View style={styles.btnContainer}>
                <Checkbox
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={setToggleCheckBox}
                />
                <Text style={{marginLeft:5}}>Disenchant</Text>
                <Button
                    onPress={() => createDrop(selectedCharacterId, toggleCheckBox)}
                    flex={1}
                    gradient={gradients.primary}
                    style={styles.btnSave}>
                    <Text white bold transform="uppercase">
                        {drop ? "Update" : "Assign"}
                    </Text>
                </Button>
                </View>
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
    nameContainer: {
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        borderBottomWidth: 1,
        borderRadius: 10,
        padding:10,
    },
    itemName: {
        margin: 10,
    },
    character: {
        width: 70,
        padding: 2,
        alignItems: 'center',
    },
    selected: {
        backgroundColor: "#80cbe7",
        borderWidth: 1,
        borderColor: "#000",
    },
    currentSelected: {
        backgroundColor: "#42f58a",
        borderWidth: 1,
        borderColor: "#000",
    },
    characterList: {
      flex:1,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        height:60,
        zIndex: 100,
        padding:10,
    },
    btnSave : {
        width: 50,
        marginLeft: 10,
    },
  });
export default DropScreen;