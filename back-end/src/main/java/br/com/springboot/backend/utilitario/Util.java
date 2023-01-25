package br.com.springboot.backend.utilitario;

import java.util.InputMismatchException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Util {

    public static Boolean cnpjValido(String cnpj) {
        cnpj = cnpj.replace(".","");
        cnpj = cnpj.replace("-","");
        cnpj = cnpj.replace("/","");
        cnpj = cnpj.trim();
        if (cnpj.length() != 14)
            return false;
        if (cnpj.equals("00000000000000"))
            return false;
        if (cnpj.equals("11111111111111"))
            return false;
        if (cnpj.equals("22222222222222"))
            return false;
        if (cnpj.equals("33333333333333"))
            return false;
        if (cnpj.equals("44444444444444"))
            return false;
        if (cnpj.equals("55555555555555"))
            return false;
        if (cnpj.equals("66666666666666"))
            return false;
        if (cnpj.equals("77777777777777"))
            return false;
        if (cnpj.equals("88888888888888"))
            return false;
        if (cnpj.equals("99999999999999"))
            return false;
        try {
            char dig13, dig14;
            int sm, i, r, num, peso;
            sm = 0;
            peso = 2;
            for (i=11; i>=0; i--) {
                num = (int)(cnpj.charAt(i) - 48);
                sm = sm + (num * peso);
                peso = peso + 1;
                if (peso == 10)
                    peso = 2;
            }
            r = sm % 11;
            if ((r == 0) || (r == 1))
                dig13 = '0';
            else
                dig13 = (char)((11-r) + 48);
            sm = 0;
            peso = 2;
            for (i=12; i>=0; i--) {
                num = (int)(cnpj.charAt(i)- 48);
                sm = sm + (num * peso);
                peso = peso + 1;
                if (peso == 10)
                    peso = 2;
            }
            r = sm % 11;
            if ((r == 0) || (r == 1))
                dig14 = '0';
            else
                dig14 = (char)((11-r) + 48);
            if ((dig13 == cnpj.charAt(12)) && (dig14 == cnpj.charAt(13)))
                return true;
            else
                return false;
        }
        catch (InputMismatchException erro) {
            return false;
        }
    }

    public static Boolean cpfValido(String cpf) {
        cpf = cpf.replace(".","");
        cpf = cpf.replace("-","");
        cpf = cpf.trim();
        if (cpf.length() != 11)
            return false;
        if (cpf.equals("00000000000"))
            return false;
        if (cpf.equals("11111111111"))
            return false;
        if (cpf.equals("22222222222"))
            return false;
        if (cpf.equals("33333333333"))
            return false;
        if (cpf.equals("44444444444"))
            return false;
        if (cpf.equals("55555555555"))
            return false;
        if (cpf.equals("66666666666"))
            return false;
        if (cpf.equals("77777777777"))
            return false;
        if (cpf.equals("88888888888"))
            return false;
        if (cpf.equals("99999999999"))
            return false;
        char dig10, dig11;
        int sm, i, r, num, peso;
        try {
            sm = 0;
            peso = 10;
            for (i = 0;i < 9;i++) {
                num = cpf.charAt(i) - 48;
                sm = sm + (num * peso);
                peso = peso - 1;
            }
            r = 11 - (sm % 11);
            if (r == 10 || r == 11)
                dig10 = '0';
            else
                dig10 = (char)(r + 48);
            sm = 0;
            peso = 11;
            for(i = 0;i < 10;i++) {
                num = cpf.charAt(i) - 48;
                sm = sm + (num * peso);
                peso = peso - 1;
            }
            r = 11 - (sm % 11);
            if (r == 10 || r == 11)
                dig11 = '0';
            else
                dig11 = (char)(r + 48);
            if (dig10 == cpf.charAt(9) && dig11 == cpf.charAt(10))
                return true;
            return false;
        }
        catch (InputMismatchException erro) {
            return false;
        }
    }

    public static Boolean emailValido(String email) {
        Boolean ehValido = false;

        if (email != null && email.length() > 0) {
            String expressao = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
            Pattern padronizacao = Pattern.compile(expressao,Pattern.CASE_INSENSITIVE);
            Matcher combinacao = padronizacao.matcher(email);
            if (combinacao.matches())
                ehValido = true;
        }

        return ehValido;
    }

}
