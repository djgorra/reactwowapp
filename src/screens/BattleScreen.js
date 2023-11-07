import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Input, Text } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';




const BattleScreen = ({route, navigation}) => {
    const battleId = route.params.battleId;
    const teamId = route.params.teamId;
    const runId = route.params.runId;
    const bossId = route.params.bossId;
    function Item({ item }) {
        return (
            <View style={styles.listItem}>
                <View style={styles.buttonContainer}>
                    <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${item.image_path}`}} />
                    <Text style={styles.itemInActive} >{item.name}</Text>
                    <Button
                          style={styles.button}
                          title={"Assign"}
                          onPress={() =>
                              navigation.navigate('DropScreen', {
                                    teamId: teamId,
                                    battleId: battleId,
                                    itemId: item.id,
                              })
                          }
                          marginVertical={sizes.s}
                          marginHorizontal={sizes.sm}
                          gradient={gradients.primary}>
                          <Text bold white transform="uppercase">
                              Assign
                          </Text>
                      </Button>
                </View>
            </View>
        );
      }
    // const {bosses, characterList, setUserInfo} = useContext(AuthContext);
    // const character = characterList.filter((c)=>{ return c["id"]==route.params.characterId; } )[0];

    // const [items, setItems] = useState({});
    // const [checkedItems, setCheckedItems] = useState(character["wishlist_items"].map((j)=>{ return j["id"]; } ));
    const [battle, setBattle] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();
    const getData = async () => {
        if (route.params.requestType == "show") {
            axios({
                url:`${BASE_URL}/api/battles/${route.params.battleId}`,
                method : "GET"
            }).then((res)=>{
            console.log(res.data)
                setBattle(res.data);
            }).catch((error) => {
                ErrorHandler(error)
            })
        } else if (route.params.requestType == "create") {
            axios.post(`${BASE_URL}/api/battles`, {
                params: {
                    "run_id": runId,
                    "boss_id": bossId,
                }
            }
            ).then((res)=>{
                console.log(res.data)
                setBattle(res.data);
            }).catch((error) => {
                ErrorHandler(error)
            })
        }
    }

    useEffect(() => {
      getData();
    }, []);

    // function addItems(){
    //     axios({
    //         url:`${BASE_URL}/api/characters/${route.params.characterId}/items.json`,
    //         method : "POST",
    //         data: {
    //             "item_ids": checkedItems,
    //             "raid_id": route.params.raidId,
    //         }
    //     }).then((res)=>{
    //         setUserInfo(res.data);
    //         navigation.navigate('Characters');
    //     }).catch((error) => {
    //         ErrorHandler(error)
    //     })
    // }
    if (battle) {

        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>{battle ? battle["boss"]["name"] : ""}</Text>
                </View>

                <FlatList
                    style={{flex:1}}
                    data={battle["boss"]["items"]}
                    renderItem={({ item }) => <Item item={item}/>}
                    keyExtractor={item => item.id}
                    />
            </View>
        );
    }
    else {
        return (
            <View style={{flex:1}}>
                <View style={styles.nameContainer}>
                    <Text h5 style={styles.runName}>Loading...</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      marginTop:60
    },
    runName: {
      alignSelf:"center",
    },
    listItem:{
      margin:10,
      padding:10,
      backgroundColor:"#FFF",
      width:"80%",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },    
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        height:50,
        zIndex: 100,
    },
    addBtn: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding:10,
    },
  });
export default BattleScreen;