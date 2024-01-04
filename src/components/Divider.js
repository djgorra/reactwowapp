import React from 'react';
import { View,  Text } from "react-native";

const Divider = () => {
return (
    <View style={styles.dividerContainer}>
        <View style={{ flexDirection: 'row', alignSelf:"center"}}>
            <View style={{width:50, borderBottomWidth:1, borderColor:"gray", height:2, transform: [{translateY: 12}] }}></View>
            <Text style={{fontFamily:"LifeCraft",  fontSize:50, color:"#506986", transform: [{translateY: -5}] }}> = </Text>
            <View style={{width:50, borderBottomWidth:1, borderColor:"gray", height:2, transform: [{translateY: 12}] }}></View>
        </View>
    </View>
)
}
const styles = {
    dividerContainer: {
        height: 50,
        marginTop: 20,
    },
};

export default Divider;