import React, {useContext, useEffect, useState} from "react"; 
import {StyleSheet, TextInput, View, Image, TouchableOpacity, ScrollView, SectionList, Text } from "react-native";
import { Button } from '../components';
import BlueButton from "../components/BlueButton";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config";
import ErrorHandler from "../components/ErrorHandler.js"
import { useTheme} from '../hooks/';
import { useIsFocused } from '@react-navigation/native';



const SummaryScreen = ({route, navigation}) => {
  const runId = route.params.runId;
  const teamId = route.params.teamId;
  const [summary, setSummary] = useState([]);
  const {assets, colors, gradients, sizes} = useTheme();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
      axios({
          url:`${BASE_URL}/api/teams/${teamId}/runs/${runId}/summary`,
          method : "GET",
      }).then((res)=>{
          setSummary(res.data);
          setIsLoading(false);
      }).catch((error) => {
          ErrorHandler(error)
      })
    }

    useEffect(() => {
        console.log(summary)
        if (summary.length == 0) {
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
              <SectionList
                sections={summary}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => (
                    <View style={styles.item}>
                        <View style={styles.itemIconContainer}>
                            <Image style={{width: 50, height: 50}} source={{uri: `${BASE_URL}${item["item"]["image_path"]}`}} />
                            {item["disenchanted"] ? <Image style={{width: 30, height: 30, marginLeft: 10,}} source={{uri: `${BASE_URL}/spells/inv_enchant_disenchant.jpg`}}/>  : <View style={{width: 30, height: 30, marginLeft: 10,}}/> }
                        </View>

                        <View style={styles.itemTextContainer}>
                            <Text style={styles.title}>{item["item"]["name"]}</Text>
                            <Text style={styles.name}>{item["character_name"]}</Text>
                        </View>
                    </View>
                )}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                />
          </ScrollView>
      );
    }
}

const borderColor = '#34455e';
const styles = StyleSheet.create({
    text: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'OpenSans-Bold',
    },
    container: {
      flex:1,
    backgroundColor: '#02000b',
    },
    nameContainer: {
      color: '#ffffff',
      alignItems:"center",
      borderRadius: 10,
      padding:10,
      margin:10,
      borderColor: borderColor,
      borderBottomWidth: 1,
    },
    header: {
      alignSelf:"center",
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'OpenSans-Bold',
    },
    title: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'OpenSans-Bold',
    },
    name: {
      color: '#8a8a8a',
      fontSize: 14,
    },
    item: {
      flexDirection:"row",
      backgroundColor: '#324461',
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    itemTextContainer: {
        flex:6,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        marginLeft:10,
    },
    itemIconContainer: {
        flex:2,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
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
export default SummaryScreen;