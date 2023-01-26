package br.com.springboot.backend.repositorio;

import br.com.springboot.backend.dominio.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepositorio extends JpaRepository<Usuario,String> {

    Boolean existsByLoginOrSenha(String login,String senha);
    Boolean existsByLogin(String login);
    Boolean existsByLoginAndSenha(String login,String senha);
    Usuario findByLogin(String login);

}
