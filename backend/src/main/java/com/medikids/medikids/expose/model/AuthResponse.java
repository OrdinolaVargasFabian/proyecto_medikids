package com.medikids.medikids.expose.model;

import com.medikids.medikids.process.dto.UsuarioDto;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
@Builder
public class AuthResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String token;
    private String message;
    private UsuarioDto usuario;
}
