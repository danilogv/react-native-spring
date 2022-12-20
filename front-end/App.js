import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ListaEmpresas from "./src/empresa/ListaEmpresas";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListaEmpresas">
                <Stack.Screen name="ListaEmpresas" component={ListaEmpresas} options={{title: "Empresas"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
