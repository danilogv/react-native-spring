package br.com.springboot.backend.repositorio;

import br.com.springboot.backend.dominio.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmpresaRepositorio extends JpaRepository<Empresa,String> {

    Boolean existsByCnpj(String cnpj);

}
