import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ListaEmpresas from "./src/empresa/ListaEmpresas";

const Stack = createStackNavigator();

const estilo = {
    headerStyle: {
        backgroundColor: "blue"
    },
    headerTintColor: "white",
    headerTitleStyle: "bold"
};

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListaEmpresas" screenOptions={estilo}>
                <Stack.Screen name="ListaEmpresas" component={ListaEmpresas} options={{title: "Empresas"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
