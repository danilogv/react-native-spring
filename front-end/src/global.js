import {SafeAreaView,Text,StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome.js";
import {Button} from '@rneui/themed';

export const configPagina = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
};

export const urlEmpresa = "http://localhost:8080/empresa";
export const urlFuncionario = "http://localhost:8080/funcionario";

export const estilo = StyleSheet.create({
    painel: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "blue",
        height: 50
    },
    painelMenu: {
        flexDirection: "row"
    },
    textoBotao: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15
    }
});

export function obtemIcone(nome,tamanho,cor) {
    return (
        <Icon name={nome} size={tamanho} color={cor} />
    );
}

export function criaMenu(menuAtivo,dispatchMenu,titulo) {
    const distanciaLogout = titulo === "Empresa" ? 225 : 200;

    return (
        <SafeAreaView style={estilo.painelMenu}>
            <Button type="clear" icon={obtemIcone("bars",25,"white")} onPress={() => menuAtivo(dispatchMenu)}>
                <Text style={[estilo.textoBotao,{paddingRight: distanciaLogout}]}>{titulo}</Text>
            </Button>
            <Button type="clear" icon={obtemIcone("sign-out",25,"white")} />
        </SafeAreaView>
    );
}

export function mascaraCnpj(cnpj) {
    return cnpj.replace(/\D+/g, "")
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    ;
}

export function cnpjValido(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,"");
    if (cnpj.length !== 14) 
        return false;
    if (cnpj === "00000000000000")
        return false;
    if (cnpj === "11111111111111")
        return false;
    if (cnpj === "22222222222222")
        return false;
    if (cnpj === "33333333333333")
        return false;
    if (cnpj === "44444444444444")
        return false;
    if (cnpj === "55555555555555")
        return false;
    if (cnpj === "66666666666666")
        return false;
    if (cnpj === "77777777777777")
        return false;
    if (cnpj === "88888888888888")
        return false;
    if (cnpj === "99999999999999")
        return false;
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0)))
        return false;
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1)))
        return false;
    return true;
}
