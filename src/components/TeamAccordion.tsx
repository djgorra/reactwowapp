import {Button, StyleSheet, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView, LayoutAnimation } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import {BASE_URL} from "../config";
import { Text } from "../components"
import { useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";

const MenuAccordion = ({item, handleDelete}) => {
  const [ expanded, setExpanded ] = useState(false);
  const navigation = useNavigation();

  function toggleExpand(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded)
  }

    useEffect(() => {
    }, []);

    const confirmDelete = (teamId) =>
    Alert.alert(
        'Notice:',
        'Are you sure you want to delete this team?',
        [
        {
            text: 'Yes',
            onPress: () => handleDelete(teamId),
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


  return (
    <View>
         <TouchableOpacity style={styles.row} onPress={()=>toggleExpand()}>
            <View style={styles.buttonContainer}>
                <Text size={16} white font="OpenSans-Bold" style={styles.itemName}>{item.name}</Text>
            </View>
            

            <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'white'} />
         </TouchableOpacity>
         <View style={styles.parentHr}/>
         {
             expanded &&
             <View style={styles.dropdown}>
                <TouchableOpacity  style={styles.dropdownButton}
                    onPress={() =>
                        navigation.navigate('TeamCreateScreen', {
                            teamId: item.id,
                            teamName: item.name,
                        })
                    }>
                    <Text white bold style={{textAlign:'center'}}>Edit Team</Text>
                    <Icon name="edit" size={20} color={'white'} style={styles.dropdownIcon} />

                </TouchableOpacity>
                
                <TouchableOpacity  style={styles.dropdownButton}
                onPress={() =>
                    navigation.navigate('TeamRunsScreen', {
                        teamId: item.id,
                        teamName: item.name,
                    })
                }>
                    <Text white bold style={{textAlign:'center'}}>View Runs</Text>
                    <Icon name="directions-run" size={20} color={'white'} style={styles.dropdownIcon} />
                </TouchableOpacity>

                <TouchableOpacity  style={styles.dropdownButton} onPress={()=>Clipboard.setString(`${item.invite_code}`)}>
                    <Text white bold style={{textAlign:'center'}}>Invite Code: {item.invite_code}</Text>
                    <Icon name="content-copy" size={20} color={'white'} style={styles.dropdownIcon} />
                </TouchableOpacity>

                <TouchableOpacity  style={styles.dropdownButton} onPress={() =>confirmDelete(item.id)}>
                    <Text danger bold style={{textAlign:'center'}}>Delete Team</Text>
                    <Icon name="delete-forever" size={20} color={'red'} style={styles.dropdownIcon} />

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
    flexDirection: 'row',
    borderColor: '#34455e',
    borderTopWidth: 2,
    height:54,
    alignItems:'center',
    justifyContent:'center',

    fontSize: 12,
  },
    dropdownIcon:{
        position: 'absolute',
        right: 10,
    },
    dropdown: {
      borderColor: '#34455e',
      borderWidth: 2,
      width: '100%',
      alignSelf: 'center',
      justifyContent: 'center',
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