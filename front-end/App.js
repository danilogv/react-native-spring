import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ListaEmpresas from "./src/empresa/ListaEmpresas.js";
import FormularioEmpresa from "./src/empresa/FormularioEmpresa.js";
import ListaFuncionarios from "./src/funcionario/ListaFuncionarios.js";
import FormularioFuncionario from "./src/funcionario/FormularioFuncionario.js";
import Login from "./src/usuario/Login.js";
import FormularioUsuario from "./src/usuario/FormularioUsuario.js";

const Stack = createStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="FormularioUsuario" component={FormularioUsuario} />
                <Stack.Screen name="ListaEmpresas" component={ListaEmpresas} />
                <Stack.Screen name="FormularioEmpresa" component={FormularioEmpresa} />
                <Stack.Screen name="ListaFuncionarios" component={ListaFuncionarios} />
                <Stack.Screen name="FormularioFuncionario" component={FormularioFuncionario} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
