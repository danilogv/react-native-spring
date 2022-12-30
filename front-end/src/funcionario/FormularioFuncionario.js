import React,{useState,useReducer,useEffect} from "react";
import {Text,SafeAreaView,TextInput,Button,Alert} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {Menu,Provider} from 'react-native-paper';
import {criaMenu,estilo,mascaraCpf,cpfValido,formataDecimal,separadorMilhar,configPagina,urlFuncionario} from "../global.js";
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
    const [empresas,setEmpresas] = useState([
        {label: 'Empresa 1', value: 1},
        {label: 'Empresa 2', value: 2}
    ]);

    useEffect(() => {
        if (route.params) {
            ehInsercao = false;
            setEmpresa(route.params.empresa.id);
        }
    },[]);

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
            if (validou()) {
                let opcoes = undefined;

                if (ehInsercao)
                    opcoes = {method: "POST",body: JSON.stringify(funcionario),headers: configPagina};
                else
                    opcoes = {method: "PUT",body: JSON.stringify(funcionario),headers: configPagina};
                
                const resposta = await fetch(urlFuncionario,opcoes);
                const msg = await obtemMensagemErro(resposta);
                
                if (msg && msg !== "")
                    throw new Error(msg);

                msg = ehInsercao ? "Funcionário cadastrado com sucesso." : "Dados alterados com sucesso.";
                Alert.alert("Funcionário",msg);
                navigation.goBack();
            }
        }
        catch (erro) {
            Alert.alert("Empresa","Erro de servidor : " + erro.message);
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
