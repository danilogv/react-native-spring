import React,{useState,useReducer,useEffect} from "react";
import {Text,SafeAreaView,TextInput,Button,Alert} from "react-native";
import {Menu,Provider} from 'react-native-paper';
import {criaMenu,estilo,mascaraCpf,cpfValido,formataDecimal,separadorMilhar} from "../global.js";
import {estadoInicialMenu} from "../store/config.js";
import {reducer} from "../store/menuReducer.js";
import {menuAtivo,menuInativo} from "../store/menuAction.js";

let ehInsercao = true;

export default function FormularioFuncionario(props) {
    const {route,navigation} = props;
    const [funcionario,setFuncionario] = useState(route.params ? route.params : {});
    const [stateMenu,dispatchMenu] = useReducer(reducer,estadoInicialMenu);

    useEffect(() => {
        if (route.params)
            ehInsercao = false;
    },[]);

    function alterar() {
        const msg = ehInsercao ? "Funcionário cadastrado com sucesso." : "Dados alterados com sucesso.";

        if (funcionario.cpf && !cpfValido(funcionario.cpf))
            Alert.alert("Funcionário","CPF inválido.");
        else {
            Alert.alert("Funcionário",msg);
            navigation.goBack();
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
                <Menu visible={stateMenu.menuVisivel} onDismiss={() => menuInativo(dispatchMenu)} anchor={criaMenu(menuAtivo,dispatchMenu,"Funcionário")}>
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
                <Button title="Salvar" onPress={() => alterar()} />
            </SafeAreaView>
        </Provider>
    );

}
