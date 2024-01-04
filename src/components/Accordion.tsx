import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView, LayoutAnimation } from "react-native";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import {BASE_URL} from "../config";


const Accordion = ({sendData, title, data, character}) => {
  const [ expanded, setExpanded ] = useState(false);
  for(var i=0; i<data.length; i++){    
    data[i]["checked"] = character["wishlist_items"].filter((j)=>{ return j["id"]==data[i]["id"]; } ).length > 0
  }

  const [ items2, setItems2 ] = useState(data);

  function toggleExpand(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded)
  }

  function onClick(index){
    //i.e. make a copy of the item list
    const temp = items2.map(l => Object.assign({}, l));
    //i.e. mark the item checked or unchecked
    temp[index]["checked"] = !temp[index]["checked"]
    //i.e. set items2 to the new item list
    setItems2(temp);
    //i.e. call parent component with the item id and checked status.
    sendData( temp[index]["id"],  temp[index]["checked"]);
  }

  useEffect(() => {
    // action on update of items2
  }, [items2]);


  return (
    <View>
         <TouchableOpacity style={styles.row} onPress={()=>toggleExpand()}>
             <Text style={styles.title}>{title}</Text>
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
                             <Text 
                             adjustsFontSizeToFit={true}
                             numberOfLines={1}
                             style={styles.itemInActive}>
                                {item.name}
                            </Text>
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
      paddingLeft:25,
      paddingRight:18,
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
export default Accordion;