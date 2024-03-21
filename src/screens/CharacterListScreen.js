import React, {useContext, useState, useEffect} from "react"; 
import { AuthContext } from "../context/AuthContext";
import {useTheme} from '../hooks/';
import {Button, Text, Block, Input} from '../components/';
import BlueButton from '../components/BlueButton';
import SubmitButton from '../components/SubmitButton';
import Divider from '../components/Divider';
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
    Image,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Keyboard,
} from "react-native";
import CharacterButton from "../components/CharacterButton";
import MenuAccordion from "../components/MenuAccordion";




const CharacterListScreen = ({navigation}) => {

    const {userInfo, setUserInfo, setIsLoading, logout, updateUser, classes, specs, races, genders, characterList, setCharacterList, version} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const [visible,setVisible] = useState(false); //modal popup

    // const [dropdowns, setDropdowns] = useState({
    //     class: false,
    //     spec1: false,
    //     spec2: false,
    //     race: false,
    //     gender: false,
    // });
    const [openClass, setOpenClass] = useState(false); //dropdown
    const [openSpec1, setOpenSpec1] = useState(false); //dropdown
    const [openSpec2, setOpenSpec2] = useState(false); //dropdown
    const [openRace, setOpenRace] = useState(false); //dropdown
    const [openGender, setOpenGender] = useState(false); //dropdown
    
    
    const [form, setForm] = useState({
        name: "",
        team_code: "",
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
    }, [])

    const getList= () => {
        versionCharacters = userInfo["characters"].filter((c)=>{ return c["version_id"]==version; } )
        setCharacterList(versionCharacters);
    }

    const handleClassChange = (e) => {
       setForm({...form, ["class"]: e()});
    }

    const handleSpec1Change = (e) => {
       setForm({...form, ["spec1"]: e()});
    }
    const handleSpec2Change = (e) => {
        setForm({...form, ["spec2"]: e()});
     }
     const handleRaceChange = (e) => {
        setForm({...form, ["race"]: e()});
     }
     const handleGenderChange = (e) => {
        setForm({...form, ["gender"]: e()});
     }
     const handleNameChange = (e) => {
        setForm({...form, ["name"]: e});
    };
    const handleTeamCodeChange = (e) => {
        setForm({...form, ["team_code"]: e});
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
            team_code: "",
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
        if(characterId == null){ //new character
            axios({
                url:`${BASE_URL}/api/characters.json?team_code=${form.team_code}&character[name]=${form.name}&character[user_id]=${userInfo["user"]["id"]}&character[character_class_id]=${form.class}&character[race]=${form.race}&character[gender]=${form.gender}&character[primary_spec_id]=${form.spec1}&character[secondary_spec_id]=${form.spec2}&character[version_id]=${version}`,
                method : "POST",
            }).then((res)=>{
                clearForm(res);
            }).catch((error) => {
                ErrorHandler(error);
                setIsLoading(false)
            })
        }else{ //edit character
              axios({
                url:`${BASE_URL}/api/characters/${characterId}.json?team_code=${form.team_code}&character[name]=${form.name}&character[character_class_id]=${form.class}&character[race]=${form.race}&character[gender]=${form.gender}&character[primary_spec_id]=${form.spec1}&character[secondary_spec_id]=${form.spec2}`,
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
        const classSpecs = specs.filter(function(x){ return x["character_class_id"] == item["character_class_id"]})
        setClassSpecs(classSpecs)
        setSpecsDisabled(false)
        setVisible(true)
        setForm({
            name: item["name"],
            team_code: item["team_code"],
            class: item["character_class_id"],
            spec1: item["primary_spec_id"],
            spec2: item["secondary_spec_id"],
            race: item["race"],
            gender: item["gender"],
        });
        
    }

    const handleInviteCode = (item) => {
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                
                <Modal
                    animationType="slide"
                    isVisible={visible}
                    style={styles.modal}
                >
                        <View style={styles.form}>
                            <Block>
                                <Text h1>Add a Character</Text>
                            </Block>
                            <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
                            <Input
                                value={form.name}
                                style={styles.textInput}
                                placeholder="Character Name"
                                onChangeText={handleNameChange}
                                textAlign="center"
                            />
                            <Input
                                value={form.team_code}
                                style={styles.textInput}
                                placeholder="Invite Code"
                                onChangeText={handleTeamCodeChange}
                                textAlign="center"
                            />

                            <DropDownPicker
                                zIndex={10}
                                placeholder="Choose Class"
                                name="class"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                arrowIconStyle={{tintColor: '#ffffff'}}
                                open={openClass}
                                value={form.class}
                                items={classes}
                                setOpen={setOpenClass}
                                setValue={handleClassChange}
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
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                arrowIconStyle={{tintColor: '#ffffff'}}
                                open={openSpec1}
                                value={form.spec1}
                                items={classSpecs}
                                disabled={specsDisabled}
                                disabledStyle={{
                                    opacity: 0.5
                                  }}
                                setOpen={setOpenSpec1}
                                setValue={handleSpec1Change}
                                />
                            <DropDownPicker
                                zIndex={8}
                                placeholder="Choose Secondary Spec"
                                name="spec2"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                arrowIconStyle={{tintColor: '#ffffff'}}
                                open={openSpec2}
                                value={form.spec2}
                                items={classSpecs}
                                disabled={specsDisabled}
                                disabledStyle={{
                                    opacity: 0.5
                                  }}
                                setOpen={setOpenSpec2}
                                setValue={handleSpec2Change}
                            />
                            <DropDownPicker
                                zIndex={7}
                                placeholder="Choose Character Race"
                                name="race"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                arrowIconStyle={{tintColor: '#ffffff'}}
                                open={openRace}
                                value={form.race}
                                items={races}
                                setOpen={setOpenRace}
                                setValue={handleRaceChange}
                            />
                             <DropDownPicker
                                zIndex={6}
                                placeholder="Choose Character Gender"
                                name="gender"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                arrowIconStyle={{tintColor: '#ffffff'}}
                                open={openGender}
                                value={form.gender}
                                items={genders}
                                setOpen={setOpenGender}
                                setValue={handleGenderChange}
                            />
                            <SubmitButton
                                onPress={handleSave}
                                flex={1}    
                                text={characterId == null ? "Save" : "Update"}
                                style={styles.btn_save}/>
                            <BlueButton flex={1} text="Close" onPress={handleVisibleModal}/>
                            {characterId == null ? null : 
                                <TouchableOpacity style={styles.button} onPress={()=>confirmDelete(characterId)}>
                                    <Text darkblue bold style={{textAlign:'center', margin:20}}>Delete Character</Text>
                                </TouchableOpacity>
                         
                            }
                        </View>
                </Modal>
            </KeyboardAvoidingView>
            <View style={styles.footer_container}>
                <BlueButton
                    onPress={handleVisibleModal}
                    text="New Character">
                </BlueButton>
                <Divider/>
            </View>
            <ScrollView>
                {characterList.map((item,index)=>{
                    return(
                        <View style={styles.item_character} key={index}>
                            <MenuAccordion style={styles.buttonContainer} item={item} handleEdit={handleEdit} handleInviteCode={handleInviteCode}/>
                        </View>     
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    );
};

const borderColor = '#34455e';
const styles = StyleSheet.create(
    {   
        container: {
            flex: 1,
            backgroundColor: '#02000b',
        },
        form:{
            padding : 15,
            marginTop:10,
            marginBottom:50,
            color:"#ffffff"
        },

        modal:{
            backgroundColor : "#02000b",
            margin:0,
            flex:1,
        },
        textInput:{
            borderWidth :1,
            borderColor : borderColor,
            borderRadius : 10,
            marginBottom :10
        },
        dropdown:{
            marginBottom :10,
            backgroundColor : "#324461",
            borderRadius : 20,
            borderWidth : 2,
            borderColor : "#ffffff",
        },
        dropdownText:{
            fontWeight:"bold",
        },
        item_character : {
            margin: 5,
            flexDirection : "row",
            alignSelf: "center",

        },
        iconContainer : {
            alignItems: 'center',
            flex: 2,
        },
        buttonContainer : {
            
        },
        buttonDivider: {
            width: '100%',
            height: 2,
        },
        button: {
            alignSelf: 'stretch',
        },
        dividerContainer: {
            height: 50,
            marginTop: 20,
        },
        divider: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        redDot: {
            width: 20,
            height: 20,
            resizeMode: 'contain',
            position: 'absolute',
            left:25,
            top:30,
        },
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
        },
        input: {
            width: '100%',
            textAlign: 'center',
            paddingTop: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 0,
            color: '#424242',
            borderRadius: 0,
        },
        
    }
    );
export default CharacterListScreen;