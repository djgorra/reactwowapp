import {StyleSheet, View, ImageBackground, Image, Text} from "react-native";
import {BASE_URL} from "../config";

const CharacterButton = ({item, size}) => {

    return (
        <View style={[styles.buttonContainer, {width: size}]}>
            <View style={styles.iconContainer}>
                <ImageBackground src={`${BASE_URL}${item.class_icon}`}  style={{height: size,width: size}}>
                    <Image
                    style={[styles.specIcon, {height: size/2, width: size/2}]}
                    src={`${BASE_URL}${item.primary_spec_icon}`}
                    />
                    <Image
                    style={[styles.specIcon, {height: size/2, width: size/2}]}
                    src={`${BASE_URL}${item.secondary_spec_icon}`}
                    />
                </ImageBackground>
            </View>
            <View style={styles.nameContainer}>
                <Text numberOfLines={1} style={[styles.txt_name, {fontSize: size/4}]}>{item.name}</Text>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({

    specIcon : {
        borderWidth: 1,
        borderColor: '#000',
    },
    iconContainer : {
      justifyContent: 'flex-start',
    },
    buttonContainer : {
        margin: 5,
    },
    textContainer : {
        width: '60%',
        alignContent : "flex-end",
    },
    txt_name : {
      width: "auto",
      textAlign: "center",
        color: "#fff",
    },
    nameContainer : {
        width: "100%"
    },
});

export default CharacterButton;