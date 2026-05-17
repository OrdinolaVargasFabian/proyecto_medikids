package com.medikids.medikids.expose.model;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Setter
@Getter
public class RolRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id_rol;
    private String nombre_rol;
    
}
