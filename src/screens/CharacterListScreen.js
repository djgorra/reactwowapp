import React, {useContext, useState, useEffect} from "react"; 
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";
import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Text} from '../components/';
import { BASE_URL } from "../config";
import axios from 'axios';
import alertBox from "../components/AlertBox.js"
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import {
    SafeAreaView,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput
} from "react-native";
import { set } from "react-native-reanimated";




const CharacterListScreen = () => {
    const {userInfo, setIsLoading, logout, updateUser} = useContext(AuthContext);
    const {assets, colors, gradients, sizes} = useTheme();
    const [list,setList] = useState([]);
    const [visible,setVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState();

    const [characterName,setCharacterName] = useState("");
    // const [characterPrice,setCharacterPrice] = useState(0);
    // const [description,setDescription] = useState("");
    // const [status,setStatus] = useState(1);
    const [hideId,setHideId] = useState(null);

    useEffect(()=>{
        getList()
    },[])

    const getList= () => {
        setList(userInfo["characters"]);
    }

    const handleDelete = (item) =>{
        axios({
            url:`${BASE_URL}/api/characters/${item.id}`,
            method : "DELETE",
        }).then((res)=>{
            getList();
        })
    }

    const handleSave = (item) => {
        setIsLoading(true)
        if(hideId == null){
            axios({
                url:`${BASE_URL}/api/characters.json?character[name]=${characterName}&character[user_id]=${userInfo["user"]["id"]}`,
                method : "POST",
            }).then((res)=>{
                getList();
                setIsLoading(false)
                setCharacterName("")
                // setCharacterPrice(0)
                // setDescription("")
                // setStatus(1)
                setVisible(false)
            }).catch((error) => {
                // Error
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    alertBox(error.response.data.message)
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the 
                    // browser and an instance of
                    // http.ClientRequest in node.js
                    alertBox("Network Error")
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    alertBox("An error has occurred :(")
                    console.log('Error', error.message);
                }
                setIsLoading(false)
                console.log(error.config);
            })
        }else{
            var data = {
                "character_id" : hideId,
                "name": characterName,
                // "price": Number(characterPrice) || 0,
                // "description":description,
                // "status": Number(status) || 0,
              }
            axios({
                url:"https://nitc.cleverapps.io/api/characters/",
                method : "PUT",
                data : data,
                headers : {
                    "Content-Type" : "application/json"
                }
            }).then((res)=>{
                getList();
    
                setCharacterName("")
                // setCharacterPrice(0)
                // setDescription("")
                // setStatus(1)
                setVisible(false)
            })
        }
        
    }

    const handleEdit = (item) => {
        setVisible(true)
        setHideId(item.character_id)
        setCharacterName(item.name)
        // setCharacterPrice(item.price+"")
        // setDescription(item.description)
        // setStatus(item.status+"")
    }

    const handleVisibleModal = () => {
        setVisible(!visible)
        setHideId(null)
    }

    const onChangeName = (value) => {
        setCharacterName(value)
    }

    // const onChangePrice = (value) => {
    //     setCharacterPrice(value)
    // }

    // const onChangeDescription = (value) => {
    //     setDescription(value)
    // }

    // const onChangeStatus = (value) => {
    //     setStatus(value)
    // }


    //console.log(JSON.stringify(userInfo)); //tip: this is shown on every keypress
    return (

        <SafeAreaView>
            <View style={styles.header_container}>
                <Text style={styles.txt_main}>Character {list.length}{"\n"}</Text>
                <Button
                    onPress={handleVisibleModal}
                    gradient={gradients.secondary}
                    marginBottom={sizes.base}>
                    <Text white bold transform="uppercase">
                        New Character
                    </Text>
                </Button>
            </View>
            <SafeAreaView>
                <Modal
                    animationType="slide"
                    visible={visible}
                    style={styles.modal}
                    hasBackdrop={true}
                    backdropColor="black"
                >
                        <View style={styles.form}>
                            <Button onPress={handleVisibleModal} style={styles.btnClose}>
                                <Text style={styles.txtClose}>
                                    Close   
                                </Text>
                            </Button>
                            <TextInput
                                value={characterName}
                                style={styles.text_input}
                                placeholder="Character Name"
                                onChangeText={onChangeName}
                            />
                            <Text>Choose Class</Text>
                            <Picker selectedValue={selectedLanguage} onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)  }>
                                  <Picker.Item label="Java" value="java" /> 
                                  <Picker.Item label="JavaScript" value="js" />
                            </Picker>
                            {/* <TextInput
                                value={characterPrice}
                                style={styles.text_input}
                                placeholder="Character price"
                                onChangeText={onChangePrice}
                            />
                            <TextInput
                                value={description}
                                style={styles.text_input}
                                placeholder="Description"
                                onChangeText={onChangeDescriptoin}
                            />
                            <TextInput
                                value={status}
                                style={styles.text_input}
                                placeholder="Status"
                                onChangeText={onChangeStatus}
                            /> */}

                            <Button
                                onPress={handleSave}
                                flex={1}
                                gradient={gradients.secondary}
                                style={styles.btn_save}>
                                <Text white bold transform="uppercase">
                                    {hideId == null ? "Save" : "Update"}
                                </Text>
                            </Button>
                        </View>
                </Modal>
            </SafeAreaView>
            <ScrollView>
                {list.map((item,index)=>{
                    return(
                        <View style={styles.item_character} key={index}>
                            <View>
                                <Text style={styles.txt_name}>{index+1}. {item.name}</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={()=>handleDetete(item)}
                                >
                                    <Text style={styles.txt_del}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={()=>handleEdit(item)}
                                >
                                    <Text style={styles.txt_edit}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
        // <View style={styles.container}>
        //     <LoadingSpinner visible={isLoading} />
        //     <Text>Character Page</Text>

        //     <FlatList
        //         data={listItems}
        //         //data defined in constructor
        //         ItemSeparatorComponent={ItemSeparatorView}
        //         //Item Separator View
        //         renderItem={ItemView}
        //         keyExtractor={(item, index) => index.toString()}
        //     />
        //     <Button gradient={gradients.primary} marginBottom={sizes.base}>
        //         <Text white bold transform="uppercase">
        //             Primary
        //         </Text>
        //     </Button>
        // </View>
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
        color:"#ffffff",
        padding :10,
        borderWidth :1,
        borderColor : "gray",
        borderRadius : 10,
        marginTop :10
    },
    header_container : {
        padding : 15,
        backgroundColor : "#eeeeee",
        flexDirection:"row",
        justifyContent : "space-between"
    },
    txt_main : {
        fontSize : 22,
        fontWeight : "bold"
    },
    item_course : {
        padding :15,
        borderBottomWidth: 1,
        borderBottomColor : "#e2e2e2",
        flexDirection : "row",
        justifyContent:"space-between"
    },
    txt_name : {
        fontSize : 18,
        marginTop : 5,
        fontWeight : "bold"
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
        display : 'flex',
        padding :15,
        backgroundColor : "#000",
        marginTop : 20,
        
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
    }
);

export default CharacterListScreen;