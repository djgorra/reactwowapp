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
import CharacterButton from "../components/CharacterButton";




const CharacterListScreen = ({navigation}) => {
    const {userInfo, setUserInfo, setIsLoading, logout, updateUser, classes, specs, races, genders, characterList, setCharacterList} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const [visible,setVisible] = useState(false); //modal popup

    const [dropdowns, setDropdowns] = useState({
        class: false,
        spec1: false,
        spec2: false,
        race: false,
        gender: false,
    });
    const [openClass, setOpenClass] = useState(false); //dropdown
    const [openSpec1, setOpenSpec1] = useState(false); //dropdown
    const [openSpec2, setOpenSpec2] = useState(false); //dropdown
    const [openRace, setOpenRace] = useState(false); //dropdown
    const [openGender, setOpenGender] = useState(false); //dropdown
    
    
    const [form, setForm] = useState({
        name: "",
        class: "",
        spec1: "",
        spec2: "",
        race: "",
        gender: "",
    });
    
    const [classSpecs,setClassSpecs] = useState([]);
    const [specsDisabled, setSpecsDisabled] = useState(true); //dropdown
    const [characterId,setCharacterId] = useState(null);

    useEffect(()=>{
        getList()
    })

    const getList= () => {
        setCharacterList(userInfo["characters"]);
    }

    const handleFormChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleDropdownChange = (e) => {
        setDropdowns({...dropdowns, [e.target.name]: !dropdowns[e.target.name]});
    };

    const confirmDelete = (characterId) =>
    Alert.alert(
        'Notice:',
        'Are you sure you want to delete this character?',
        [
        {
            text: 'Yes',
            onPress: () => handleDelete(characterId),
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

    const handleDelete = (id) =>{
        axios({
            url:`${BASE_URL}/api/characters/${id}.json`,
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
        setForm({
            name: "",
            class: "",
            spec1: "",
            spec2: "",
            race: "",
            gender: "",
        });
        
        setVisible(false);
        setSpecsDisabled(true);
    }

    const handleSave = (item) => {
        setIsLoading(true)
        if(characterId == null){
            axios({
                url:`${BASE_URL}/api/characters.json?character[name]=${form.name}&character[user_id]=${userInfo["user"]["id"]}&character[character_class_id]=${form.class}&character[race]=${form.race}&character[gender]=${form.gender}&character[primary_spec_id]=${form.spec1}&character[secondary_spec_id]=${form.spec2}`,
                method : "POST",
            }).then((res)=>{
                clearForm(res);
            }).catch((error) => {
                ErrorHandler(error);
                setIsLoading(false)
            })
        }else{
              axios({
                url:`${BASE_URL}/api/characters/${characterId}.json?character[name]=${form.name}&character[character_class_id]=${form.class}&character[race]=${form.race}&character[gender]=${form.gender}&character[primary_spec_id]=${form.spec1}&character[secondary_spec_id]=${form.spec2}`,
                method : "PUT",
            }).then((res)=>{
                clearForm(res);
            }).catch((error) => {
                ErrorHandler(error);
                setIsLoading(false)
            })
        }
        
    }

    const handleEdit = (item) => {
        setCharacterId(item["id"])
        console.log(item)
        const classSpecs = specs.filter(function(x){ return x["character_class_id"] == item["character_class_id"]})
        setClassSpecs(classSpecs)
        setSpecsDisabled(false)
        setVisible(true)
        setForm({
            name: item["name"],
            class: item["character_class_id"],
            spec1: item["primary_spec_id"],
            spec2: item["secondary_spec_id"],
            race: item["race"],
            gender: item["gender"],
        });
        
    }

    const handleVisibleModal = () => {
        clearForm();
        setVisible(!visible)
        setCharacterId(null)
    }

    handleRaidPress = (item, characterId) => {
        navigation.navigate('ItemListScreen', {
            raidId: item.id,
            characterId: characterId
        })

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
                                name="name"
                                value={form.name}
                                style={styles.text_input}
                                placeholder="Character Name"
                                onChangeText={handleFormChange}
                            />
                            <DropDownPicker
                                zIndex={10}
                                placeholder="Choose Class"
                                name="class"
                                onOpen
                                open={dropdowns.class}
                                value={form.class}
                                items={classes}
                                setOpen={handleDropdownChange}
                                setValue={handleFormChange}
                                onChangeValue={(value) => {
                                    const classSpecs = specs.filter(function(x){ return x["character_class_id"] == form.class})
                                    setClassSpecs(classSpecs);
                                    setSpecsDisabled(false);
                                  }}
                                />
                            <DropDownPicker
                                zIndex={9}
                                placeholder="Choose Primary Spec"
                                name="spec1"
                                open={dropdowns.spec1}
                                value={form.spec1}
                                items={classSpecs}
                                disabled={specsDisabled}
                                disabledStyle={{
                                    opacity: 0.5
                                  }}
                                setOpen={handleDropdownChange}
                                setValue={handleFormChange}
                                />
                            <DropDownPicker
                                zIndex={8}
                                placeholder="Choose Secondary Spec"
                                name="spec2"
                                open={dropdowns.spec2}
                                value={form.spec2}
                                items={classSpecs}
                                disabled={specsDisabled}
                                disabledStyle={{
                                    opacity: 0.5
                                  }}
                                setOpen={handleDropdownChange}
                                setValue={handleFormChange}
                            />
                            <DropDownPicker
                                zIndex={7}
                                placeholder="Choose Character Race"
                                name="race"
                                open={dropdowns.race}
                                value={form.race}
                                items={races}
                                setOpen={handleDropdownChange}
                                setValue={handleFormChange}
                            />
                             <DropDownPicker
                                zIndex={6}
                                placeholder="Choose Character Gender"
                                name="gender"
                                open={dropdowns.gender}
                                value={form.gender}
                                items={genders}
                                setOpen={handleDropdownChange}
                                setValue={handleFormChange}
                            />
                            <Button
                                onPress={handleSave}
                                flex={1}
                                gradient={gradients.primary}
                                style={styles.btn_save}>
                                <Text white bold transform="uppercase">
                                    {characterId == null ? "Save" : "Update"}
                                </Text>
                            </Button>
                            <Button flex={1} gradient={gradients.secondary} marginHorizontal={sizes.s} onPress={handleVisibleModal}>
                                <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
                                    Close
                                </Text>
                            </Button>
                            {characterId == null ? null : 
                                <Button flex={1} style={styles.btn_save} gradient={gradients.danger} marginHorizontal={sizes.s} onPress={()=>confirmDelete(characterId)}>
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
                            <CharacterButton item={item} size={80}/>
                            <View>
                                <Button
                                    style={styles.btnContainer}
                                    gradient={gradients.primary}
                                    onPress={()=>handleEdit(item)}
                                >
                                    <Text white bold style={styles.txt_edit}>Edit Character</Text>
                                </Button>
                                <Button
                                    style={styles.btnContainer}
                                    gradient={gradients.primary}
                                    onPress={() =>
                                        navigation.navigate('RaidListScreen', {
                                        characterId: item.id,
                                        labelForLink: "Add Item",
                                        })
                                    }>
                                    <Text white bold style={styles.txt_save}>Edit Wishlist</Text>
                                </Button>
                            </View>
                        </View>
                    )
                })}
            <View style={styles.footer_container}>
                <Button
                    onPress={handleVisibleModal}
                    gradient={gradients.primary}
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
        justifyContent:"space-between",
        alignItems : "center",

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
        margin:5,
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