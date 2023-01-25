package br.com.springboot.backend.servico;

import br.com.springboot.backend.dominio.Usuario;
import br.com.springboot.backend.enumeracao.TipoOperacao;
import br.com.springboot.backend.padrao_projeto.FacadeRepositorio;
import org.springframework.http.HttpStatus;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioServico extends FacadeRepositorio {

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public List<Usuario> buscarTodos() {
        List<Usuario> usuarios = this.usuario.findAll();
        return usuarios;
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,readOnly = true)
    public Usuario buscar(String id) {
        Optional<Usuario> usuario = this.usuario.findById(id);
        return usuario.orElse(null);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void inserir(Usuario usuario) {
        String id = UUID.randomUUID().toString();
        usuario.setId(id);

        this.validaUsuario(usuario,TipoOperacao.INSERCAO);
        this.usuario.save(usuario);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void alterar(Usuario usuario) {
        this.validaUsuario(usuario,TipoOperacao.ALTERACAO);
        this.usuario.save(usuario);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED,rollbackFor = Exception.class)
    public void excluir(String id) {
        Usuario usuario = new Usuario();
        usuario.setId(id);

        this.validaUsuario(usuario,TipoOperacao.REMOCAO);
        this.usuario.deleteById(id);
    }

    private void validaUsuario(Usuario usuario,TipoOperacao operacao) {
        String id = usuario.getId();
        String login = usuario.getLogin();
        String senha = usuario.getSenha();

        if (!operacao.equals(TipoOperacao.REMOCAO)) {
            if (login.isBlank()) {
                String msg = "Informe o login do usuário.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

            if (senha.isBlank()) {
                String msg = "Informe a senha do usuário.";
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
            }

            if (operacao.equals(TipoOperacao.INSERCAO)) {
                //BCryptPasswordEncoder decodificacao = new BCryptPasswordEncoder();
                //senha = decodificacao.encode(senha);

                if (this.usuario.existsByLoginOrSenha(login,senha)) {
                    String msg = "Usuário já cadastrado.";
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
                }
            }

            if (operacao.equals(TipoOperacao.ALTERACAO))
                if (!this.usuario.existsByLogin(login) && this.usuario.existsByLoginAndSenha(login,senha)) {
                    String msg = "Usuário já cadastrado.";
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
                }
        }
        else if (!this.usuario.existsById(id)) {
            String msg = "Usuário não existe na base de dados.";
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,msg);
        }

    }

}
