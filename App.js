import React, {Component} from 'react';
import {NavigationContainer, PaperProvider} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, SafeAreaView, StyleSheet} from 'react-native';

import UploadMenu from './UploadMenu.js';
import Orders from './Orders.js';

import {DrawerContent} from './DrawerContent';

const Stack = createNativeStackNavigator();
const ScreenDrawer = createDrawerNavigator();

// const initialState = {counter: 0};

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <ScreenDrawer.Navigator
          drawerContent={props => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: true,
          }}>
          <ScreenDrawer.Screen
            options={{header: () => null}}
            name="Orders"
            component={Orders}
          />
          <ScreenDrawer.Screen
            options={{header: () => null}}
            name="UploadMenu"
            component={UploadMenu}
          />
        </ScreenDrawer.Navigator>
      </NavigationContainer>
    );
  }
}
const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.45,
    elevation: 5,
    shadowRadius: 3.5,
  },
});
