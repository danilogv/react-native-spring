package br.com.springboot.backend.configuracao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
public class Seguranca {

    @Autowired
    private UsuarioConfiguracao usuario;

    @Autowired
    private JWT jwt;

    @Autowired
    private RequisicaoHttp requisicao;

    /*@Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.usuario).passwordEncoder(new BCryptPasswordEncoder());
    }*/

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(List.of("http://localhost:3000"));
        cors.setAllowCredentials(true);
        cors.setAllowedHeaders(List.of("*"));
        cors.setAllowedMethods(List.of("HEAD","GET","POST","PUT","DELETE","PATCH","OPTIONS"));
        cors.setExposedHeaders(List.of("X-Auth-Token","Authorization","Access-Control-Allow-Origin","Access-Control-Allow-Credentials"));

        http.cors().configurationSource(requisicao -> cors);
        http.csrf().disable().headers().frameOptions().disable();

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and().exceptionHandling().authenticationEntryPoint(this.requisicao)
                .and().authorizeHttpRequests(
                        (requisicaoHttp) ->
                                requisicaoHttp.requestMatchers(HttpMethod.POST,"/usuario/login").permitAll()
                                        .requestMatchers(HttpMethod.POST,"/usuario").permitAll()
                                        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll().anyRequest().authenticated()
                )
                .addFilterBefore(new Autenticacao(this.usuario,this.jwt),UsernamePasswordAuthenticationFilter.class)
        ;

        //AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        //auth.userDetailsService(this.usuario).passwordEncoder(new BCryptPasswordEncoder());
       // authenticationManager = authenticationManagerBuilder.build();

        return http.build();
    }

    @Bean
    public PasswordEncoder criptografiaSenha() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager autenticacacao(HttpSecurity http,PasswordEncoder criptografiaSenha,UsuarioConfiguracao usuario) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(usuario)
                .passwordEncoder(criptografiaSenha)
                .and()
                .build()
        ;
    }

}
