import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity, View,  Text } from "react-native";

const BlueButton = ({text, onPress, isDisabled=false, padding=10}) => {
  const styles = {
    btnContainer: {
      paddingTop: padding,
      paddingBottom: padding,
      paddingLeft: padding*2,
      paddingRight: padding*2,
  
    },
    disabled: {
      paddingTop: padding,
      paddingBottom: padding,
      paddingLeft: padding*2,
      paddingRight: padding*2,
    },
    imageContainerIOS: {
      alignSelf: 'center',
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 3,
      borderColor: '#a8c8d3',
  },
  
  
  };
  
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

export default BlueButton;