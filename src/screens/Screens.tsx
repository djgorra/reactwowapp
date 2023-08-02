import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useScreenOptions, useTranslation} from '../hooks';
import HomeScreen from './HomeScreen';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

};