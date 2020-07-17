import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../pages/Dashboard'


const App = createStackNavigator()

const appRoutes: React.FC = () => {
  return(
    <App.Navigator
        screenOptions={{
            headerShown:false,
            cardStyle:{backgroundColor:"#312e38"}
        }}
    >
        <App.Screen name="Signin" component={Dashboard}/>
    </App.Navigator>
  );
}


export default appRoutes;