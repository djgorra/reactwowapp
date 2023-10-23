import React, {useContext, useState, useEffect} from "react"; 
import {Button, StyleSheet, View, FlatList,SafeAreaView } from "react-native";
import { Input, Text } from '../components';
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {BASE_URL} from "../config";
import {ErrorHandler} from "../components/ErrorHandler.js";
import { useTheme} from '../hooks/';

const TeamListScreen = ({route, navigation}) => {
    const {teams, setTeams, getTeams} = useContext(AuthContext);
    const [name, setName] = useState(null);
    const {assets, colors, gradients, sizes} = useTheme();

    function Item({ item }) {
        return (
          <View style={styles.listItem}>
            <View style={styles.nameContainer}>
                <Text h5 style={styles.itemName}>{item.name}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    style={styles.button}
                    title="Edit"
                    onPress={() =>
                        navigation.navigate('TeamCreateScreen', {
                            teamId: item.id,
                            teamName: item.name,
                        })
                    }
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}>
                    <Text bold white transform="uppercase">
                        Roster
                    </Text>
                </Button>
                <Button
                    style={styles.button}
                    title="Run"
                    onPress={() =>
                        navigation.navigate('RaidSelectScreen', {
                            teamId: item.id,
                        })
                    }
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}>
                    <Text bold white transform="uppercase">
                        Run
                    </Text>
                </Button>
            </View>
          </View>
        );
      }

    useEffect(() => {
        if(!teams){
          getTeams();
        }
    }, [teams]);

    const createTeam = (name) => {
        if(name){
            axios({
                url:`${BASE_URL}/api/teams?team[name]=${name}`,
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
            <Input
            value={name}
            autoCapitalize="none"
            marginBottom={sizes.m}
            label="Create Team"
            keyboardType="default"
            placeholder="Team Name"
            onChangeText={text => setName(text)}
            />
            <Button
                    title="Add"
                    onPress={() => {createTeam(name)}}
                    marginVertical={sizes.s}
                    marginHorizontal={sizes.sm}
                    gradient={gradients.primary}>
                    style={styles.button}
                    <Text bold white transform="uppercase">
                    Add
                    </Text>
            </Button>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F7F7F7',
        marginTop:60,
        marginLeft: 20,
        marginRight:20
    },
    listItem:{
        margin:10,
        padding:10,
        backgroundColor:"#FFF",
        width:"80%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5,
    },
    itemName:{
        alignSelf:"center",
    },
    nameContainer:{
        flex:4,
        alignContent:"center",
        flexDirection:"row",
    },
    button:{
        alignSelf:"right",
        marginLeft: 20,
    },
    buttonContainer:{
        flex:2,
        alignSelf:"",
    },
});

export default TeamListScreen;