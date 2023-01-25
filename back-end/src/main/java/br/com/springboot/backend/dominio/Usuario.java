package br.com.springboot.backend.dominio;

/*import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;*/

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "login")
    private String login;

    @Column(name = "senha")
    private String senha;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLogin() {
        return this.login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return this.senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    @Override
    public boolean equals(Object objeto) {
        if (this == objeto)
            return true;

        if (objeto == null || getClass() != objeto.getClass())
            return false;

        Usuario usuario = (Usuario) objeto;

        if (this.id.equals(usuario.getId()))
            return true;

        if (this.login.equals(usuario.getLogin()) && this.senha.equals(usuario.getSenha()))
            return true;

        return false;
    }

    /*@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }*/

}

