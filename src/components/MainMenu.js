import React, {useContext} from "react"; 
import MainMenuItems from '../constants/MainMenuItems';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from "../screens/HomeScreen";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { AuthContext } from "../context/AuthContext";

function LogoutLink(props) {
  const {logout} = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => logout()} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
const MainMenu = () => {
  return (
    <Drawer.Navigator
    drawerType="front"
    initialRouteName="Home"
    screenOptions={{
        activeTintColor: '#e91e63',
        itemStyle: { marginVertical: 10 },
    }}
    drawerContent={props => <LogoutLink {...props} />}
    >
    {
        MainMenuItems.map(drawer=><Drawer.Screen
            key={drawer.name}
            name={drawer.name}
            options={{
            drawerIcon:({focused})=>
             drawer.iconType==='MaterialCommunityIcons' ?
        <MaterialCommunityIcons
                  name={drawer.iconName}
                  size={24}
                  color={focused ? "#e91e63" : "black"}
              />
            :
            drawer.iconType==='Feather' ?
        <Feather
                name={drawer.iconName}
                size={24}
                color={focused ? "#e91e63" : "black"}
              />
            :
        <FontAwesome5
                name={drawer.iconName}
                size={24}
                color={focused ? "#e91e63" : "black"}
              />}}
            component={
              drawer.name==='Home' ? HomeScreen 
                : drawer.name==='Profile' ? ProfileScreen
                    : drawer.name==='Settings' ? SettingsScreen
                        : SettingsScreen
            }
          />)
    }
    </Drawer.Navigator>
);
}
export default MainMenu;