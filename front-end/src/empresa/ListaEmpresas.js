import React,{useReducer,useState,useEffect} from "react";
import {FlatList,Alert,TextInput,SafeAreaView,StyleSheet} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import {Menu,Provider} from "react-native-paper";
import {ListItem,Button} from "@rneui/themed";
import Espera from "../Espera.js";
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";
import {obtemIcone,urlEmpresa,configPagina,criaMenu,estilo,obtemMensagemErro,mascaraCnpj} from "../global.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaEmpresas(props) {
    const [empresas,setEmpresas] = useState([]);
    const [pesquisa,setPesquisa] = useState("");
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);
    const [esperar,setEsperar] = useState(false);
    const voltouFoco = useIsFocused();

    useEffect(() => {
        obtemEmpresas();
    },[]);

    useEffect(() => {
        obtemEmpresas();
    },[voltouFoco]);

    useEffect(() => {
        if (pesquisa !== "")
            filtrar();
        else
            obtemEmpresas();
    },[pesquisa]);

    async function obtemEmpresas() {
        try {
            setEsperar(true);
            const token = await AsyncStorage.getItem("token");

            if (token && token !== "") {
                const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
                const opcoes = {method: "GET",headers: cabecalho};
                const resposta = await fetch(urlEmpresa,opcoes);
                let msg = await obtemMensagemErro(resposta);

                if (msg && msg !== "")
                    throw new Error(msg);

                const dados = await resposta.json();
                setEmpresas(dados);
            }
        }
        catch(erro) {
            Alert.alert("Empresa",JSON.parse(erro.message).mensagem);
        }
        finally {
            setEsperar(false);
        }
    }

    async function filtrar() {
        try {
            setEsperar(true);
            const token = await AsyncStorage.getItem("token");

            if (token && token !== "") {
                const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
                const opcoes = {method: "GET",headers: cabecalho};
                const resposta = await fetch(urlEmpresa + "?nome=" + pesquisa,opcoes);
                
                let msg = await obtemMensagemErro(resposta,props.navigation);
                    
                if (msg && msg !== "")
                    throw new Error(msg);

                const dados = await resposta.json();
                setEmpresas(dados);
            }
        }
        catch (erro) {
            Alert.alert("Empresa",JSON.parse(erro.message).mensagem);
        }
        finally {
            setEsperar(false);
        }
    }

    function confirmaRemocao(empresa) {
        const botoes = [
            {
                text: "Sim",
                async onPress() {
                    try {
                        setEsperar(true);
                        const token = await AsyncStorage.getItem("token");

                        if (token && token !== "") {
                            const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
                            let opcoes =  {method: "DELETE",body: empresa,headers: cabecalho};
                            let resposta = await fetch(urlEmpresa + "/" + empresa.id,opcoes);
                            let msg = await obtemMensagemErro(resposta,props.navigation);
                    
                            if (msg && msg !== "")
                                throw new Error(msg);

                            await obtemEmpresas();
                            
                            msg = "Empresa excluída com sucesso.";
                            Alert.alert("Empresa",msg);
                        }
                    }
                    catch (erro) {
                        Alert.alert("Empresa",JSON.parse(erro.message).mensagem);
                    }
                    finally {
                        setEsperar(false);
                    }
                }
            },
            {
                text: "Não"
            }
        ];

        Alert.alert("Excluir Empresa","Deseja excluir a empresa?",botoes);
    }

    function obtemEmpresa({item: empresa}) {
        return (
            <ListItem bottomDivider={true} onPress={() => props.navigation.navigate("FormularioEmpresa")}>
                <ListItem.Content>
                    <ListItem.Title>Nome: {empresa.nome}</ListItem.Title>
                    <ListItem.Subtitle>CNPJ: {mascaraCnpj(empresa.cnpj)}</ListItem.Subtitle>
                </ListItem.Content>
                <Button type="clear" icon={obtemIcone("pencil",25,"skyblue")} onPress={() => props.navigation.navigate("FormularioEmpresa",empresa)} />
                <Button type="clear" icon={obtemIcone("trash",25,"skyblue")} onPress={() => confirmaRemocao(empresa)} />
            </ListItem>
        );
    }

    function alteraTela(nome) {
        if (props.route.name !== nome) {
            setPesquisa("");
            props.navigation.navigate(nome);
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
            <SafeAreaView style={estilo.painel}>
                <Menu visible={stateMenu.menuVisivel} onDismiss={() => menuInativo(dispatchMenu)} anchor={criaMenu(menuAtivo,dispatchMenu,props.navigation,"Empresa")}>
                    <Menu.Item onPress={() => alteraTela("ListaEmpresas")} title="Empresas" />
                    <Menu.Item onPress={() => alteraTela("ListaFuncionarios")} title="Funcionários" />
                </Menu>
            </SafeAreaView>
            <TextInput placeholder="Pesquisar por nome" onChangeText={(nome) => setPesquisa(nome)} onSelectionChange={() => filtrar()} value={pesquisa} style={estiloEmpresa.filtro} />
            <FlatList keyExtractor={empresa => empresa.id.toString()} data={empresas} renderItem={obtemEmpresa} />
            <Button title="Cadastrar" color="blue" onPress={() => props.navigation.navigate("FormularioEmpresa")} />
        </Provider>
    );

}

const estiloEmpresa = StyleSheet.create({
    filtro: {
        height: 50,
        borderColor: "gray",
        borderWidth: 1
    }
});
