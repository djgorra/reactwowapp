import React, {useEffect, useState} from "react"; 
import {StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Text, Button } from '../components';
import BlueButton from "../components/BlueButton";
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
            <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <Text h5 white style={styles.runName}>Loading...</Text>
                </View>
            </View>
        )

    } else {

        return (
            <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${dropItem.image_path}`}} />
                    <Text h5 white style={styles.itemName}>{dropItem.name}</Text>
                </View>

                {drop ?
                    <View style={styles.dropInfoContainer}>
                        <Text h6 white style={{alignSelf:'center'}}>{drop ? `Currently assigned to: ${drop.character_name}` : ""}</Text>
                        <Text h5 danger style={{alignSelf:'center'}}>{drop ? `${drop.disenchanted ? "Disenchanted" : ""}` : ""}</Text>
                    </View>
                    : null
                }

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
                                    numColumns={2}
                                    style={{marginTop: 10}}
                                    renderItem={({ item: innerData, index }) =>
                                        <TouchableOpacity 
                                            style={[styles.character, isAssigned(innerData["id"])]}
                                            onPress={() => setSelectedCharacterId(innerData["id"])}
                                            key={innerData["id"]}>
                                                <CharacterButton 
                                                    item={innerData} 
                                                    size={160} />
                                        </TouchableOpacity>
                                }/>

                            </View>
                        </View>
                    }
                />
                <View style={styles.btnContainer}>
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={setToggleCheckBox}
                            />
                        <Text white style={{marginLeft:10}}>Disenchant</Text>
                    </View>
                    <BlueButton
                        onPress={() => createDrop(selectedCharacterId, toggleCheckBox)}
                        text={drop ? "Update" : "Assign"}
                    />
                </View>
            </View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#02000b',
    },
    nameContainer: {
        backgroundColor: '#324461',
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        borderBottomWidth: 1,
        borderColor: "#FFF",
        padding:10,
    },
    dropInfoContainer: {
        backgroundColor: '#324461',
        padding:10,
    },
    itemName: {
        margin: 10,
    },
    character: {
        padding: 2,
        alignItems: 'center',
    },
    selected: {
        backgroundColor: "#80cbe7",
        borderWidth: 1,
        borderColor: "#000",
    },
    currentSelected: {
        backgroundColor: "#324461",
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
        height:60,
        zIndex: 100,
        padding:10,
    },
    checkboxContainer: {
        flexDirection: 'row',
    },
    btnSave : {
        width: 50,
        marginLeft: 10,
    },
  });
export default DropScreen;