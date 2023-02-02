package br.com.springboot.backend.configuracao;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class RequisicaoHttp implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest requisicao,HttpServletResponse resposta,AuthenticationException excecao) throws IOException {
        resposta.sendError(HttpServletResponse.SC_UNAUTHORIZED,excecao.getMessage());
    }

}
