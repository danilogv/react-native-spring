import React,{useState} from "react";
import {Text,SafeAreaView,TextInput,Alert,StyleSheet} from "react-native";
import {Menu,Provider} from "react-native-paper";
import {Button} from '@rneui/themed';
import Espera from "../Espera.js";
import {urlUsuario,obtemMensagemErro,configPagina} from "../global.js";

const estadoInicial = {
    login: "",
    senha: ""
};

export default function FormularioUsuario(props) {
    const [usuario,setUsuario] = useState(estadoInicial);
    const [esperar,setEsperar] = useState(false);

    function criaMenu() {
        return (
            <SafeAreaView style={estilo.painelMenu}>
                <Button type="clear">
                    <Text style={estilo.textoMenu}>Cadastro</Text>
                </Button>
            </SafeAreaView>
        );
    }

    function validou() {
        if (!usuario.login || usuario.login === "") {
            Alert.alert("Usuário","Informe o login.");
            return false;
        }
        if (!usuario.senha || usuario.senha === "") {
            Alert.alert("Usuário","Informe a senha.");
            return false;
        }
        
        return true;
    }

    async function cadastrar() {
        try {
            setEsperar(true);

            if (validou()) {
                const opcoes = {method: "POST",body: JSON.stringify(usuario),headers: configPagina};
                const resposta = await fetch(urlUsuario,opcoes);
                let msg = await obtemMensagemErro(resposta);
                
                if (msg && msg !== "")
                    throw new Error(msg);

                msg = "Usuário cadastrado com sucesso.";
                Alert.alert("Usuário",msg);
            }
        }
        catch (erro) {
            Alert.alert("Usuário",JSON.parse(erro.message).mensagem);
        }
        finally {
            setEsperar(false);
            props.navigation.goBack();
        }
    }

    return (
        <Provider>
            {
                esperar
                ?
                    <Espera />
                :
                    undefined
            }
            <SafeAreaView style={estilo.menu}>
                <Menu visible={false} anchor={criaMenu()} />
            </SafeAreaView>    
            <SafeAreaView style={estilo.formulario}>
                <Text style={estilo.titulo}>Login:</Text>
                <TextInput onChangeText={(login) => setUsuario({...usuario,login})} placeholder="Informe o login" value={usuario.login} style={estilo.campo} />
                <Text style={estilo.titulo}>Senha:</Text>
                <TextInput onChangeText={(senha) => setUsuario({...usuario,senha})} placeholder="Informe a senha" secureTextEntry={true} value={usuario.senha} style={estilo.campo} />
                <Button title="Cadastrar" onPress={() => cadastrar()} />
            </SafeAreaView>
        </Provider>
    );
}

const estilo = StyleSheet.create({
    textoMenu: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 200
    },
    menu: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "blue",
        height: 50
    },
    painelMenu: {
        flexDirection: "row"
    },
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
