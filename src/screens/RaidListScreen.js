import React, {useContext, useState} from "react"; 
import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity } from "react-native";
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from "../context/AuthContext";



const RaidListScreen = ({route, navigation}) => {
    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <Image source={{uri:item.photo}}  style={{width:60, height:30,borderRadius:30}} />
            <View style={{alignItems:"center",flex:1}}>
              <Text style={{fontWeight:"bold"}}>{item.name}</Text>
              <Text>{item.position}</Text>
            </View>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ItemListScreen', {
                    raidId: item.id,
                    characterId: route.params.characterId
                    })
                }>
                <Text style={styles.txt_edit}>Add Item</Text>
            </TouchableOpacity>
          </View>
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
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
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
export default RaidListScreen;