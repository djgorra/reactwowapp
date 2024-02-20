import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";




const RaidListScreen = ({route, navigation}) => {

    function handlePress(item){
      if(route.params.characterId){
        navigation.navigate("ItemListScreen", {
          raidId: item.id,
          characterId: route.params.characterId
        })
      } else if (route.params.teamId) {
        axios({
          url:`${BASE_URL}/api/teams/${route.params.teamId}/runs?raid_id=${item.id}`,
          method : "POST",
      }).then((res)=>{
          navigation.navigate("RunScreen", {
            run: res.data, //sets the run in the state of the RunScreen
            raidName: res.data["raid_name"],
            timestamp: res.data["timestamp"],
            runId : res.data["id"],
          })

      }).catch((error) => {
          ErrorHandler(error)
      })


      }
    }

    function Item({ item }) {
        return (
          <TouchableOpacity
            onPress={() =>handlePress(item) }>
            <View style={styles.listItem}>
              {/* <Image source={{uri:item.photo}}  style={{width:60, height:30,borderRadius:30}} /> */}
              <View style={{flex:4}}>
                <Text style={styles.listItemText}>{item.name}</Text>
                {/* <Text>{item.position}</Text> */}
              </View>
                  <Text style={styles.listItemCaret}> > </Text>
            </View>
          </TouchableOpacity>
        );
      }
    const {raids} = useContext(AuthContext);
    state = {
        data: raids.map((item, index)=>{
            return({
                    "name": item.name,
                    "id": item.id,
                    "wow_id": item.wow_id,
                    }
                )})
      }
    
    return (
        <View style={styles.container}>
        <FlatList
            style={{flex:1}}
            data={this.state.data}
            renderItem={({ item }) => <Item item={item}/>}
            keyExtractor={item => item.id}
        />
        </View>
    );
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#02000b',
    },
    listItem:{ 
      margin:10,
      padding:10,
      backgroundColor: '#02000b',
      borderColor: borderColor,
      borderWidth: 2,
      width:"80%",
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },
    listItemText:{
      fontFamily:"LifeCraft",
      fontSize:20,
      fontWeight:"bold",
      color:"#FFF",
      marginTop:5
    },
    listItemCaret:{
      flex:1,
      fontFamily:"LifeCraft",
      fontSize:30,
      fontWeight:"bold",
      color:"#FFF"
    }
  });
export default RaidListScreen;