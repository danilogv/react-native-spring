package br.com.springboot.backend.padrao_projeto;

import br.com.springboot.backend.servico.EmpresaServico;
import br.com.springboot.backend.servico.FuncionarioServico;
import br.com.springboot.backend.servico.UsuarioServico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FacadeServico {

    @Autowired
    protected EmpresaServico empresa;

    @Autowired
    protected FuncionarioServico funcionario;

    @Autowired
    protected UsuarioServico usuario;

}
