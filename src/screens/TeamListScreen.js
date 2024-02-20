import React, {useContext, useState, useEffect} from "react"; 
import {Button, StyleSheet, View, FlatList,SafeAreaView, Image, TouchableOpacity } from "react-native";
import { Input, Text } from '../components';
import BlueButton from '../components/BlueButton';
import Divider from '../components/Divider';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';
import { SvgXml } from 'react-native-svg';
import spanner from '../assets/icons/spanner';

const TeamListScreen = ({route, navigation}) => {
    const {teams, setTeams, getTeams, version} = useContext(AuthContext);
    const [name, setName] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <TouchableOpacity  style={{alignSelf:"center", paddingRight: 10}}
                onPress={() =>
                    navigation.navigate('TeamCreateScreen', {
                        teamId: item.id,
                        teamName: item.name,
                    })
                }>
                <View>
                <SvgXml xml={spanner} width="18" height="18" color="#dff0f8"/>
                </View>
                
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <Text size={16} white font="OpenSans-Bold" style={styles.itemName}>{item.name}</Text>
                
            </View>
            <View style={styles.nameContainer}>
                <BlueButton
                    text="Runs"
                    padding={6}
                    onPress={() =>
                        navigation.navigate('TeamRunsScreen', {
                            teamId: item.id,
                            teamName: item.name,
                        })
                    }
                />
                
            </View>

          </View>
        );
      }

    useEffect(() => {
        //if(!teams){
            getTeams();
        //}
        console.log('hello!')
    }, []);

    const createTeam = (name) => {
        if(name){
            axios({
                url:`${BASE_URL}/api/teams?team[name]=${name}&team[version_id]=${version}`,
                method : "POST",
            }).then((res)=>{
                setName(null);
                setTeams(res.data)
            }).catch((error) => {
                ErrorHandler(error)
            })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.redDot} source={require('../assets/images/icecrown/red_dot.png')} />
            <Input
            value={name}
            style={styles.textInput}
            autoCapitalize="none"
            marginBottom={sizes.m}
            keyboardType="default"
            placeholder="Team Name"
            textAlign="center"
            onChangeText={text => setName(text)}
            />
            <BlueButton
                text="Create Team"
                onPress={() => {createTeam(name)}}/>
            <Divider/>
            <FlatList
                style={{flex:1}}
                data={teams}
                renderItem={({ item }) => <Item item={item}/>}
                keyExtractor={item => item.id}
                extraData={teams}
            />
        </SafeAreaView>
    )
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02000b',
    },
    listItem:{
        margin:10,
        padding:10,
        borderWidth: 2,
        borderColor: borderColor,
        width:"90%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5,
    },
    itemName:{
        alignSelf:"center",
        textAlign:"center",
    },
    nameContainer:{
        flex:2,
        alignContent:"center",
        flexDirection:"row",
    },
    buttonContainer:{
        flex:4,
        alignSelf:"center",
    },
    redDot: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        left:10,
        top:15,
    },
    textInput:{
        borderWidth :1,
        borderColor : borderColor,
        borderRadius : 10,
        marginBottom :10
    },
});

export default TeamListScreen;