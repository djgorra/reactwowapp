import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, SectionList, FlatList } from "react-native";
import { Input, Text } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';
import CharacterButton from "../components/CharacterButton";


const DropScreen = ({route, navigation}) => {

    const battleId = route.params.battleId;
    const teamId = route.params.teamId;
    const [characters, setCharacters] = useState(null);
    const [dropItem, setDropItem] = useState(null);

    const {assets, colors, gradients, sizes} = useTheme();
    const getData = async () => {
        axios({
            url:`${BASE_URL}/api/battles/${battleId}/items/${route.params.itemId}`,
            method : "GET",
        }).then((res)=>{
            console.log(res.data)
            setCharacters(res.data["characters"]);
            setDropItem(res.data["item"]);
        }).catch((error) => {
            ErrorHandler(error)
        })
    }

    useEffect(() => {
      getData();
    }, []);

    if (characters && dropItem) {
        console.log(characters)
        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${dropItem.image_path}`}} />
                    <Text h4 style={styles.itemName}>{dropItem.name}</Text>
                </View>

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
                                    numColumns={5}
                                    style={{marginTop: 10}}
                                    renderItem={({ item: innerData, index }) =>
                                        <View style={styles.character} key={innerData["id"]}>
                                            <CharacterButton item={innerData} size={60} />
                                        </View>
                                }/>

                            </View>
                        </View>
                 }
                 />
                
                {/* <SectionList
                    sections={characters}
                    // extraData={spells}
                    keyExtractor={(item, index) => item + index}
                    style={styles.characterList}
                    stickySectionHeadersEnabled={false}
                    contentContainerStyle={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}
                    renderItem={({item}) => (
                        <View style={styles.character} key={item["id"]}>
                            <CharacterButton item={item} size={60} />
                        </View>
                    )}
                    renderSectionHeader={({section: {title}}) => (
                        <View>
                        <View style={styles.header}>
                            <Text white bold backgroundColor={colors.primary}>{title}</Text>
                        </View>
                        </View>
                    )}
                /> */}
            </View>
        );
    } else {
        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>Loading...</Text>
                </View>
            </View>
        )
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
    },
    itemName: {
        margin: 10,
    },
    header: {
        alignSelf:"center",
        width: "100%",
        textAlign: "center",
    },
    character: {
        width: 70,
    },
    characterList: {
      flex:1,
    },
  });
export default DropScreen;