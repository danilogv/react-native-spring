package br.com.springboot.backend.dominio;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "funcionario")
public class Funcionario {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cpf")
    private String cpf;

    @Column(name = "salario")
    private BigDecimal salario;

    @Column(name = "idade")
    private BigDecimal idade;

    @Column(name = "url_imagem")
    private String urlImagem;

    @ManyToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return this.cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public BigDecimal getSalario() {
        return this.salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public BigDecimal getIdade() {
        return this.idade;
    }

    public void setIdade(BigDecimal idade) {
        this.idade = idade;
    }

    public String getUrlImagem() {
        return this.urlImagem;
    }

    public void setUrlImagem(String urlImagem) {
        this.urlImagem = urlImagem;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    @Override
    public boolean equals(Object objeto) {
        if (this == objeto)
            return true;

        if (objeto == null || getClass() != objeto.getClass())
            return false;

        Funcionario funcionario = (Funcionario) objeto;

        if (this.id.equals(funcionario.getId()))
            return true;

        if (this.cpf.equals(funcionario.getCpf()) && this.empresa.getId().equals(funcionario.getEmpresa().getId()))
            return true;

        return false;
    }
}
