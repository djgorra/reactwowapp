import React, {useCallback, useEffect, useRef, useState, useContext} from 'react';
import {Alert, Animated, Linking, StyleSheet, Text, View} from 'react-native';
import { AuthContext } from "../context/AuthContext";
import { SvgXml } from 'react-native-svg';
import castle from '../assets/icons/093 - Castle';
import weaponBook from '../assets/icons/044 - Weapon Book';
import spartaHelmet from '../assets/icons/030 - Sparta Helmet';
import sword from '../assets/icons/005 - Sword';
import goldBars from '../assets/icons/056 - Gold Bars';
import vikingHelmet from '../assets/icons/027 - Viking Helmet';

import {
  useDrawerStatus,
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Screens from '../screens/Screens';
import {Block, Switch, Button, Image} from '.';
import {useData, useTheme, useTranslation} from '../hooks';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const {colors} = useTheme();
  const isDrawerOpen = useDrawerStatus() === 'open';
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
function DrawerContent(props){
  const {navigation} = props;
  const {t} = useTranslation();
  const {isDark, handleIsDark} = useData();
  const [active, setActive] = useState('Home');
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = "#dff0f8";
  const {logout} = useContext(AuthContext);

  const handleNavigation = useCallback(
    (to) => {
      setActive(to);
      navigation.navigate(to);
    },
    [navigation, setActive],
  );

  // const handleWebLink = useCallback((url) => Linking.openURL(url), []);

  // screen list for Drawer menu
  const screens = [
    {name: t('screens.home'), to: 'Home', icon: castle},
    {name: t('screens.friends'), to: 'FriendsListScreen', icon: vikingHelmet},
    {name: t('screens.characters'), to: 'Characters', icon: sword},
    {name: t('screens.teams'), to: 'TeamListScreen', icon: weaponBook}
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{paddingBottom: sizes.padding}}>
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginBottom={sizes.m} marginTop={sizes.m}>

          <Block >
            <Text style={{fontFamily:'LifeCraft', color:'#dff0f8', fontWeight:'bold', textAlign:'center', fontSize:30, letterSpacing:2}}>
              {t('app.name')}
            </Text>

          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              style={{flex:1}}
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <View style={{borderColor:"#c0c0c0", borderWidth: 1, padding:5, margin:5, flex:0, width:30, height:30}}>
                <SvgXml xml={screen.icon} width="18" height="18" color="#dff0f8"/>
              </View>
              <Text style={{color: labelColor, marginLeft: 5}}>
                {screen.name}
              </Text>
            </Button>
          );
        })}
        <Button
          row
          justify="flex-start"
          style={{flex:1}}
          marginBottom={sizes.s}
          key={`menu-screen-${t('screens.home')}-${3}`}
          onPress={() => logout()}>
          <View style={{borderColor:"#c0c0c0", borderWidth: 1, padding:5, margin:5, flex:0, width:30, height:30}}>
            <SvgXml xml={goldBars} width="18" height="18" color="#dff0f8" />
          </View>
          <Text style={{color: labelColor, marginLeft: 5}}>
            Log Out
          </Text>
        </Button>
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
/* See https://reactnavigation.org/docs/headers/ for styling header*/
export default () => {
  const {gradients} = useTheme();
  const {t} = useTranslation();
  return (
    <Block gradient={gradients.dark}>
      <Drawer.Navigator
        screenOptions={{drawerType:"slide",
        overlayColor:"transparent",
        sceneContainerStyle: {backgroundColor: 'transparent'},
        drawerStyle: {
          flex: 1,
          width: '60%',
          borderRightWidth: 0,
          backgroundColor: 'transparent',
        },
        headerTitleStyle: { fontFamily: 'LifeCraft' },
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTintColor: '#dff0f8',
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
        >
        <Drawer.Screen name={" "} component={ScreensStack} />
      </Drawer.Navigator>
    </Block>
  );
};
