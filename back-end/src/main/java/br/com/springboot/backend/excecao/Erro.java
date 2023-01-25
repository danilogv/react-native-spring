package br.com.springboot.backend.excecao;

import org.json.JSONObject;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.io.Serializable;

@ControllerAdvice
public class Erro implements Serializable {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> formataErro(ResponseStatusException ex) {
        HttpStatusCode statusCode = ex.getStatusCode();

        JSONObject json = new JSONObject();
        json.put("error",ex.getReason());
        json.put("status",statusCode.value());

        return new ResponseEntity<>(json.toString(),statusCode);
    }

}
