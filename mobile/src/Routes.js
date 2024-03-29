import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Main, Profile } from './screens';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main: {
        screen: Main,
        navigationOptions: {
          title: 'DevRadar',
        },
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          title: 'Perfil do Github',
        },
      },
    },
    {
      defaultNavigationOptions: {
        headerBackTitleVisible: false,
        headerTintColor: '#FFF',
        headerStyle: {
          backgroundColor: '#7D40E7',
        },
      },
    }
  )
);

export default Routes;
