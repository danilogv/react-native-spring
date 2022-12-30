import React,{useState,useReducer,useEffect} from "react";
import {Text,SafeAreaView,TextInput,Button,Alert} from "react-native";
import {Menu,Provider} from 'react-native-paper';
import {criaMenu,estilo,mascaraCnpj,cnpjValido,configPagina,urlEmpresa,obtemMensagemErro} from "../global.js";
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";

let ehInsercao = true;

export default function FormularioEmpresa(props) {
    const {route,navigation} = props;
    const [empresa,setEmpresa] = useState(route.params ? route.params : {});
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);

    useEffect(() => {
        if (route.params)
            ehInsercao = false;
    },[]);

    function validou() {
        if (!empresa.nome || empresa.nome === "") {
            Alert.alert("Empresa","Informe o nome.");
            return false;
        }

        if (!empresa.cnpj || empresa.cnpj === "") {
            Alert.alert("Empresa","Informe o CNPJ.");
            return false;
        }

        if (empresa.cnpj && !cnpjValido(empresa.cnpj)) {
            Alert.alert("Empresa","CNPJ inválido.");
            return false;
        }

        return true;
    }

    async function alterar() {
        try {
            if (validou()) {
                let opcoes = undefined;

                if (ehInsercao)
                    opcoes = {method: "POST",body: JSON.stringify(empresa),headers: configPagina};
                else
                    opcoes = {method: "PUT",body: JSON.stringify(empresa),headers: configPagina};
                
                const resposta = await fetch(urlEmpresa,opcoes);
                const msg = await obtemMensagemErro(resposta);
                
                if (msg && msg !== "")
                    throw new Error(msg);

                msg = ehInsercao ? "Empresa cadastrada com sucesso." : "Empresa alterada com sucesso.";
                Alert.alert("Empresa",msg);
                navigation.goBack();
            }
        }
        catch (erro) {
            Alert.alert("Empresa","Erro de servidor : " + erro.message);
        }
    }

    function formataCnpj(cnpj) {
        cnpj = cnpj.replace(/[^0-9]/g,"");
        setEmpresa({...empresa,cnpj});
    }

    function alteraTela(nome) {
        if (props.route.name !== nome)
            navigation.navigate(nome);
    }

    return (
        <Provider>
            <SafeAreaView style={estilo.painel}>
                <Menu visible={stateMenu.menuVisivel} onDismiss={() => menuInativo(dispatchMenu)} anchor={criaMenu(menuAtivo,dispatchMenu,navigation,"Empresa")}>
                    <Menu.Item onPress={() => alteraTela("ListaEmpresas")} title="Empresas" />
                    <Menu.Item onPress={() => alteraTela("ListaFuncionarios")} title="Funcionários" />
                </Menu>
            </SafeAreaView>
            <SafeAreaView style={estilo.formulario}>
                <Text style={estilo.titulo}>Nome:</Text>
                <TextInput onChangeText={(nome) => setEmpresa({...empresa,nome})} placeholder="Informe o nome" value={empresa.nome} style={estilo.campo} />
                <Text style={estilo.titulo}>CNPJ:</Text>
                <TextInput onChangeText={(cnpj) => formataCnpj(cnpj)} placeholder="Informe o CNPJ" keyboardType="decimal-pad" value={empresa.cnpj ? mascaraCnpj(empresa.cnpj) : ""} style={estilo.campo} />
                <Button title="Salvar" onPress={() => alterar()} />
            </SafeAreaView>
        </Provider>
    );
}
