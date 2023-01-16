package br.com.springboot.backend.repositorio;

import br.com.springboot.backend.dominio.Empresa;
import br.com.springboot.backend.dominio.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepositorio extends JpaRepository<Funcionario,String> {

    Boolean existsByCpf(String cpf);
    Boolean existsByCpfAndEmpresa(String cpf,Empresa empresa);

}
