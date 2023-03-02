import React,{useState,useReducer,useEffect} from "react";
import {Text,SafeAreaView,TextInput,Button,Alert} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import {Menu,Provider} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {criaMenu,estilo,mascaraCpf,cpfValido,formataDecimal,separadorMilhar,obtemMensagemErro,configPagina,urlFuncionario,urlEmpresa} from "../global.js";
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";

let ehInsercao = true;

export default function FormularioFuncionario(props) {
    const {route,navigation} = props;
    const [funcionario,setFuncionario] = useState(route.params ? route.params : {});
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);
    const [comboAberta,setComboAberta] = useState(false);
    const [empresa,setEmpresa] = useState(null);
    const [empresas,setEmpresas] = useState([]);
    const voltouFoco = useIsFocused();

    useEffect(() => {
        if (route.params) {
            ehInsercao = false;
            setEmpresa(route.params.empresa.id);
        }

        obtemEmpresas();
    },[]);

    useEffect(() => {
        obtemEmpresas();
    },[voltouFoco]);

    async function obtemEmpresas() {
        try {
            const token = await AsyncStorage.getItem("token");
            const cabecalho = {...configPagina,"Authorization": "Bearer " + token};
            const opcoes = {method: "GET",headers: cabecalho};
            const resposta = await fetch(urlEmpresa,opcoes);

            let msg = await obtemMensagemErro(resposta);

            if (msg && msg !== "")
                throw new Error(msg);

            const dados = await resposta.json();
            let combobox = [];

            dados.forEach((emp) => {
                let objetoCombobox = {label: "",value: ""};
                objetoCombobox.label = emp.nome;
                objetoCombobox.value = emp.id;
                combobox.push(objetoCombobox);
            });

            setEmpresas(combobox);
        }
        catch(erro) {
            Alert.alert("Funcionário",JSON.parse(erro.message).mensagem);
        }
    }

    function validou() {
        if (!funcionario.nome || funcionario.nome === "") {
            Alert.alert("Funcionário","Informe o nome.");
            return false;
        }

        if (!funcionario.cpf || funcionario.cpf === "") {
            Alert.alert("Funcionário","Informe o CPF.");
            return false;
        }

        if (funcionario.cpf && !cpfValido(funcionario.cpf)) {
            Alert.alert("Funcionário","CPF inválido.");
            return false;
        }

        if (!funcionario.salario || funcionario.salario === "") {
            Alert.alert("Funcionário","Informe o salário.");
            return false;
        }

        if (!funcionario.idade || funcionario.idade === "") {
            Alert.alert("Funcionário","Informe a idade.");
            return false;
        }

        if (funcionario.idade && parseInt(funcionario.idade) < 18) {
            Alert.alert("Funcionário","Idade inferior a 18 anos.");
            return false;
        }

        if (ehInsercao && empresa == null) {
            Alert.alert("Funcionário","Informe a empresa.");
            return false;
        }

        return true;
    }

    async function alterar() {
        try {
            const funcionarioBd = {
                id: route.params.id,
                nome: funcionario.nome,
                idade: funcionario.idade,
                cpf: mascaraCpf(funcionario.cpf),
                salario: funcionario.salario.replace(".","").replace(",","."),
                urlImagem: "https://www.google.com.br",
                empresa: {
                    id: empresa
                }
            };

            if (validou()) {
                let opcoes = undefined;
                const token = await AsyncStorage.getItem("token");
                const cabecalho = {...configPagina,"Authorization": "Bearer " + token};

                if (ehInsercao)
                    opcoes = {method: "POST",body: JSON.stringify(funcionarioBd),headers: cabecalho};
                else
                    opcoes = {method: "PUT",body: JSON.stringify(funcionarioBd),headers: cabecalho};
                
                const resposta = await fetch(urlFuncionario,opcoes);
                let msg = await obtemMensagemErro(resposta);
                
                if (msg && msg !== "")
                    throw new Error(msg);

                msg = ehInsercao ? "Funcionário cadastrado com sucesso." : "Dados alterados com sucesso.";
                Alert.alert("Funcionário",msg);
                navigation.goBack();
            }
        }
        catch (erro) {
            Alert.alert("Funcionário","Erro de servidor : " + erro.message);
        }
    }

    function formataCpf(cpf) {
        cpf = cpf.replace(/[^0-9]/g,"");
        setFuncionario({...funcionario,cpf});
    }

    function formataIdade(idade) {
        idade = idade.replace(/[^0-9]/g,"");
        setFuncionario({...funcionario,idade});
    }

    function formataSalario(salario) {
        salario = formataDecimal(salario);
        setFuncionario({...funcionario,salario});
    }

    function formataMoeda() {
        let salario = funcionario.salario;
        salario = separadorMilhar(salario);
        setFuncionario({...funcionario,salario});
    }

    function alteraTela(nome) {
        if (props.route.name !== nome)
            navigation.navigate(nome);
    }

    return (
        <Provider>
            <SafeAreaView style={estilo.painel}>
                <Menu visible={stateMenu.menuVisivel} onDismiss={() => menuInativo(dispatchMenu)} anchor={criaMenu(menuAtivo,dispatchMenu,navigation,"Funcionário")}>
                    <Menu.Item onPress={() => alteraTela("ListaEmpresas")} title="Empresas" />
                    <Menu.Item onPress={() => alteraTela("ListaFuncionarios")} title="Funcionários" />
                </Menu>
            </SafeAreaView>
            <SafeAreaView style={estilo.formulario}>
                <Text style={estilo.titulo}>Nome:</Text>
                <TextInput onChangeText={(nome) => setFuncionario({...funcionario,nome})} placeholder="Informe o nome" value={funcionario.nome} style={estilo.campo} />
                <Text style={estilo.titulo}>CPF:</Text>
                <TextInput onChangeText={(cpf) => formataCpf(cpf)} placeholder="Informe o CPF" keyboardType="decimal-pad" value={funcionario.cpf ? mascaraCpf(funcionario.cpf) : ""} style={estilo.campo} />
                <Text style={estilo.titulo}>Salário:</Text>
                <TextInput onChangeText={(salario) => formataSalario(salario)} placeholder="Informe o salário" keyboardType="decimal-pad" onBlur={() => formataMoeda()} value={funcionario.salario} style={estilo.campo} />
                <Text style={estilo.titulo}>Idade:</Text>
                <TextInput onChangeText={(idade) => formataIdade(idade)} placeholder="Informe a idade" keyboardType="number-pad" value={funcionario.idade} style={estilo.campo} />
                <Text style={estilo.titulo}>Empresa:</Text>
                <DropDownPicker placeholder="Selecione..." open={comboAberta} value={empresa} items={empresas} setOpen={setComboAberta} setValue={setEmpresa} setItems={setEmpresas} />
                <SafeAreaView style={{paddingTop: 20}}>
                    <Button title="Salvar" onPress={() => alterar()} />
                </SafeAreaView>
            </SafeAreaView>
        </Provider>
    );

}
