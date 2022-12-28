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
    },
    formulario: {
        padding: 15
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 18
    },
    campo: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10
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

export function mascaraCpf(cpf) {
    return cpf.replace(/\D+/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
    ;
}

export function cpfValido(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if (cpf.length !== 11)
        return false;
    if (cpf === "00000000000")
        return false;
    if (cpf === "11111111111")
        return false;
    if (cpf === "22222222222")
        return false;
    if (cpf === "33333333333")
        return false;
    if (cpf === "44444444444")
        return false;
    if (cpf === "55555555555")
        return false;
    if (cpf === "66666666666")
        return false;
    if (cpf === "77777777777")
        return false;
    if (cpf === "88888888888")
        return false;
    if (cpf === "99999999999")
        return false;
    let soma = 0;
    for (let i = 0;i < 9;i++)
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (soma % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(cpf.charAt(9)))
        return false;
    soma = 0;
    for (let i = 0;i < 10;i++)
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (soma % 11);
    if (rev === 10 || rev === 11)
        rev = 0;
    if (rev !== parseInt(cpf.charAt(10)))
        return false;
    return true;
}

export function formataDecimal(valor) {
    if ((valor.match(/,/g) || []).length > 1) 
        valor = valor.substring(0,valor.length - 1);
    valor = valor.replace(/(,\d{2})\d*/g, "$1");
    valor = valor.replace(/[^\d,]+/g, "");
    return valor;
}

export function separadorMilhar(valor) {
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (valor.indexOf(",") === -1)
        valor += ",00";
    else {
        const valorCentavos = valor.split(",");
        if (valorCentavos[1].length === 1)
            valor += "0";
    }
    return valor;
}
