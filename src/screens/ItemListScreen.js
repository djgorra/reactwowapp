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
    const {bosses} = useContext(AuthContext);
    const raidId = route.params.raidId;
    const [items, setItems] = useState({});
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
        <View style={{flex:1}}>
            <ScrollView nestedScrollEnabled={true}>
            {Object.keys(items).map((key,index)=>{
                const boss = bosses.filter((b)=>{ return b["id"]==key; } )[0];
                return(
                    <View>
                    {(boss != null) ? <Accordion title={boss["name"]} data ={items[key]}></Accordion> : <Accordion title={"Common Drops"} data = {items[key]}></Accordion> }
                </View>
            )
            })}
            </ScrollView>
            <View style={{height:50}}>
                <TouchableOpacity>
                    <Text style={styles.txt_edit}>Add Items</Text>
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
    }
  });
export default ItemListScreen;