import React, {useContext, useState, useEffect} from "react"; 
import {StyleSheet, View, FlatList, SafeAreaView, ImageBackground, Image, TouchableOpacity, SectionList } from "react-native";
import {Button, Block, Text} from '../components/';

import Modal from 'react-native-modal';
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import { set } from "react-native-reanimated";
import CharacterButton from "../components/CharacterButton";

const TeamCreateScreen = ({route, navigation}) => {
    const {friends, getFriends, userInfo} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const { teamId, teamName } = route.params;
    
    const [buffs, setBuffs] = useState([]);
    const [spells, setSpells] = useState([]);
    const [combinedChars, setCombinedChars] = useState([]);
    const [activeChars, setActiveChars] = useState([]);
    const [visible, setVisible] = useState(false);
    

    useEffect(() => {
        if (buffs.length === 0){
            axios({
                url:`${BASE_URL}/api/buffs/`,
                method : "GET",
            }).then((res)=>{
                setBuffs(res.data)
            }).catch((error) => {
                ErrorHandler(error)
            })
        } //get list of buffs

        if (activeChars.length === 0){
            axios({
                url:`${BASE_URL}/api/teams/${teamId}/`,
                method : "GET",
            }).then((res)=>{
                setActiveChars(res.data["characters"])
                setSpells(res.data["spells"])
            }).catch((error) => {
                ErrorHandler(error)
            })
        }//get list of active characters

        if (friends){
            setCombinedChars([]);
            let tempArray = userInfo["characters"];
            for (let i = 0; i < friends.length; i++) {
                let chars = friends[i].characters;
                for (let j = 0; j < chars.length; j++) {
                    tempArray.push(chars[j])
                }
            }
            tempArray = tempArray.filter((char) => !activeChars.includes(char));

            setCombinedChars(tempArray);
        } else {
            getFriends();
        }
    }, [friends]);

    const addToTeam = (charId) => {
        axios({
            url:`${BASE_URL}/api/teams/${teamId}/characters?character_id=${charId}`,
            method : "POST",
        }).then((res)=>{
            setActiveChars(res.data["characters"])
            setSpells(res.data["spells"])
            newCombinedChars = combinedChars.filter((char) => char.id != charId)
            setCombinedChars(newCombinedChars)
        }).catch((error) => {
            ErrorHandler(error)
        })
    }

    const removeFromTeam = (charId) => {
        var removedCharacter = activeChars.filter((char) => char.id == charId)
        axios({
            url:`${BASE_URL}/api/teams/${teamId}/characters?character_id=${charId}`,
            method : "DELETE",
        }).then((res)=>{
            setActiveChars(res.data["characters"])
            setSpells(res.data["spells"])
            newCombinedChars = combinedChars.concat(removedCharacter)
            setCombinedChars(newCombinedChars)
        }).catch((error) => {
            ErrorHandler(error)
        })
    }

    const handleVisibleModal = () => {
        setVisible(!visible)
    }
    

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <TouchableOpacity style={styles.listItem} onPress={() => {addToTeam(item.id)}}>
                <CharacterButton item={item} size={60} />
            </TouchableOpacity>
          </View>
        );
      }

      function ActiveItem({ item }) {
        return (
          <View style={styles.listItem}>
            <TouchableOpacity style={styles.listItem} onPress={() => {removeFromTeam(item.id)}}>
                <CharacterButton item={item} size={60} />
            </TouchableOpacity>
          </View>
        );
      }

      if (activeChars.length > 0){
        rosterHeader = <Text>Active Characters</Text>
      } else {
        rosterHeader = <Text>No Active Characters</Text>
      }

    function spellsforBuff(buff){
        let tempArray = [];
        for (let i = 0; i < spells.length; i++) {
            let spell = spells[i];
            if (spell["buff_id"] == buff["id"]) {
                tempArray.push(spell)
            }
        }
        return tempArray;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                isVisible={visible}
                style={styles.modal}
                hasBackdrop={true}
                backdropColor="black"
            >
                <View style={styles.modalView}>
                    <SectionList
                        sections={buffs}
                        extraData={spells}
                        keyExtractor={(item, index) => item + index}
                        style={styles.spellIconList}
                        renderItem={({item}) => (
                            <View style={styles.item} key={item["id"]}>
                                <Text style={styles.title}>{item["name"]}</Text>
                                <View style={styles.imageContainer}>
                                {spellsforBuff(item).map((key,index)=>{
                                    return(
                                        <Image
                                            src={`${BASE_URL}/spells/${key["icon"]}.jpg`}
                                            style={styles.characterIcon} />
                                    )
                                })}
                                </View>
                            </View>
                        )}
                        renderSectionHeader={({section: {title}}) => (
                            <Text white bold backgroundColor={colors.primary} style={styles.header}>{title}</Text>
                        )}
                    />
                </View>
                <Button style={styles.modalButton} gradient={gradients.secondary} marginHorizontal={sizes.s} onPress={handleVisibleModal}>
                    <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
                        Close
                    </Text>
                </Button>
            </Modal>


            <Text h4 bold>{teamName}</Text>
            {rosterHeader}
            <View style={styles.listContainer}>
                <FlatList
                    style={styles.list}
                    data={activeChars}
                    scrollEnabled={false}
                    numColumns={5}
                    renderItem={({ item }) => <ActiveItem item={item}/>}
                    keyExtractor={item => item.id}
                    extraData={activeChars}
                />
            </View>
            <Text>Available Characters</Text>
            <View style={styles.listContainer}>
                <FlatList
                    style={styles.list}
                    data={combinedChars}
                    numColumns={5}
                    renderItem={({ item }) => <Item item={item}/>}
                    keyExtractor={item => item.id}
                    extraData={combinedChars}
                />
            </View>
            <Button
                style={styles.modalButton}
                onPress={handleVisibleModal}
                gradient={gradients.secondary}>
                <Text white bold transform="uppercase">
                    Show Buffs
                </Text>
            </Button>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F7F7F7',
        marginLeft: 20,
        marginRight:20,
        width: '100%',
    },
    modal:{
        backgroundColor : "#ffffff",
        marginTop: 20,
        display:"flex",
    },
    modalView:{
        marginTop: 20,
        marginBottom: 20,
    },
    modalButton:{
        alignSelf: "center",
        height:20,
        width: 100,
        marginBottom:5,
    },
    spellIconList: {

       
    },
    listItem:{
        backgroundColor:"#FFF",
        borderRadius:5,
    },
    listContainer : {
        flex:1,
        flexDirection: 'row',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        display: "flex",
    },
    item_character : {
        padding :15,
        borderBottomWidth: 3,
        borderBottomColor : "darkgray",
    },
    characterIcon : {
        width: 30, 
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
    },
    iconContainer : {
      justifyContent: 'flex-start',
    },
    textContainer : {
        width: '60%',
        alignContent : "flex-end",
    },
    txt_name : {
      width: "auto",
      alignSelf: "flex-start",
    },
    imageContainer : {
        flexDirection: 'row',
    },
      header: {
        fontSize: 32,
        fontWeight: 'bold',
      },
      title: {
        fontSize: 18,
      },
      item: {
        padding: 5,
        borderBottomWidth: 1,
      },
});

export default TeamCreateScreen;