import React, {useContext, useEffect, useState} from "react"; 
import {StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Button, Text } from '../components';
import BlueButton from "../components/BlueButton";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';
import { useIsFocused } from '@react-navigation/native';



const RunScreen = ({route, navigation}) => {
  const runId = route.params.runId;
  const teamId = route.params.teamId;
  const [run, setRun] = useState([]);
  const {assets, colors, gradients, sizes} = useTheme();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  //item refers to a battle
  function CompletedBattle({ item }) {
        return (
          <View style={styles.listItem}>
    
            <View style={styles.buttonContainer}>

              <Text white h5>{item.boss.name}</Text>
              <BlueButton
                  text={"Show"}
                  onPress={() =>
                      navigation.navigate('BattleScreen', {
                        battleId: item.id,
                        runId: runId,
                        bossId: item.boss.id,
                        bossName: item.boss.name,
                      })

                  }
                />

            </View>
          </View>
        );
    }


    //item refers to a boss
    function RemainingBattle({ item }) {
      return (
        <View style={styles.listItem}>
  
          <View style={styles.buttonContainer}>
            <Text white h5>{item.name}</Text>
            <BlueButton
                text={"Battle"}
                onPress={() =>
                    navigation.navigate('BattleScreen', {
                      runId: runId,
                      bossId: item.id,
                      bossName: item.name,
                    })
      
                }
              />
          </View>
        </View>
      )
    }

    const getData = async () => {
      axios({
          url:`${BASE_URL}/api/teams/${teamId}/runs/${runId}`,
          method : "GET",
      }).then((res)=>{
          setRun(res.data);
          setIsLoading(false);
      }).catch((error) => {
          ErrorHandler(error)
      })
    }

    useEffect(() => {
      if (route.params.run) {
        setRun(route.params.run);
        setIsLoading(false);
      } else {
        getData();
      }
    }, [isFocused]);


    if (isLoading) {
      return (
        <View style={styles.container}> 
            <View style={styles.nameContainer}>
                <Text white h5 style={styles.runName}>Loading...</Text>
            </View>
        </View>
    );
    } else {
      return (
        
          <ScrollView style={styles.container}>
              <View style={styles.bossList}>
                <View style={styles.nameContainer}>
                  <Text styles={styles.header} h5 white>Completed Bosses</Text>
                </View>
                <FlatList
                    data={run.battles}
                    style={{flex:1}}
                    scrollEnabled={false}
                    renderItem={({ item }) => <CompletedBattle item={item}/>}
                    keyExtractor={item => item.id}
                />
              </View>
              <View style={styles.bossList}>
                <View style={styles.nameContainer}>
                  <Text styles={styles.header} h5 white>Remaining Bosses</Text>
                </View>
                <FlatList
                    data={run.remaining_bosses}
                    style={{flex:1}}
                    scrollEnabled={false}
                    renderItem={({ item }) => <RemainingBattle item={item}/>}
                    keyExtractor={item => item.id}
                />
              </View>
          </ScrollView>
      );
    }
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#02000b',
    },
    nameContainer: {
      alignItems:"center",
      borderRadius: 10,
      padding:10,
      margin:10,
      borderColor: borderColor,
      borderBottomWidth: 1,
    },
    header: {
      alignSelf:"center",
    },
    listItem:{
      margin:10,
      padding:10,
      width:"90%",
      flex:1,
      borderColor: borderColor,
      borderWidth: 2,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },    
    buttonContainer: {
      flex:1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
export default RunScreen;