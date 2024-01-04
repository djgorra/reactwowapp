import {StyleSheet, View, ImageBackground, Image, Text} from "react-native";
import {BASE_URL} from "../config";

const CharacterButton = ({item, size=150}) => {

    return (
        <View style={[styles.buttonContainer, {width: size}]}>
            <View style={styles.iconContainer}>
                <ImageBackground src={`${BASE_URL}${item.class_icon}`}  style={{height: size/3,width: size/3}}>
                    <Image
                    style={[styles.specIcon, {height: size/6, width: size/6}]}
                    src={`${BASE_URL}${item.primary_spec_icon}`}
                    />
                    <Image
                    style={[styles.specIcon, {height: size/6, width: size/6}]}
                    src={`${BASE_URL}${item.secondary_spec_icon}`}
                    />
                </ImageBackground>
            </View>
            <View style={styles.nameContainer}>
                <Text numberOfLines={1} style={[styles.txt_name, {fontSize: size/12}]}>{item.name}</Text>
            </View>
        </View>
    );

};
const borderColor = '#34455e';
const styles = StyleSheet.create({

    specIcon : {
        borderWidth: 1,
        borderColor: '#000',
    },
    iconContainer : {
      width: "30%"
    },
    buttonContainer : {
        margin: 5,
        flexDirection: 'row',
        borderColor: borderColor,
        borderWidth: 2,
        padding:5,
        borderRadius: 5,
        justifyContent: 'space-between',
        backgroundColor: '#000000',
    },
    txt_name : {
      width: "auto",
      textAlign: "center",
      color: "#fff",
    },
    nameContainer : {
        width: "60%",
        justifyContent: 'center'
    },
});

export default CharacterButton;