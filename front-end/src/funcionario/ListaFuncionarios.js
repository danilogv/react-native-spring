import React,{useReducer,useState,useEffect} from "react";
import {FlatList,Alert,TextInput,SafeAreaView,StyleSheet} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import {Menu,Provider} from 'react-native-paper';
import {ListItem,Button} from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";
import {obtemIcone,configPagina,criaMenu,estilo,urlFuncionario,obtemMensagemErro} from "../global.js";

export default function ListaFuncionarios(props) {
    const [funcionarios,setFuncionarios] = useState([]);
    const [pesquisa,setPesquisa] = useState("");
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);
    const voltouFoco = useIsFocused();

    useEffect(() => {
        obtemFuncionarios();
    },[]);

    useEffect(() => {
        obtemFuncionarios();
    },[voltouFoco]);

    useEffect(() => {
        if (pesquisa !== "")
            filtrar();
        else
            obtemFuncionarios();
    },[pesquisa]);

    async function filtrar() {
        try {
            const token = await AsyncStorage.getItem("token");
            const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
            const opcoes = {method: "GET",headers: cabecalho};
            const resposta = await fetch(urlFuncionario + "?nome=" + pesquisa,opcoes);
            
            let msg = await obtemMensagemErro(resposta);
                
            if (msg && msg !== "")
                throw new Error(msg);

            const dados = await resposta.json();
            setFuncionarios(dados);
        }
        catch (erro) {
            Alert.alert("Funcionário",JSON.parse(erro.message).mensagem);
        }
    }

    async function obtemFuncionarios() {
        try {
            const token = await AsyncStorage.getItem("token");
            const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
            const opcoes = {method: "GET",headers: cabecalho};
            const resposta = await fetch(urlFuncionario,opcoes);
            let msg = await obtemMensagemErro(resposta);

            if (msg && msg !== "")
                throw new Error(msg);

            const dados = await resposta.json();
            setFuncionarios(dados);
        }
        catch(erro) {
            Alert.alert("Funcionário",JSON.parse(erro.message).mensagem);
        }
    }

    function confirmaRemocao(funcionario) {
        const botoes = [
            {
                text: "Sim",
                async onPress() {
                    try {
                        const token = await AsyncStorage.getItem("token");
                        const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
                        let opcoes =  {method: "DELETE",body: funcionario,headers: cabecalho};
                        let resposta = await fetch(urlFuncionario + "/" + funcionario.id,opcoes);
                        let msg = await obtemMensagemErro(resposta);
                
                        if (msg && msg !== "")
                            throw new Error(msg);

                        await obtemFuncionarios();
                        
                        msg = "Funcionário excluído com sucesso.";
                        Alert.alert("Funcionário",msg);
                    }
                    catch (erro) {
                        Alert.alert("Funcionário",JSON.parse(erro.message).mensagem);
                    }
                }
            },
            {
                text: "Não"
            }
        ];

        Alert.alert("Excluir Funcionário","Deseja excluir o funcionário?",botoes);
    }

    function obtemFuncionario({item: funcionario}) {
        let funcionarioAux = {...funcionario};
        funcionarioAux.idade = funcionarioAux.idade.toString();
        funcionarioAux.salario = funcionarioAux.salario.toLocaleString("pt-BR",{style: "decimal",currency: "BRL",minimumFractionDigits: 2});

        return (
            <ListItem bottomDivider={true} onPress={() => props.navigation.navigate("FormularioFuncionario")}>
                <ListItem.Content>
                    <ListItem.Title>Nome: {funcionario.nome}</ListItem.Title>
                    <ListItem.Subtitle>CPF: {funcionario.cpf}</ListItem.Subtitle>
                    <ListItem.Subtitle>Salário: {funcionario.salario.toLocaleString("pt-BR",{style: "currency",currency: "BRL"})}</ListItem.Subtitle>
                    <ListItem.Subtitle>Idade: {funcionario.idade}</ListItem.Subtitle>
                    <ListItem.Subtitle>Empresa: {funcionario.empresa.nome}</ListItem.Subtitle>
                </ListItem.Content>
                <Button type="clear" icon={obtemIcone("pencil",25,"skyblue")} onPress={() => props.navigation.navigate("FormularioFuncionario",funcionarioAux)} />
                <Button type="clear" icon={obtemIcone("trash",25,"skyblue")} onPress={() => confirmaRemocao(funcionario)} />
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
            <SafeAreaView style={estilo.painel}>
                <Menu visible={stateMenu.menuVisivel} onDismiss={() => menuInativo(dispatchMenu)} anchor={criaMenu(menuAtivo,dispatchMenu,props.navigation,"Funcionário")}>
                    <Menu.Item onPress={() => alteraTela("ListaEmpresas")} title="Empresas" />
                    <Menu.Item onPress={() => alteraTela("ListaFuncionarios")} title="Funcionários" />
                </Menu>
            </SafeAreaView>
            <TextInput placeholder="Pesquisar por nome" onChangeText={(nome) => setPesquisa(nome)} onSelectionChange={() => filtrar()} value={pesquisa} style={estiloFuncionario.filtro} />
            <FlatList keyExtractor={funcionario => funcionario.id.toString()} data={funcionarios} renderItem={obtemFuncionario} />
            <Button title="Cadastrar" color="blue" onPress={() => props.navigation.navigate("FormularioFuncionario")} />
        </Provider>
    );
}

const estiloFuncionario = StyleSheet.create({
    filtro: {
        height: 50,
        borderColor: "gray",
        borderWidth: 1
    }
});
