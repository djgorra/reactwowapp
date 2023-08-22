import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView, LayoutAnimation } from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import {BASE_URL} from "../config";


const Accordion = ({key, sendData, title, data}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [ expanded, setExpanded ] = useState(false);
  const [ items2, setItems2 ] = useState(data);

  function toggleExpand(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded)
  }

  function onClick(index){
    //i.e. make a copy of the item list
    const temp = data.slice()
    //i.e. mark the item checked or unchecked
    temp[index]["checked"] = !temp[index]["checked"]
    //i.e. set items2 to the new item list
    setItems2(temp);
    //i.e. call parent component with the item id and checked status.
    sendData( temp[index]["id"],  temp[index]["checked"]);
  }

  return (
    <View>
         <TouchableOpacity style={styles.row} onPress={()=>toggleExpand()}>
             <Text style={[styles.title]}>{title}</Text>
             <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={'white'} />
         </TouchableOpacity>
         <View style={styles.parentHr}/>
         {
             expanded &&
             <View style={{}}>
                 <FlatList
                 data={items2}
                 numColumns={1}
                 scrollEnabled={false}
                 renderItem={({item, index}) => 
                     <View>
                         <TouchableOpacity style={[styles.childRow, styles.button, item.value ? styles.btnActive : styles.btnInActive]} onPress={()=>onClick(index)}>
                             <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${item.image_path}`}} />
                             <Text style={styles.itemInActive} >{item.name}</Text>
                             <Icon name={'check-circle'} size={24} color={ item["checked"] ? 'green' :  'lightgray' } />
                         </TouchableOpacity>
                         <View style={styles.childHr}/>
                     </View>
                 }/>
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
  button:{
      width:'100%',
      height:54,
      alignItems:'center',
      paddingLeft:35,
      paddingRight:35,
      fontSize: 12,
  },
  title:{
      fontSize: 14,
      fontWeight:'bold',
      color: 'black',
  },
  itemActive:{
      fontSize: 12,
      color: 'green',
  },
  itemInActive:{
      fontSize: 12,
      color: 'black',
  },
  btnActive:{
      borderColor: 'green',
  },
  btnInActive:{
      borderColor: 'darkgray',
  },
  row:{
      flexDirection: 'row',
      justifyContent:'space-between',
      height:56,
      paddingLeft:25,
      paddingRight:18,
      alignItems:'center',
      backgroundColor: 'lightgray',
  },
  childRow:{
      flexDirection: 'row',
      justifyContent:'space-between',
      backgroundColor: 'white',
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
export default Accordion;