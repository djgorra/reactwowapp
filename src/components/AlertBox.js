import {Alert} from 'react-native';
const alertBox = (e) =>
  Alert.alert('Alert', `${e}`, [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
]);
export default alertBox;