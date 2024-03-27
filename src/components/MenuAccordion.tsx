import {Button, StyleSheet, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView, LayoutAnimation } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import {BASE_URL} from "../config";
import { Text } from "../components"
import CharacterButton from "../components/CharacterButton";
import { useNavigation } from '@react-navigation/native';


const MenuAccordion = ({item, handleEdit, handleInviteCode, confirmDelete}) => {
  const [ expanded, setExpanded ] = useState(false);
  const navigation = useNavigation();

  function toggleExpand(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded)
  }

  useEffect(() => {
  }, []);


  return (
    <View>
         <TouchableOpacity style={styles.row} onPress={()=>toggleExpand()}>
            <CharacterButton size={250} item={item}/>
            <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'white'} />
         </TouchableOpacity>
         <View style={styles.parentHr}/>
         {
             expanded &&
             <View style={styles.dropdown}>
                <TouchableOpacity
                    style={styles.dropdownButton} 
                    onPress={() =>
                        navigation.navigate('RaidListScreen', {
                        characterId: item.id,
                        })
                    }>
                    <Text white bold style={{textAlign:'center'}}>Edit Wishlist ({item.wishlist_items.length})</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownButton} onPress={()=>handleEdit(item)}>
                    <Text white bold style={{textAlign:'center'}}>Edit Character</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownButton} onPress={()=>handleInviteCode(item)}>
                    <Text white bold style={{textAlign:'center'}}>Enter Invite Code</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dropdownButton} onPress={()=>confirmDelete(item["id"])}>
                    <Text danger bold style={{textAlign:'center'}}>Delete Character</Text>
                </TouchableOpacity>
             </View>
         }
         
    </View>
 )

};


const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdownButton:{
    width:'100%',
    borderColor: '#34455e',
    borderTopWidth: 2,
    height:54,
    alignItems:'center',
    justifyContent:'center',
    paddingLeft:35,
    paddingRight:35,
    fontSize: 12,
  },
  title:{
      fontSize: 18,
      fontWeight:'bold',
      color: 'white',
  },
  itemActive:{
      fontSize: 14,
      color: 'green',
  },
  itemInActive:{
      fontSize: 14,
      color: 'white',
  },
  btnActive:{
      borderColor: 'green',
  },
  btnInActive:{
      borderColor: 'darkgray',
  },
  dropdown: {
    borderColor: '#34455e',
    borderWidth: 2,
    width: 250,
    marginLeft: 10,
    alignSelf: 'center',
  },
  row:{
      borderBottomWidth: 1,
      borderColor: '#000',
      flexDirection: 'row',
      justifyContent:'space-between',
      height:75,
      width:300,
      paddingLeft:25,
      paddingRight:25,
      margin: 10,
      alignItems:'center',
      backgroundColor: '#02000b',
  },
  childRow:{
      flexDirection: 'row',
      justifyContent:'space-between',
      backgroundColor: '#02000b',
      width:'100%',
  },
  parentHr:{
      height:1,
      color: 'white',
      width:'100%'
  },
  childHr:{
      height:1,
      backgroundColor: 'lightgray',
      width:'100%',
  },
  colorActive:{
      borderColor: 'green',
  },
  colorInActive:{
      borderColor: 'darkgray',
  }
  
});
export default MenuAccordion;