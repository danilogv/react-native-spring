import React,{useState} from "react";
import {FlatList,Alert} from "react-native";
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
                <Button type="clear" icon={obtemIcone("pencil",25,"skyblue")} onPress={() => props.navigation.navigate("FormularioEmpresa",empresa)} />
                <Button type="clear" icon={obtemIcone("trash",25,"skyblue")} onPress={() => confirmaRemocao(empresa)} />
            </ListItem>
        );
    }
      
    return (
        <FlatList keyExtractor={empresa => empresa.id.toString()} data={empresas} renderItem={obtemEmpresa} />
    );
    
}