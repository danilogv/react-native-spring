import React,{useReducer,useState} from "react";
import {FlatList,Alert,TextInput,SafeAreaView,StyleSheet} from "react-native";
import {Menu,Provider} from 'react-native-paper';
import {ListItem,Button} from '@rneui/themed';
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";
import {obtemIcone,urlEmpresa,configPagina,criaMenu,estilo} from "../global.js";

const estadoInicial = [
    {
        id: 1,
        nome: "Empresa 1",
        cnpj: "11.111.111/1111-11"
    },
    {
        id: 2,
        nome: "Empresa 2",
        cnpj: "22.222.222/2222-22"
    },
    {
        id: 3,
        nome: "Empresa 3",
        cnpj: "33.333.333/3333-33"
    }
];

export default function ListaEmpresas(props) {
    const [empresas,setEmpresas] = useState(estadoInicial);
    const [pesquisa,setPesquisa] = useState("");
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);

    async function filtrar() {
        try {
            const opcoes = {method: "GET",headers: configPagina};
            const resposta = await fetch(urlEmpresa + "?nome=" + pesquisa,opcoes);
        }
        catch (erro) {
            Alert.alert("Pesquisa Empresa","Erro de servidor.");
        }
    }

    function confirmaRemocao(empresa) {
        const botoes = [
            {
                text: "Sim",
                async onPress() {
                    try {
                        const opcoes =  {method: "DELETE",body: empresa,headers: configPagina};
                        const resposta = await fetch(urlEmpresa + "/" + id,opcoes);
                    }
                    catch (erro) {
                        Alert.alert("Excluir Empresa","Erro de servidor.");
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
                    <ListItem.Subtitle>CNPJ: {empresa.cnpj}</ListItem.Subtitle>
                </ListItem.Content>
                <Button type="clear" icon={obtemIcone("plus",25,"skyblue")} onPress={() => props.navigation.navigate("FormularioEmpresa")} />
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
            <SafeAreaView style={estilo.painel}>
                <Menu visible={stateMenu.menuVisivel} onDismiss={() => menuInativo(dispatchMenu)} anchor={criaMenu(menuAtivo,dispatchMenu,"Empresa")}>
                    <Menu.Item onPress={() => alteraTela("ListaEmpresas")} title="Empresas" />
                    <Menu.Item onPress={() => alteraTela("ListaFuncionarios")} title="Funcionários" />
                </Menu>
            </SafeAreaView>
            <TextInput placeholder="Pesquisar por nome" onChangeText={(nome) => setPesquisa(nome)} onSelectionChange={() => filtrar()} value={pesquisa} style={estiloEmpresa.filtro} />
            <FlatList keyExtractor={empresa => empresa.id.toString()} data={empresas} renderItem={obtemEmpresa} />
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
