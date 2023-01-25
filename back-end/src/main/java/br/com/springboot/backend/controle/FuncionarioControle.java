package br.com.springboot.backend.controle;

import br.com.springboot.backend.dominio.Funcionario;
import br.com.springboot.backend.padrao_projeto.FacadeServico;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/funcionario")
public class FuncionarioControle extends FacadeServico implements ObjetoControle {

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscar(@PathVariable String id) {
        Funcionario funcionario = null;

        try {
            funcionario = this.funcionario.buscar(id);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.OK).body(funcionario);
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> buscarTodos() {
        List<Funcionario> funcionarios = new ArrayList<>();

        try {
            funcionarios = this.funcionario.buscarTodos();
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.OK).body(funcionarios);
    }

    @PostMapping
    public ResponseEntity<Void> inserir(@RequestBody Funcionario funcionario) {
        try {
            this.funcionario.inserir(funcionario);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping
    public ResponseEntity<Void> alterar(@RequestBody Funcionario funcionario) {
        try {
            this.funcionario.alterar(funcionario);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            this.funcionario.excluir(id);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
