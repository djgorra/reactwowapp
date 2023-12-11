import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, View,  Text } from "react-native";
import {useTheme} from '../hooks/';


const SubmitButton = ({text, onPress, isDisabled=false}) => {
    const {colors, sizes} = useTheme();


    return (
        <View style={styles.imageContainerIOS} >
            <LinearGradient
                colors={[
                "#a7b5d2",
                "#616c7d",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <TouchableOpacity
                disabled={isDisabled}
                style={
                    isDisabled
                    ? styles.disabled
                    : styles.btnContainer
                }
                onPress={onPress}
                >
                <Text
                    style={{
                    color: "#364a5f",
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: "OpenSans-Bold",
                    }}
                >
                    {text}
                </Text>
                </TouchableOpacity>
            </LinearGradient>
            </View>
    )

}

const styles = {
  btnContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,

  },
  disabled: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageContainerIOS: {
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: '#364a5f',
},


};

export default SubmitButton;