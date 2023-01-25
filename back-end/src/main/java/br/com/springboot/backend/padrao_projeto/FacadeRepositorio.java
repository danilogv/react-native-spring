package br.com.springboot.backend.padrao_projeto;

import br.com.springboot.backend.repositorio.EmpresaRepositorio;
import br.com.springboot.backend.repositorio.FuncionarioRepositorio;
import br.com.springboot.backend.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FacadeRepositorio {

    @Autowired
    protected EmpresaRepositorio empresa;

    @Autowired
    protected FuncionarioRepositorio funcionario;

    @Autowired
    protected UsuarioRepositorio usuario;

}
