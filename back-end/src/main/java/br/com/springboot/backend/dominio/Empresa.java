package br.com.springboot.backend.dominio;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "empresa")
public class Empresa implements Serializable {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "nome")
    private String cnpj;

    @OneToMany(mappedBy = "empresa",cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<Funcionario> funcionarios;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCnpj() {
        return this.cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public List<Funcionario> getFuncionarios() {
        return this.funcionarios;
    }

    public void setFuncionarios(List<Funcionario> funcionarios) {
        this.funcionarios = funcionarios;
    }

    @Override
    public boolean equals(Object objeto) {
        if (this == objeto)
            return true;

        if (objeto == null || getClass() != objeto.getClass())
            return false;

        Empresa empresa = (Empresa) objeto;

        if (this.id.equals(empresa.getId()) || this.cnpj.equals(empresa.getCnpj()))
            return true;

        return false;
    }
}
