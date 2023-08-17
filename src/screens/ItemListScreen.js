import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import alertBox from "../components/AlertBox.js"
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useRef } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import ItemDropDown from "../components/ItemDropDown";

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
    // const [chosenItems, setChosenItems] = useState([]);
    const {bosses} = useContext(AuthContext);
    const raidId = route.params.raidId;
    const [items, setItems] = useState({"6":[]});
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
    
    return (
        <ScrollView>
        {Object.keys(items).map((key,index)=>{
           const boss = bosses.filter((b)=>{ return b["id"]==key; } )[0];
           return(
            <View>
              {(boss != null) ? <Text>{boss["name"]}</Text> : <Text></Text> }
              <ItemDropDown items2={items[key]}></ItemDropDown>
            </View>
           )
        })}
        </ScrollView>
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