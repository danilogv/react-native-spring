import React,{useReducer,useState,useEffect} from "react";
import {FlatList,Alert,TextInput,SafeAreaView,StyleSheet} from "react-native";
import {Menu,Provider} from 'react-native-paper';
import {ListItem,Button} from '@rneui/themed';
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";
import {obtemIcone,configPagina,criaMenu,estilo,urlFuncionario,obtemMensagemErro} from "../global.js";

const estadoInicial = [
    {
        id: 1,
        nome: "Funcionário 1",
        cpf: "111.111.111-11",
        salario: 1315.25,
        idade: 25,
        empresa: {
            id: 1,
            nome: "Empresa 1",
            cnpj: "11.111.111/1111-11"
        }
    },
    {
        id: 2,
        nome: "Funcionário 2",
        cpf: "222.222.222-22",
        salario: 2116.70,
        idade: 30,
        empresa: {
            id: 1,
            nome: "Empresa 1",
            cnpj: "11.111.111/1111-11"
        }
    },
    {
        id: 3,
        nome: "Funcionário 3",
        cpf: "333.333.333-33",
        salario: 3000.00,
        idade: 45,
        empresa: {
            id: 2,
            nome: "Empresa 2",
            cnpj: "22.222.222/2222-22"
        }
    }
];

export default function ListaFuncionarios(props) {
    const [funcionarios,setFuncionarios] = useState({});
    const [pesquisa,setPesquisa] = useState("");
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);

    useEffect(() => {
        setFuncionarios(estadoInicial);
    },[]);

    async function filtrar() {
        try {
            const opcoes = {method: "GET",headers: configPagina};
            const resposta = await fetch(urlEmpresa + "?nome=" + pesquisa,opcoes);
        }
        catch (erro) {
            Alert.alert("Pesquisa Empresa","Erro de servidor.");
        }
    }

    function confirmaRemocao(funcionario) {
        const botoes = [
            {
                text: "Sim",
                async onPress() {
                    try {
                        const opcoes =  {method: "DELETE",body: funcionario,headers: configPagina};
                        const resposta = await fetch(urlFuncionario + "/" + funcionario.id,opcoes);
                        const msg = await obtemMensagemErro(resposta);
                
                        if (msg && msg !== "")
                            throw new Error(msg);
                    }
                    catch (erro) {
                        Alert.alert("Excluir Funcionário","Erro de servidor." + erro.message);
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
