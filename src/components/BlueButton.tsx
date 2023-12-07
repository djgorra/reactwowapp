import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, View,  Text } from "react-native";

const BlueButton = ({text, onPress, isDisabled=false}) => {

return (
    <View style={styles.imageContainerIOS} >
          <LinearGradient
            colors={[
              "#6c8dbc",
              "#2a3856",
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
                  color: "#dff0f8",
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
    alignSelf: 'center',
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: '#a8c8d3',
},


};

export default BlueButton;