package br.com.springboot.backend.controle;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public interface ObjetoControle {

    default void geraExcecao(Exception ex) {
        if (ex instanceof ResponseStatusException) {
            HttpStatusCode status = ((ResponseStatusException) ex).getStatusCode();
            String msg = ((ResponseStatusException) ex).getReason();
            throw new ResponseStatusException(status,msg);
        }

        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Erro de servidor");
    }

}
