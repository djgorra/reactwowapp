import React, {useContext, useState, useEffect} from "react"; 
import {StyleSheet, View, FlatList, SafeAreaView, ImageBackground, Image, TouchableOpacity, SectionList } from "react-native";
import {Button, Text, Block} from '../components/';

import Modal from 'react-native-modal';
import { Input } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import { set } from "react-native-reanimated";

const TeamCreateScreen = ({route, navigation}) => {
    const {friends, getFriends} = useContext(AuthContext);
    const [combinedChars, setCombinedChars] = useState([]);
    const [activeChars, setActiveChars] = useState([]);
    const [visible, setVisible] = useState(false);
    const {assets, colors, gradients, sizes} = useTheme();
    const { teamId, teamName } = route.params;
    const [buffs, setBuffs] = useState([]);
    const [spells, setSpells] = useState([]);


    useEffect(() => {
        if (buffs.length == 0){
            axios({
                url:`${BASE_URL}/api/buffs/`,
                method : "GET",
            }).then((res)=>{
               // console.log(res.data[0])
                setBuffs(res.data)
            }).catch((error) => {
                ErrorHandler(error)
            })
        }

        if (activeChars.length == 0){
            axios({
                url:`${BASE_URL}/api/teams/${teamId}/`,
                method : "GET",
            }).then((res)=>{
                setActiveChars(res.data["characters"])
                setSpells(res.data["spells"])
                console.log(res.data["spells"])
            }).catch((error) => {
                ErrorHandler(error)
            })
        }

        if (friends){
            setCombinedChars([]);
            let tempArray = [];
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
            console.log(res.data["characters"])
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
                <ImageBackground src={`${BASE_URL}${item.class_icon}`}  style={{height: 60,width: 60,justifyContent:'center'}}/>
                <View style={styles.iconContainer}>
                    <Image
                    src={`${BASE_URL}${item.primary_spec_icon}`}
                    style={styles.characterIcon} />
                    <Image
                    src={`${BASE_URL}${item.secondary_spec_icon}`}
                    style={styles.characterIcon} />
                </View>
                <View style={styles.textContainer}>
                    <Text h5 style={styles.txt_name}>{item.name}</Text>
                </View>
            </TouchableOpacity>
          </View>
        );
      }

      function ActiveItem({ item }) {
        return (
          <View style={styles.listItem}>
            <TouchableOpacity style={styles.listItem} onPress={() => {removeFromTeam(item.id)}}>
                <ImageBackground src={`${BASE_URL}${item.class_icon}`}  style={{height: 60,width: 60,justifyContent:'center'}}/>
                <View style={styles.iconContainer}>
                    <Image
                    src={`${BASE_URL}${item.primary_spec_icon}`}
                    style={styles.characterIcon} />
                    <Image
                    src={`${BASE_URL}${item.secondary_spec_icon}`}
                    style={styles.characterIcon} />
                </View>
                <View style={styles.textContainer}>
                    <Text h5 style={styles.txt_name}>{item.name}</Text>
                </View>
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
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                <Text style={styles.title}>{item["name"]}</Text>
                                {spellsforBuff(item).map((key,index)=>{
                                    return(
                                        <Text>{key["icon"]}</Text>
                                    )
                                })}
                            </View>
                        )}
                        renderSectionHeader={({section: {title}}) => (
                            <Text style={styles.header}>{title}</Text>
                        )}
                    />
                </View>
                <Button gradient={gradients.secondary} marginHorizontal={sizes.s} onPress={handleVisibleModal}>
                    <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
                        Close
                    </Text>
                </Button>
            </Modal>
            <Text>{teamName}</Text>
            {rosterHeader}
            <FlatList
                style={styles.list}
                data={activeChars}
                renderItem={({ item }) => <ActiveItem item={item}/>}
                keyExtractor={item => item.id}
                extraData={activeChars}
            />
            <Text>Available Characters</Text>
            <FlatList
                style={styles.list}
                data={combinedChars}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.id}
                extraData={combinedChars}
            />
            <Button
                onPress={handleVisibleModal}
                gradient={gradients.secondary}
                marginBottom={sizes.base}>
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
        marginTop:60,
        marginLeft: 20,
        marginRight:20
    },
    modal:{
        backgroundColor : "#ffffff",
        marginBottom:20,
    },
    list: {
        height: 'auto',
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
    item_character : {
        padding :15,
        borderBottomWidth: 3,
        borderBottomColor : "darkgray",
    },
    characterIcon : {
        width: 30, 
        height: 30,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 30,
        alignSelf:"center",

    },
    iconContainer : {
        marginLeft : 3,
    },
    textContainer : {
        width: '60%',
        alignContent : "flex-end",
    },
    txt_name : {
      width: "auto",
      alignSelf: "center",
    },
      header: {
        fontSize: 60,
        fontWeight: 'bold',
        backgroundColor: 'red',
      },
      title: {
        fontSize: 24,
      },
});

export default TeamCreateScreen;