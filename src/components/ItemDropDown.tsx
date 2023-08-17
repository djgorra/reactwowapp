import {Button, StyleSheet, Text, TextInput, View, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
const ItemDropDown = ({items2}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  return(
   <View>
     <DropDownPicker
      open={open}
      value={value}
      items={items2}
      setOpen={setOpen}
      setValue={setValue}
      multiple={true}
    />
   </View>
  )

};
export default ItemDropDown;