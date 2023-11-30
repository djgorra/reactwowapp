import React, {useContext, useEffect} from "react"; 
import {StyleSheet, View, FlatList, SafeAreaView, ImageBackground, Image, TouchableOpacity, SectionList, ScrollView, LogBox } from "react-native";
import {Button, Block, Text} from '../components/';
import useState from 'react-usestateref';
import Modal from 'react-native-modal';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import CharacterButton from "../components/CharacterButton";

const TeamCreateScreen = ({route, navigation}) => {
    const {friends, getFriends, userInfo, buffs, getBuffs, setIsLoading} = useContext(AuthContext);
    const { colors, gradients, sizes} = useTheme();
    const { teamId, teamName } = route.params;
    
    const [spells, setSpells] = useState([]);
    const [availableChars, setAvailableChars] = useState([]);
    const [activeChars, setActiveChars, activeCharsRef] = useState([]);
    const [visible, setVisible] = useState(false); //i.e. for modal
    const numColumns = 4; //i.e. number of columns in both flatlists
    const gap = 2; //i.e. gap between flatlist items

    //i.e. ignore yellowbox warning about nested virtualized lists
    LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

    
    useEffect(() => {
        if (buffs.length === 0){
            getBuffs();
        } //get list of buffs

        if (activeChars.length === 0){
            setIsLoading(true);
            axios({
                url:`${BASE_URL}/api/teams/${teamId}/`,
                method : "GET",
            }).then((res)=>{
                setActiveChars(res.data["characters"])
                setSpells(res.data["spells"])
                updateAvailableChars();
                setIsLoading(false);
            }).catch((error) => {
                ErrorHandler(error);
                setIsLoading(false);
            })
        }//get list of active characters

        if (friends){
          updateAvailableChars()  
        } else {
            getFriends();
        }
    }, [friends]);

    function updateAvailableChars(){
        if (friends && activeCharsRef){ 
            setAvailableChars([]); 

            //i.e. make tempArray a deep copy of userInfo["characters"]
            let tempArray = JSON.parse(JSON.stringify(userInfo["characters"]));
            let out = [];
            for (let i = 0; i < friends.length; i++) {
                let chars = friends[i].characters;
                for (let j = 0; j < chars.length; j++) {
                    tempArray.push(chars[j])
                }
            }

            //i.e. make an array of all character id's for characters in activeChars
            let activeCharIds = activeCharsRef.current.map((char) => char.id);
            //i.e. remove characters from tempArray if the id appears in activeCharIds using filter
            out = tempArray.filter((char) => !activeCharIds.includes(char.id))
            setAvailableChars(out);
        }
    }

    const addToTeam = (charId) => {
        if (activeChars.length >= 25){
            alertBox("You can only have 25 characters on a team")
            return;
        }
        axios({
            url:`${BASE_URL}/api/teams/${teamId}/characters?character_id=${charId}`,
            method : "POST",
        }).then((res)=>{
            setActiveChars(res.data["characters"])
            setSpells(res.data["spells"])
            newavailableChars = availableChars.filter((char) => char.id != charId)
            setAvailableChars(newavailableChars)
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
            newavailableChars = availableChars.concat(removedCharacter)
            setAvailableChars(newavailableChars)
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
        <View>
        <ScrollView style={styles.container}>
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
                    numColumns={numColumns}
                    renderItem={({ item }) => <ActiveItem item={item}/>}
                    keyExtractor={item => item.id}
                    extraData={activeChars}
                    contentContainerStyle={{gap}}
                    columnWrapperStyle={{gap}}
                />
            </View>
            <Text>Available Characters</Text>
            
                <FlatList
                    style={styles.list}
                    data={availableChars}
                    numColumns={numColumns}
                    renderItem={({ item }) => <Item item={item}/>}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{gap}}
                    columnWrapperStyle={{gap}}
                    // extraData={availableChars}
                />
      
        </ScrollView>
        <Button
        style={styles.modalButton}
        onPress={handleVisibleModal}
        gradient={gradients.secondary}>
            <Text white bold transform="uppercase">
                Show Buffs
            </Text>
        </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // backgroundColor: '#F7F7F7',
        marginLeft: 20,
        marginRight:20,
        width: '100%',
        paddingBottom:40 //i.e. to prevent bottom of screen from being cut off with short lists
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

    },
    item: {

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

    },
    textContainer : {
        width: '60%',
    },
    txt_name : {
      width: "auto",
    },
    imageContainer : {

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