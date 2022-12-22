import Icon from "react-native-vector-icons/FontAwesome.js";

export const configPagina = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
};

export const urlEmpresa = "http://localhost:8080/empresa";
export const urlFuncionario = "http://localhost:8080/funcionario";

export function obtemIcone(nome,tamanho,cor) {
    return (
        <Icon name={nome} size={tamanho} color={cor} />
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
