import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {Button} from '@rneui/themed';
import {obtemIcone} from "./src/global.js";
import ListaEmpresas from "./src/empresa/ListaEmpresas";
import FormularioEmpresa from "./src/empresa/FormularioEmpresa.js";

const Stack = createStackNavigator();

const estilo = {
    headerStyle: {
        backgroundColor: "blue"
    },
    headerTintColor: "white",
    headerTitleStyle: "bold"
};

export default function App() {

    function obtemNavegacao(title,navigation) {
        return {
            title: title,
            headerRight: () => <Button type="clear" onPress={() => navigation.navigate("FormularioEmpresa")} icon={obtemIcone("plus",25,"white")} />
        }
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListaEmpresas" screenOptions={estilo}>
                <Stack.Screen name="ListaEmpresas" component={ListaEmpresas} options={({navigation}) => obtemNavegacao("Empresas",navigation)} />
                <Stack.Screen name="FormularioEmpresa" component={FormularioEmpresa} options={{title: "Empresa"}} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
