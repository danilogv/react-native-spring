import React,{useState} from "react";
import {SafeAreaView,TextInput,TouchableOpacity,Text,Alert,StyleSheet} from "react-native";
import {Menu,Provider} from "react-native-paper";
import {Button} from "@rneui/themed";
import Espera from "../Espera.js";
import {urlUsuario,obtemMensagemErro,configPagina} from "../global.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const estadoInicial = {
    login: "",
    senha: ""
};

export default function Login(props) {
    const [usuario,setUsuario] = useState(estadoInicial);
    const [esperar,setEsperar] = useState(false);

    function validouAcesso() {
        if (!usuario || usuario.login === "") {
            Alert.alert("Usuário","Informe o nome.");
            return false;
        }
        if (!usuario || usuario.senha === "") {
            Alert.alert("Usuário","Informe a senha.");
            return false;
        }

        return true;
    }

    async function acessar() {
        try {
            setEsperar(true);

            if (validouAcesso()) {
                const opcoes = {method: "POST",body: JSON.stringify(usuario),headers: configPagina};
                const resposta = await fetch(urlUsuario + "/login",opcoes);
                let msg = await obtemMensagemErro(resposta);
                
                if (msg && msg !== "")
                    throw new Error(msg);

                const token = await resposta.text();
                await AsyncStorage.setItem("token",token);
                setUsuario(estadoInicial);
                props.navigation.navigate("ListaEmpresas");
            }
        }
        catch (erro) {
            Alert.alert("Usuário",JSON.parse(erro.message).mensagem);
        }
        finally {
            setEsperar(false);
        }
    }

    function cadastrar() {
        props.navigation.navigate("FormularioUsuario");
    }

    function criaMenu() {
        return (
            <SafeAreaView style={estilo.painelMenu}>
                <Button type="clear">
                    <Text style={estilo.textoMenu}>Login</Text>
                </Button>
            </SafeAreaView>
        );
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
            <SafeAreaView style={estilo.painel}>
                <TextInput placeholder="Login" style={estilo.texto} autoFocus={true} value={usuario.login} onChangeText={(loginNovo) => setUsuario({...usuario,login: loginNovo})} />
                <TextInput placeholder="Senha" style={estilo.texto} secureTextEntry={true} value={usuario.senha} onChangeText={(senhaNova) => setUsuario({...usuario,senha: senhaNova})} />
                <TouchableOpacity onPress={() => acessar()} style={estilo.botao}>
                    <Text style={estilo.textoBotao}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cadastrar()} style={estilo.botao}>
                    <Text style={estilo.textoBotao}>Criar nova conta</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Provider>
    );
}

const estilo = StyleSheet.create({
    painel: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    botao: {
        marginTop: 30,
        padding: 10,
        backgroundColor: "#4286f4"
    },
    textoBotao: {
        fontSize: 20,
        color: "#fff"
    },
    texto: {
        marginTop: 20,
        width: "90%",
        backgroundColor: "#eee",
        height: 40,
        borderWidth: 1,
        borderColor: "#333"
    },
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
    }
});
