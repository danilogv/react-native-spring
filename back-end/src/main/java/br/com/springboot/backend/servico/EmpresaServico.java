package br.com.springboot.backend.servico;

import br.com.springboot.backend.dominio.Empresa;
import br.com.springboot.backend.enumeracao.TipoOperacao;
import br.com.springboot.backend.padrao_projeto.FacadeRepositorio;
import br.com.springboot.backend.utilitario.Util;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmpresaServico extends FacadeRepositorio {

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public List<Empresa> buscarTodos() {
        List<Empresa> empresas = this.empresa.findAll();
        return empresas;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public Empresa buscar(String id) {
        Optional<Empresa> empresa = this.empresa.findById(id);
        return empresa.orElse(null);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void inserir(Empresa empresa) {
        String id = UUID.randomUUID().toString();
        empresa.setId(id);

        this.validaEmpresa(empresa,TipoOperacao.INSERCAO);
        this.empresa.save(empresa);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void alterar(Empresa empresa) {
        this.validaEmpresa(empresa,TipoOperacao.ALTERACAO);
        this.empresa.save(empresa);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void excluir(String id) {
        Empresa empresa = new Empresa();
        empresa.setId(id);

        this.validaEmpresa(empresa,TipoOperacao.REMOCAO);
        this.empresa.deleteById(id);
    }

    private void validaEmpresa(Empresa empresa,TipoOperacao operacao) {
        String id = empresa.getId();
        String nome = empresa.getNome();
        String cnpj = empresa.getCnpj();

        if (nome.isBlank()) {
            String msg = "Informe o nome da empresa.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (cnpj.isBlank()) {
            String msg = "Informe o CNPJ da empresa.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (!Util.cnpjValido(cnpj)) {
            String msg = "CNPJ inválido.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

        if (operacao.equals(TipoOperacao.INSERCAO))
            if (this.empresa.existsByCnpj(empresa.getCnpj())) {
                String msg = "Empresa com CNPJ já cadastrado.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

        if (operacao.equals(TipoOperacao.ALTERACAO))
            if (Objects.isNull(this.buscar(id)) && this.empresa.existsByCnpj(cnpj)) {
                String msg = "Empresa com CNPJ já cadastrado.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

        if (operacao.equals(TipoOperacao.REMOCAO))
            if (!this.empresa.existsById(id)) {
                String msg = "Empresa não existe na base de dados.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

    }

}
