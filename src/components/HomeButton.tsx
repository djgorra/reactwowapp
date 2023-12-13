import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, View,  Text, ImageBackground } from "react-native";

const HomeButton = ({text, onPress, isDisabled=false}) => {

return (
    <View style={styles.imageContainerIOS} >
        <ImageBackground source={require('../assets/images/icecrown/home_button.png')} style={styles.btnImg}>
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
                    color: "#dff0f8",
                    textAlign: "center",
                    fontSize: 14,
                    fontFamily: "OpenSans-Bold",
                    }}
                >
                    {text}
                </Text>
            </TouchableOpacity>
                </ImageBackground>
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
    btnImg: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor:'white'

    },
    disabled: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    imageContainerIOS: {
        alignSelf: 'center',
        borderRadius: 60,
        overflow: "hidden",
    },


};

export default HomeButton;