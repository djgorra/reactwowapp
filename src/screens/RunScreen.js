import React, {useContext, useEffect, useState} from "react"; 
import {Button, StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { Input, Text } from '../components';
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

  function CompletedBattle({ item }) {
        return (
          <View style={styles.listItem}>
            <Text style={{textAlign:"center"}}>{item.boss.name}</Text>
    
            <View style={styles.buttonContainer}>
                    <Button
                        style={styles.button}
                        title={"Show"}
                        onPress={() =>

                            navigation.navigate('BattleScreen', {
                                battleId: item.id,
                                requestType: "show"
                            })

                        }
                        marginVertical={sizes.s}
                        marginHorizontal={sizes.sm}
                        gradient={gradients.primary}>
                        <Text bold white transform="uppercase">
                            Show
                        </Text>
                    </Button>
                </View>
          </View>
        );
    }

    function RemainingBattle({ item }) {
      return (
        <View style={styles.listItem}>
          <Text style={{textAlign:"center"}}>{item.name}</Text>
  
          <View style={styles.buttonContainer}>
            <Button
                style={styles.button}
                title={"Battle"}
                onPress={() =>
    
                    navigation.navigate('BattleScreen', {
                      runId: runId,
                      bossId: item.id,
                      requestType: "create"
                    })
      
                }
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}>
                <Text bold white transform="uppercase">
                    Battle
                </Text>
            </Button>
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
      getData();
    }, [isFocused]);


    if (isLoading) {
      return (
        <View style={{flex:1}}>
            <View style={styles.nameContainer}>
                <Text h5 style={styles.runName}>Loading...</Text>
            </View>
        </View>
    );
    } else {
      return (
        
          <ScrollView style={{flex:1}}>
              <View style={styles.nameContainer}>
                  <Text h5 style={styles.runName}>{route.params.raidName} - {route.params.timestamp}</Text>
              </View>
              <View style={styles.bossList}>
                <Text h6>Completed Bosses</Text>
                <FlatList
                    data={run.battles}
                    scrollEnabled={false}
                    renderItem={({ item }) => <CompletedBattle item={item}/>}
                    keyExtractor={item => item.id}
                />
              </View>
              <View style={styles.bossList}>
                <Text h6>Remaining Bosses</Text>
                <FlatList
                    data={run.remaining_bosses}
                    scrollEnabled={false}
                    renderItem={({ item }) => <RemainingBattle item={item}/>}
                    keyExtractor={item => item.id}
                />
              </View>
          </ScrollView>
      );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F7F7F7',
      marginTop:60
    },
    runName: {
      alignSelf:"center",
    },
    listItem:{
      margin:10,
      padding:10,
      backgroundColor:"#FFF",
      width:"80%",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },    
  });
export default RunScreen;