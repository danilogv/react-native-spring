import React,{createContext,useContext} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ListaEmpresas from "./src/empresa/ListaEmpresas";
import FormularioEmpresa from "./src/empresa/FormularioEmpresa.js";
import ListaFuncionarios from "./src/funcionario/ListaFuncionarios";

const Stack = createStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListaEmpresas" screenOptions={{headerShown: false}}>
                <Stack.Screen name="ListaEmpresas" component={ListaEmpresas} />
                <Stack.Screen name="FormularioEmpresa" component={FormularioEmpresa} />
                <Stack.Screen name="ListaFuncionarios" component={ListaFuncionarios} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
