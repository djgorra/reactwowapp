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
        if (summary.length == 0) {
            getData();
        }
    }, [isFocused]);

    const DATA = [
        {
          title: 'Main dishes',
          data: ['Pizza', 'Burger', 'Risotto'],
        },
        {
          title: 'Sides',
          data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
        },
        {
          title: 'Drinks',
          data: ['Water', 'Coke', 'Beer'],
        },
        {
          title: 'Desserts',
          data: ['Cheese Cake', 'Ice Cream'],
        },
      ];

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
                    <Text style={styles.title}>{item["item"]["name"]}</Text>
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