import React,{useState} from "react";
import {Text,SafeAreaView,TextInput,StyleSheet,Button,Alert} from "react-native";
import {mascaraCnpj} from "../global.js";

export default function FormularioEmpresa(props) {
    const {route,navigation} = props;
    const [empresa,setEmpresa] = useState(route.params ? route.params : {});

    function alterar(empresa) {
        Alert.alert("Empresa","Dados alterados com sucesso.");
        navigation.goBack();
    }

    function formataCnpj(cnpj) {
        cnpj = cnpj.replace(/[^0-9]/g,"");
        setEmpresa({...empresa,cnpj});
    }

    return (
        <SafeAreaView style={estilo.formulario}>
            <Text style={estilo.titulo}>Nome:</Text>
            <TextInput onChangeText={(nome) => setEmpresa({...empresa,nome})} placeholder="Informe o nome" value={empresa.nome} style={estilo.campo} />
            <Text style={estilo.titulo}>CNPJ:</Text>
            <TextInput onChangeText={(cnpj) => formataCnpj(cnpj)} placeholder="Informe o CNPJ" keyboardType="decimal-pad" value={empresa.cnpj ? mascaraCnpj(empresa.cnpj) : ""} style={estilo.campo} />
            <Button title="Salvar" onPress={() => alterar(empresa)} />
        </SafeAreaView>
    );
}

const estilo = StyleSheet.create({
    formulario: {
        padding: 15
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 18
    },
    campo: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10
    }
});
