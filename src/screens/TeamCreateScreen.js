import React, {useContext, useEffect} from "react"; 
import {StyleSheet, View, FlatList, SafeAreaView, ImageBackground, Image, TouchableOpacity, SectionList, ScrollView, LogBox } from "react-native";
import {Button, Block, Text} from '../components/';
import BlueButton from "../components/BlueButton";
import useState from 'react-usestateref';
import Modal from 'react-native-modal';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import CharacterButton from "../components/CharacterButton";

const TeamCreateScreen = ({route, navigation}) => {
    const {friends, getFriends, userInfo, buffs, getBuffs, setIsLoading, version, teams} = useContext(AuthContext);
    const { colors, gradients, sizes} = useTheme();
    const { teamId } = route.params;
    const team=teams.find((t)=>t.id==teamId);
    const [spells, setSpells] = useState([]);
    const [availableChars, setAvailableChars] = useState([]);
    const [activeChars, setActiveChars, activeCharsRef] = useState([]);
    const [visible, setVisible] = useState(false); //i.e. for modal
    const numColumns = 25; //i.e. 25 is max number of characters on a team
    const columnWrapperStyle = { flexWrap: 'wrap', flex: 1, rowGap: 5, columnGap: 2, justifyContent: 'center' }; //i.e. automatically wrap the flatlist items

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
            versionCharacters = userInfo["characters"].filter((c)=>{ return c["version_id"]==version; } )
            let tempArray = JSON.parse(JSON.stringify(versionCharacters));
            let out = [];
            
            //i.e. for each friend, get their characters for the current version and add them to tempArray
            for (let i = 0; i < friends.length; i++) {
                let chars = friends[i].characters.filter((c)=>{ return c["version_id"]==version; } );
                for (let j = 0; j < chars.length; j++) {
                    tempArray.push(chars[j])
                }
            }

            for (let i = 0; i < team["team_code_characters"].length; i++) {
                tempArray.push(team["team_code_characters"][i])
            }

            //i.e. make an array of all character id's for characters in activeChars
            let activeCharIds = activeCharsRef.current.map((char) => char.id);
            //i.e. remove characters from tempArray if the id appears in activeCharIds using filter
            tempArray = tempArray.filter((char) => !activeCharIds.includes(char.id))
            //i.e. remove duplicates from tempArray
            out = tempArray.filter((char, index, self) => self.findIndex((c) => c.id === char.id) === index)

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

    const meleeDPS = activeChars.filter((char) => char["primary_spec_role"] == "mDPS").length
    const rangedDPS = activeChars.filter((char) => char["primary_spec_role"] == "rDPS").length
    const healers = activeChars.filter((char) => char["primary_spec_role"] == "Heal").length
    const tanks = activeChars.filter((char) => char["primary_spec_role"] == "Tank").length

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <TouchableOpacity style={styles.listItem} onPress={() => {addToTeam(item.id)}}>
                <CharacterButton item={item} size={120} />
            </TouchableOpacity>
          </View>
        );
      }

      function ActiveItem({ item }) {
        return (
          <View style={styles.listItem}>
            <TouchableOpacity style={styles.listItem} onPress={() => {removeFromTeam(item.id)}}>
                <CharacterButton item={item} size={120} />
            </TouchableOpacity>
          </View>
        );
      }

      if (activeChars.length > 0){
        rosterHeader = <Text white h5 style={{alignSelf:"center"}}>Active Characters</Text>
      } else {
        rosterHeader = <Text white h5 style={{alignSelf:"center"}}>No Active Characters</Text>
      }

    function renderItem({ item }) {
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', height: 80, borderBottomWidth: 1, borderBottomColor : "#34455e", alignContent:'center'}} key={item["id"]}>
                <Text h5 white style={{flex: 6, alignSelf:'center'}}>{item["name"]}</Text>
                <View style={{flex:2, flexDirection: 'row', justifyContent:'center', alignSelf:'center'}}>
                    {spellsforBuff(item).map((key,index)=>{
                        return(
                            <Image
                                src={`${BASE_URL}/spells/${key["icon"]}.jpg`}
                                style={styles.characterIcon} />
                        )
                    })}
                </View>
            </View>
        );
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
        <View style={{backgroundColor:'#02000b', height:'100%'}}>
            <ScrollView style={styles.container}
                contentContainerStyle={{alignContent:"center"}}>
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
                            renderItem={renderItem}
                            renderSectionHeader={({section: {title}}) => (
                                <Text h4 white bold backgroundColor={'#1f3040'} style={styles.header}>{title}</Text>
                            )}
                        />
                        <BlueButton text="Close" onPress={handleVisibleModal}/>
                    </View>
                </Modal>

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
                        columnWrapperStyle={columnWrapperStyle}
                    />
                </View>
                <Text white h5 style={{alignSelf:"center"}}>Available Characters</Text>
                
                    <FlatList
                        style={styles.list}
                        data={availableChars}
                        numColumns={numColumns}
                        renderItem={({ item }) => <Item item={item}/>}
                        keyExtractor={item => item.id}
                        columnWrapperStyle={columnWrapperStyle}
                        // extraData={availableChars}
                    />
        
            </ScrollView>
                    <View style={styles.roleContainer}>
                        <Text white h5 style={{alignSelf:"center"}}>Roles</Text>
                        <Text white h6 style={{alignSelf:"center"}}>Melee DPS: {meleeDPS}</Text>
                        <Text white h6 style={{alignSelf:"center"}}>Ranged DPS: {rangedDPS}</Text>
                        <Text white h6 style={{alignSelf:"center"}}>Healers: {healers}</Text>
                        <Text white h6 style={{alignSelf:"center"}}>Tanks: {tanks}</Text>
                            
                    </View>
                    <View style={styles.inviteCodeContainer}>
                        <Text white h5 style={styles.inviteCode}>Invite Code:</Text><Text selectable={true} white h5 style={styles.inviteCode}>{team["invite_code"]}</Text>
                    </View>
            <BlueButton
                text={"Show Buffs"}
                onPress={handleVisibleModal}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '90%',
        backgroundColor: '#02000b',
    },
    modal:{
        backgroundColor : "#02000b",
        marginTop: 20,
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
        flexDirection: 'column',
    },
    list : {
        flex: 1,
        flexDirection: 'column',
    },
    characterIcon : {
        width: 30, 
        height: 30,
        borderWidth: 1,
        borderColor: '#000',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
    },

    inviteCode: {
        padding: 5,
    },
    inviteCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
});

export default TeamCreateScreen;