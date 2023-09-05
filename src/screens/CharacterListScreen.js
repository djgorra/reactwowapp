import React, {useContext, useState, useEffect} from "react"; 
import { AuthContext } from "../context/AuthContext";
import {useTheme} from '../hooks/';
import {Button, Text, Block} from '../components/';
import { BASE_URL } from "../config";
import axios from 'axios';
import alertBox from "../components/AlertBox.js"
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import ErrorHandler from "../components/ErrorHandler";
import {
    SafeAreaView,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ImageBackground,
} from "react-native";




const CharacterListScreen = ({navigation}) => {
    const {userInfo, setUserInfo, setIsLoading, logout, updateUser, classes, specs, races, genders, characterList, setCharacterList} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const [visible,setVisible] = useState(false); //modal popup
    const [openClass, setOpenClass] = useState(false); //dropdown
    const [openSpec1, setOpenSpec1] = useState(false); //dropdown
    const [openSpec2, setOpenSpec2] = useState(false); //dropdown
    const [openRace, setOpenRace] = useState(false); //dropdown
    const [openGender, setOpenGender] = useState(false); //dropdown
    const [specsDisabled, setSpecsDisabled] = useState(true); //dropdown

    const [characterName,setCharacterName] = useState("");
    const [characterClass,setCharacterClass] = useState(null);
    const [characterSpec1,setCharacterSpec1] = useState(null);
    const [characterSpec2,setCharacterSpec2] = useState(null);
    const [characterRace,setCharacterRace] = useState(null);
    const [characterGender,setCharacterGender] = useState(null);
    const [classSpecs,setClassSpecs] = useState([]);
    const [hideId,setHideId] = useState(null);

    useEffect(()=>{
        getList()
    })

    const getList= () => {
        setCharacterList(userInfo["characters"]);
    }

    const confirmDelete = (hideId) =>
    Alert.alert(
        'Notice:',
        'Are you sure you want to delete this character?',
        [
        {
            text: 'Yes',
            onPress: () => handleDelete(hideId),
            style: 'destructive',
        },
        {
            text: 'Cancel',
            style: 'cancel',
        },
        ],
        {
            cancelable: true,
        },
    );

    const handleDelete = (item) =>{
        axios({
            url:`${BASE_URL}/api/characters/${item}.json`,
            method : "DELETE",
        }).then((res)=>{
            getList();
        }).catch((error) => {
            ErrorHandler(error);
        })
    }
    const clearForm = (res) => {
        if(res){
            setUserInfo(res.data);
        }
        getList();
        setIsLoading(false);
        setCharacterName("");
        setCharacterClass(null);
        setCharacterSpec1(null);
        setCharacterSpec2(null);
        setCharacterRace(null);
        setCharacterGender(null);
        setVisible(false);
        setSpecsDisabled(true);
    }

    const handleSave = (item) => {
        setIsLoading(true)
        if(hideId == null){
            axios({
                url:`${BASE_URL}/api/characters.json?character[name]=${characterName}&character[user_id]=${userInfo["user"]["id"]}&character[character_class_id]=${characterClass}&character[race]=${characterRace}&character[gender]=${characterGender}&character[primary_spec_id]=${characterSpec1}&character[secondary_spec_id]=${characterSpec2}`,
                method : "POST",
            }).then((res)=>{
                clearForm(res);
            }).catch((error) => {
                ErrorHandler(error);
                setIsLoading(false)
                console.log(error.config);
            })
        }else{
              axios({
                url:`${BASE_URL}/api/characters/${hideId}.json?character[name]=${characterName}&character[character_class_id]=${characterClass}&character[race]=${characterRace}&character[gender]=${characterGender}&character[primary_spec_id]=${characterSpec1}&character[secondary_spec_id]=${characterSpec2}`,
                method : "PUT",
            }).then((res)=>{
                clearForm(res);
            }).catch((error) => {
                ErrorHandler(error);
                setIsLoading(false)
                console.log(error.config);
            })
        }
        
    }

    const handleEdit = (item) => {
        console.log(item)
        setHideId(item["id"])
        setCharacterName(item.name)
        setCharacterClass(item["character_class_id"])
        const classSpecs = specs.filter(function(x){ return x["character_class_id"] == item["character_class_id"]})
        setClassSpecs(classSpecs)
        setCharacterSpec1(item["primary_spec_id"])
        setCharacterSpec2(item["secondary_spec_id"])
        setCharacterRace(item["race"])
        setCharacterGender(item["gender"])
        setVisible(true)
        
    }

    const handleVisibleModal = () => {
        clearForm();
        setVisible(!visible)
        setHideId(null)
    }

    const onChangeName = (value) => {
        setCharacterName(value)
    }

    return (

        <SafeAreaView style={{flex:1}}>
            <SafeAreaView>
                <Modal
                    animationType="slide"
                    isVisible={visible}
                    style={styles.modal}
                    hasBackdrop={true}
                    backdropColor="black"
                >
                        <View style={styles.form}>
                        <Block>
                        <Text h1>Add a Character</Text>
                        </Block>
                            <TextInput
                                value={characterName}
                                style={styles.text_input}
                                placeholder="Character Name"
                                onChangeText={onChangeName}
                            />
                            <DropDownPicker
                                zIndex={10}
                                placeholder="Choose Class"
                                onOpen
                                open={openClass}
                                value={characterClass}
                                items={classes}
                                setOpen={setOpenClass}
                                setValue={setCharacterClass}
                                onChangeValue={(value) => {
                                    console.log(characterClass);
                                    const classSpecs = specs.filter(function(x){ return x["character_class_id"] == characterClass})
                                    setClassSpecs(classSpecs);
                                    setSpecsDisabled(false);
                                  }}
                                />
                            <DropDownPicker
                                zIndex={9}
                                placeholder="Choose Primary Spec"
                                open={openSpec1}
                                value={characterSpec1}
                                items={classSpecs}
                                disabled={specsDisabled}
                                disabledStyle={{
                                    opacity: 0.5
                                  }}
                                setOpen={setOpenSpec1}
                                setValue={setCharacterSpec1}
                                onChangeValue={(value) => {
                                    console.log(value);
                                    
                                  }}
                                />
                            <DropDownPicker
                                zIndex={8}
                                placeholder="Choose Secondary Spec"
                                open={openSpec2}
                                value={characterSpec2}
                                items={classSpecs}
                                disabled={specsDisabled}
                                disabledStyle={{
                                    opacity: 0.5
                                  }}
                                setOpen={setOpenSpec2}
                                setValue={setCharacterSpec2}
                                onChangeValue={(value) => {
                                    console.log(value);
                                    
                                    }}
                            />
                            <DropDownPicker
                                zIndex={7}
                                placeholder="Choose Character Race"
                                open={openRace}
                                value={characterRace}
                                items={races}
                                setOpen={setOpenRace}
                                setValue={setCharacterRace}
                                onChangeValue={(value) => {
                                    console.log(value);
                                }}
                            />
                             <DropDownPicker
                                zIndex={6}
                                placeholder="Choose Character Gender"
                                open={openGender}
                                value={characterGender}
                                items={genders}
                                setOpen={setOpenGender}
                                setValue={setCharacterGender}
                                onChangeValue={(value) => {
                                    console.log(value);
                                }}
                            />
                            <Button
                                onPress={handleSave}
                                flex={1}
                                gradient={gradients.primary}
                                style={styles.btn_save}>
                                <Text white bold transform="uppercase">
                                    {hideId == null ? "Save" : "Update"}
                                </Text>
                            </Button>
                            <Button flex={1} gradient={gradients.secondary} marginHorizontal={sizes.s} onPress={handleVisibleModal}>
                                <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
                                    Close
                                </Text>
                            </Button>
                            {hideId == null ? null : 
                                <Button flex={1} style={styles.btn_save} gradient={gradients.danger} marginHorizontal={sizes.s} onPress={()=>confirmDelete(hideId)}>
                                    <Text white bold transform="uppercase">
                                        Delete
                                    </Text>
                                </Button>
                            }
                        </View>
                </Modal>
            </SafeAreaView>
            <ScrollView>
                {characterList.map((item,index)=>{
                    return(
                        <View style={styles.item_character} key={index}>
                            <ImageBackground src={`${BASE_URL}${item.class_icon}`}  style={{height: 80,width: 80,justifyContent:'center'}}/>
                            <View style={styles.iconContainer}>
                                <Image
                                src={`${BASE_URL}${item.avatar}`}
                                style={styles.characterIcon} />
                                {console.log(item.primary_spec_icon)}
                                <Image
                                src={`${BASE_URL}${item.primary_spec_icon}`}
                                style={styles.characterIcon} />
                                <Image
                                src={`${BASE_URL}${item.secondary_spec_icon}`}
                                style={styles.characterIcon} />
                            </View>
                            <Text h5 flex={1} style={styles.txt_name}>{item.name}</Text>
                            <View>
                                <Button
                                    style={styles.btnContainer}
                                    onPress={()=>handleEdit(item)}
                                >
                                    <Text style={styles.txt_edit}>Edit Character</Text>
                                </Button>
                                <Button
                                    style={styles.btnContainer}
                                    onPress={() =>
                                        navigation.navigate('RaidListScreen', {
                                        characterId: item.id,
                                        })
                                    }>
                                    <Text style={styles.txt_save}>Edit Wishlist</Text>
                                </Button>
                            </View>
                        </View>
                    )
                })}
            <View style={styles.footer_container}>
                <Button
                    onPress={handleVisibleModal}
                    gradient={gradients.secondary}
                    marginBottom={sizes.base}>
                    <Text white bold transform="uppercase">
                        New Character
                    </Text>
                </Button>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create(
    {
           
    form:{
        padding : 15,
        marginTop:10,
        marginBottom:50,
        color:"#ffffff"
    },

    modal:{
        backgroundColor : "#ffffff",
        marginBottom:20,
    },
    dropdownPicker: {
        zIndex: 10,
    },
    txtClose:{
        right:0,
        backgroundColor : "#eeeeee",
        fontSize:18,
        fontWeight : "bold",
        textAlign : "right",
    },
    btnClose:{
        width:50,
    },
    text_input:{
        padding :10,
        borderWidth :1,
        borderColor : "gray",
        borderRadius : 10,
        marginTop :10
    },
    footer_container : {
        padding : 10,
        backgroundColor : "#eeeeee",
        flexDirection:"center",
        justifyContent : "space-between",
    },
    txt_main : {
        fontSize : 22,
        fontWeight : "bold"
    },
    item_character : {
        padding :15,
        borderBottomWidth: 3,
        borderBottomColor : "darkgray",
        flexDirection : "row",
        justifyContent:"center",
        alignItems : "center",
        flexWrap : "wrap",
    },
    characterIcon : {
        width: 30 , 
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 30
    },
    iconContainer : {
        marginLeft : 3,
        flex: 1,
        flexWrap:'wrap', 
        justifyContent:'space-between',
        alignItems: 'flex-end',
    },
    txt_name : {
        fontSize : 26,
    },
    txt_item : {
        fontSize : 14,
        marginTop : 5
    },
    txt_enabled : {
        fontSize : 14,
        marginTop : 5,
        color:"green",
        fontWeight : "bold"
    },
    txt_disabled : {
        fontSize : 14,
        marginTop : 5,
        color:"green",
        fontWeight : "bold"
    },
    txt_del:{
        fontSize : 14,
        marginTop : 5,
        color:"red",
        fontWeight : "bold"
    },
    txt_edit:{
        fontSize : 14,
        marginTop : 5,
        color:"blue",
        fontWeight : "bold"
    },
    btnContainer : {
        borderWidth: 1,
        padding: 5,
        marginTop : 5,
        
    },
    btnNewContainer : {
        padding :10,
        backgroundColor : "#000",
    },
    btn_save : {
        margin:20,
        marginBottom:30,
        padding : 10,
    },
    textButton : {
        textAlign : "center",
        color : "#FFFFFF"
    },
    img_avatar : {
        height: 56,
        flexDirection : "row",
    }
    }
);

export default CharacterListScreen;