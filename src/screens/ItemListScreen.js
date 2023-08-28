import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import Accordion from "../components/Accordion";
import { SafeAreaView } from "react-native-safe-area-context";

function Item({ item }) {
    return (
      <View style={styles.listItem}>
        <Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} />
        <View style={{alignItems:"center",flex:1}}>
          <Text style={{fontWeight:"bold"}}>{item.name}</Text>
          <Text>{item.position}</Text>
        </View>
        <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
          <Text style={{color:"green"}}>Call</Text>
        </TouchableOpacity>
      </View>
    );
  }


const ItemListScreen = ({route, navigation}) => {
    const {bosses, characterList} = useContext(AuthContext);
    const raidId = route.params.raidId;
    const [items, setItems] = useState({});
    const [checkedItems, setCheckedItems] = useState([]);
    const getData = async () => {
      axios({
          url:`${BASE_URL}/api/raids/${raidId}/items.json`,
          method : "GET",
      }).then((res)=>{
          setItems(res.data);
      }).catch((error) => {
          ErrorHandler(error)
      })
    }

    useEffect(() => {
      getData();
    }, []);

    function getDatafromChild(item_id, checked){
      if(checked){
        if (checkedItems.indexOf(item_id) < 0){
          checkedItems.push(item_id);
        }
      } else {
        // TODO: Remove item_id from checkedItems
        var arrayindex = checkedItems.indexOf(item_id);
        if(arrayindex >= 0){
          checkedItems.splice(arrayindex, 1);
        }
      }
      console.log(checkedItems);
    }

    function addItems(){
        console.log("inside add items!")
        axios({
            url:`${BASE_URL}/api/characters/${route.params.characterId}/items.json`,
            method : "POST",
            data: {
                "items": checkedItems,
                "raid_id": route.params.raidId,
            }
        }).then((res)=>{
            navigation.navigate('CharacterListScreen');
        }).catch((error) => {
            ErrorHandler(error)
        })
    }
    
    return (
        <View style={{flex:1}}>
            <ScrollView nestedScrollEnabled={true}>
            {Object.keys(items).map((key,index)=>{
                const boss = bosses.filter((b)=>{ return b["id"]==key; } )[0];
                const character = characterList.filter((c)=>{ return c["id"]==route.params.characterId; } )[0];
                return(
                    <View>
                    {(boss != null) ? <Accordion character={character} sendData={getDatafromChild} title={boss["name"]} data ={items[key]}></Accordion> : <Accordion character={character} sendData={getDatafromChild} title={"Common Drops"} data = {items[key]}></Accordion> }
                </View>
            )
            })}
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity>
                    <Text onPress={()=>addItems()} style={styles.addBtn}>Add Items</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      marginTop:60
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
export default ItemListScreen;