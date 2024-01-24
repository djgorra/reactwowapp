import React, {useEffect, useState} from "react"; 
import {StyleSheet, View,  ScrollView, FlatList, Text } from "react-native";
import BlueButton from "../components/BlueButton";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useIsFocused } from '@react-navigation/native';
import Divider from '../components/Divider';



const RunScreen = ({route, navigation}) => {
  const runId = route.params.runId;
  const teamId = route.params.teamId;
  const [run, setRun] = useState([]);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

  //item refers to a battle
  function CompletedBattle({ item }) {
        return (
          <View style={styles.listItem}>
    
            <View style={styles.buttonContainer}>

              <Text style={styles.text}>{item.boss.name}</Text>
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
            <Text style={styles.text}>{item.name}</Text>
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
      if (route.params.run) { //if we are coming from creating a new run on RaidListScreen, set the run to the one we just created
        setRun(route.params.run);
        setIsLoading(false);
        return;

      } else {

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
    }

    useEffect(() => {
      // if (route.params.run) {
      //   setRun(route.params.run);
      //   setIsLoading(false);
      // } else {
        getData();
      // }
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
                {
                run.remaining_bosses.length > 0 ?
                  <FlatList
                    data={run.remaining_bosses}
                    style={{flex:1}}
                    scrollEnabled={false}
                    renderItem={({ item }) => <RemainingBattle item={item}/>}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={() => {
                      return (<Text style={{color:"white", alignSelf:"center"}}>Remaining Bosses</Text>)
                    }}
                    ListFooterComponent={() => {
                      return(<Divider/>)
                    }}
                  />
                : <View></View>
                }
                {
                  run.battles.length > 0 ? 
                  <FlatList
                    data={run.battles}
                    style={{flex:1}}
                    scrollEnabled={false}
                    renderItem={({ item }) => <CompletedBattle item={item}/>}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={() => {
                      return (<Text style={{color:"white", alignSelf:"center"}}>Completed Bosses</Text>)
                    }}
                  />
                : <View></View>
                }
              
          </ScrollView>
      );
    }
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
   header: {
    color: '#ffffff',
    fontSize: 14,

   },
    text: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'OpenSans-Bold',
    },
    container: {
      backgroundColor: '#02000b',
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