import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import alertBox from "../components/AlertBox.js"
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useRef } from "react";


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

    const raidId = route.params.raidId;
    const [items, setItems] = useState({"6":[]});
    const getData = async () => {
      axios({
          url:`${BASE_URL}/api/raids/${raidId}/items.json`,
          method : "GET",
      }).then((res)=>{
          setItems(res.data);
          console.log(items);
      }).catch((error) => {
          ErrorHandler(error)
      })
    }

    useEffect(() => {
      getData();
    }, []);
    
    // state = {
    //     data: items[6].map((item, index)=>{
    //         return({
    //                 "name": item.name,
    //                 "id": item.id,
    //                 "wow_id": item.wow_id,
    //                 "image_url": item.image_url,
    //                 "category": item.category,
    //                 "item_level": item.item_level,
    //                 "subcategory": item.subcategory,
    //                 "boss_id": item.boss_id,
    //                 "raid_id": item.raid_id,
    //                 }
    //             )})
    //   }
    
    return (
        <View style={styles.container}>
        {Object.keys(items).map((key,index)=>{
           return(
          <FlatList
              style={{flex:1}}
              data={ items[key] }
              renderItem={({ item }) => <Item item={item}/>}
              keyExtractor={item => item.id}
          />
           )
        })}
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
    }
  });
export default ItemListScreen;