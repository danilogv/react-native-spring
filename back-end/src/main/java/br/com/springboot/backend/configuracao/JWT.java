package br.com.springboot.backend.configuracao;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.xml.bind.DatatypeConverter;
import java.util.Date;

@Component
public class JWT {

    @Value("${jwt.auth.app}")
    private String appName;

    @Value("${jwt.auth.secret_key}")
    private String secretKey;

    @Value("${jwt.auth.expires_in}")
    private int expiresIn;

    private final SignatureAlgorithm ASSINATURA = SignatureAlgorithm.HS256;

    private Claims obtemTodasReinvidicacoesToken(String token) {
        Claims reinvidicacoes;

        try {
            reinvidicacoes = Jwts.parser().setSigningKey(DatatypeConverter.parseBase64Binary(this.secretKey)).parseClaimsJws(token).getBody();
        }
        catch (Exception ex) {
            reinvidicacoes = null;
        }

        return reinvidicacoes;
    }

    public String obtemLoginDoToken(String token) {
        String nomeUsuario;

        try {
            Claims reinvidicacoes = this.obtemTodasReinvidicacoesToken(token);
            nomeUsuario = reinvidicacoes.getSubject();
        }
        catch (Exception ex) {
            nomeUsuario = null;
        }

        return nomeUsuario;
    }

    public String gerarToken(String nomeUsuario) {
        return Jwts.builder()
                .setIssuer(this.appName)
                .setSubject(nomeUsuario)
                .setIssuedAt(new Date())
                .setExpiration(gerarDataExpiracao())
                .signWith(this.ASSINATURA,this.secretKey)
                .compact()
                ;
    }

    public Boolean validaToken(String token,UserDetails usuario) {
        String nomeUsuario = obtemLoginDoToken(token);
        if (nomeUsuario != null && nomeUsuario.equals(usuario.getUsername()) && !tokenExpirou(token))
            return true;
        return false;
    }

    public String obtemToken(HttpServletRequest requisicao) {
        String autenticacaoCabecalho = obtemAutenticacaoCabecalho(requisicao);

        if (autenticacaoCabecalho != null && autenticacaoCabecalho.startsWith("Bearer "))
            return autenticacaoCabecalho.substring(7);

        return null;
    }

    private Date gerarDataExpiracao() {
        return new Date(new Date().getTime() + this.expiresIn * 1000L);
    }

    private Boolean tokenExpirou(String token) {
        Date dataExpiracao = obtemDataExpiracao(token);
        return dataExpiracao.before(new Date());
    }

    private Date obtemDataExpiracao(String token) {
        Date dataExpiracao;

        try {
            Claims claims = this.obtemTodasReinvidicacoesToken(token);
            dataExpiracao = claims.getExpiration();
        }
        catch (Exception ex) {
            dataExpiracao = null;
        }

        return dataExpiracao;
    }

    private String obtemAutenticacaoCabecalho(HttpServletRequest requisicao) {
        return requisicao.getHeader("Authorization");
    }

}
