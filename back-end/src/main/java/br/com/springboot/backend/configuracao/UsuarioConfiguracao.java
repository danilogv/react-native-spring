package br.com.springboot.backend.configuracao;

import br.com.springboot.backend.dominio.Usuario;
import br.com.springboot.backend.padrao_projeto.FacadeRepositorio;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioConfiguracao extends FacadeRepositorio implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        if (!this.usuario.existsByLogin(login))
            throw new UsernameNotFoundException("Usuário não encontrado.");

        Usuario usuario = this.usuario.findByLogin(login);

        return usuario;
    }
}
