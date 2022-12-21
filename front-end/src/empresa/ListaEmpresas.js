import React,{useState} from "react";
import {FlatList} from "react-native";
import {ListItem,Button} from '@rneui/themed';
import Icon from "react-native-vector-icons/FontAwesome.js";

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

export default function ListaEmpresas() {
    const [empresas,setEmpresas] = useState(estadoInicial);

    function obtemIcone(nome,tamanho,cor) {
        return (
            <Icon name={nome} size={tamanho} color={cor} />
        );
    }

    function obtemEmpresa({item: empresa}) {
        return (
            <ListItem bottomDivider={true}>
                <ListItem.Content>
                    <ListItem.Title>{empresa.nome}</ListItem.Title>
                    <ListItem.Subtitle>{empresa.cnpj}</ListItem.Subtitle>
                </ListItem.Content>
                <Button type="clear" icon={obtemIcone("pencil",25,"skyblue")} />
                <Button type="clear" icon={obtemIcone("trash",25,"skyblue")} />
            </ListItem>
        );
    }
      
    return (
        <FlatList keyExtractor={empresa => empresa.id.toString()} data={empresas} renderItem={obtemEmpresa} />
    );
    
}