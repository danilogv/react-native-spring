package br.com.springboot.backend.controle;

import br.com.springboot.backend.dominio.Usuario;
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
@RequestMapping(value = "/usuario")
public class UsuarioControle extends FacadeServico implements ObjetoControle {

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable String id) {
        Usuario usuario = null;

        try {
            usuario = this.usuario.buscar(id);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.OK).body(usuario);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> buscarTodos() {
        List<Usuario> funcionarios = new ArrayList<>();

        try {
            funcionarios = this.usuario.buscarTodos();
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.OK).body(funcionarios);
    }

    @PostMapping
    public ResponseEntity<Void> inserir(@RequestBody Usuario usuario) {
        try {
            this.usuario.inserir(usuario);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping
    public ResponseEntity<Void> alterar(@RequestBody Usuario usuario) {
        try {
            this.usuario.alterar(usuario);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        try {
            this.usuario.excluir(id);
        }
        catch (Exception ex) {
            this.geraExcecao(ex);
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
