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
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmpresaServico extends FacadeRepositorio {

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public List<Empresa> buscarTodos(String nome) {
        List<Empresa> empresas;

        if (Objects.isNull(nome) || nome.isBlank())
            empresas = this.empresa.findAll();
        else
            empresas = this.empresa.findByNomeContainingIgnoreCase(nome);

        empresas = empresas
            .stream()
            .sorted(Comparator.comparing(Empresa::getNome,String.CASE_INSENSITIVE_ORDER))
            .collect(Collectors.toList())
        ;

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

        switch (operacao) {
            case INSERCAO:
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

                if (this.empresa.existsByCnpj(empresa.getCnpj())) {
                    String msg = "Empresa com CNPJ já cadastrado.";
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
                }

                break;
            case ALTERACAO:
                if (Objects.nonNull(cnpj) && !cnpj.isBlank() && !Util.cnpjValido(cnpj)) {
                    String msg = "CNPJ inválido.";
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
                }

                if (Objects.isNull(this.buscar(id)) && this.empresa.existsByCnpj(cnpj)) {
                    String msg = "Empresa com CNPJ já cadastrado.";
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
                }

                break;
            case REMOCAO:
                if (Objects.isNull(id) || !this.empresa.existsById(id)) {
                    String msg = "Empresa não existe na base de dados.";
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
                }

                break;
        }

    }

}
