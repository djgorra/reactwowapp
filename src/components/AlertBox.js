import {Alert} from 'react-native';
const alertBox = (e) =>
  Alert.alert('Alert', `${e}`, [
    {text: 'OK'},
]);
export default alertBox;