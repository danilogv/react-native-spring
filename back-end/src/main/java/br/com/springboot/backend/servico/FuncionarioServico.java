package br.com.springboot.backend.servico;

import br.com.springboot.backend.dominio.Empresa;
import br.com.springboot.backend.dominio.Funcionario;
import br.com.springboot.backend.enumeracao.TipoOperacao;
import br.com.springboot.backend.padrao_projeto.FacadeRepositorio;
import br.com.springboot.backend.utilitario.Util;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class FuncionarioServico extends FacadeRepositorio {

    private final BigDecimal SALARIO_MINIMO = new BigDecimal("1302.00");
    private final Integer MAIORIDADE = 18;

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public List<Funcionario> listar() {
        List<Funcionario> funcionarios = this.funcionario.findAll();
        return funcionarios;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public Funcionario buscar(String id) {
        Optional<Funcionario> funcionario = this.funcionario.findById(id);
        return funcionario.orElse(null);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void inserir(Funcionario funcionario) {
        String id = UUID.randomUUID().toString();
        funcionario.setId(id);

        this.validaFuncionario(funcionario,TipoOperacao.INSERCAO);
        this.funcionario.save(funcionario);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void alterar(Funcionario funcionario) {
        this.validaFuncionario(funcionario,TipoOperacao.ALTERACAO);
        this.funcionario.save(funcionario);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void excluir(String id) {
        Funcionario funcionario = new Funcionario();
        funcionario.setId(id);

        this.validaFuncionario(funcionario,TipoOperacao.REMOCAO);
        this.funcionario.deleteById(id);
    }

    private void validaFuncionario(Funcionario funcionario,TipoOperacao operacao) {
        String id = funcionario.getId();
        String nome = funcionario.getNome();
        String cpf = funcionario.getCpf();
        BigDecimal salario = funcionario.getSalario();
        Integer idade = funcionario.getIdade();
        Empresa empresa = funcionario.getEmpresa();

        if (nome.isBlank()) {
            String msg = "Informe o nome do funcionário.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (cpf.isBlank()) {
            String msg = "Informe o CPF do funcionário.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (!Util.cpfValido(cpf)) {
            String msg = "CPF inválido.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (Objects.isNull(salario)) {
            String msg = "Informe o salário do funcionário.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (salario.compareTo(this.SALARIO_MINIMO) < 0) {
            String msg = "Salário do funcionário, inferior ao salário mínimo atual.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (Objects.isNull(idade)) {
            String msg = "Informe a idade do funcionário.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (idade.compareTo(this.MAIORIDADE) < 0) {
            String msg = "Idade do funcionário menor que 18 anos.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (Objects.isNull(empresa)) {
            String msg = "Informe a empresa no qual o funcionário trabalha.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (operacao.equals(TipoOperacao.INSERCAO))
            if (this.funcionario.existsByCpfAndEmpresa(cpf,empresa)) {
                String msg = "Funcionário já cadastrado na empresa.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

        if (operacao.equals(TipoOperacao.ALTERACAO))
            if (!this.funcionario.existsByCpf(cpf) && this.funcionario.existsByCpfAndEmpresa(cpf,empresa)) {
                String msg = "Funcionário já cadastrado na empresa.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

        if (operacao.equals(TipoOperacao.REMOCAO))
            if (!this.funcionario.existsById(id)) {
                String msg = "Funcionário não existe na base de dados.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

    }

}
