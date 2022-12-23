import React,{useState} from "react";
import {FlatList,Alert,SafeAreaView,Text,StyleSheet} from "react-native";
import {Menu,Provider} from 'react-native-paper';
import {ListItem,Button} from '@rneui/themed';
import {obtemIcone,urlEmpresa,configPagina} from "../global.js";

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
    const [menuVisivel,setMenuVisivel] = useState(false);

    function criaMenu() {
        return (
            <SafeAreaView>
                <Button type="clear" icon={obtemIcone("bars",25,"white")} onPress={() => setMenuVisivel(true)}>
                    <Text style={estilo.textoBotao}>Empresa</Text>
                </Button>
            </SafeAreaView>
        );
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
                    <ListItem.Title>{empresa.nome}</ListItem.Title>
                    <ListItem.Subtitle>{empresa.cnpj}</ListItem.Subtitle>
                </ListItem.Content>
                <Button type="clear" icon={obtemIcone("plus",25,"skyblue")} onPress={() => props.navigation.navigate("FormularioEmpresa")} />
                <Button type="clear" icon={obtemIcone("pencil",25,"skyblue")} onPress={() => props.navigation.navigate("FormularioEmpresa",empresa)} />
                <Button type="clear" icon={obtemIcone("trash",25,"skyblue")} onPress={() => confirmaRemocao(empresa)} />
            </ListItem>
        );
    }
      
    return (
        <Provider>
            <SafeAreaView style={estilo.painel}>
                <Menu visible={menuVisivel} onDismiss={() => setMenuVisivel(false)} anchor={criaMenu()}>
                    <Menu.Item onPress={() => props.navigation.navigate("ListaEmpresas")} title="Empresas" />
                    <Menu.Item onPress={() => props.navigation.navigate("ListaFuncionarios")} title="Funcionários" />
                </Menu>
            </SafeAreaView>
            <FlatList keyExtractor={empresa => empresa.id.toString()} data={empresas} renderItem={obtemEmpresa} />
        </Provider>
        
    );
    
}

const estilo = StyleSheet.create({
    painel: {
        flexDirection: "row",
        justifyContent: "flex-start",
        backgroundColor: "blue"
    },
    textoBotao: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        paddingLeft: 10
    }
});
