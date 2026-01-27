package com.murilossx.myworkout.controller;

import com.murilossx.myworkout.model.Carga;
import com.murilossx.myworkout.repository.CargaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cargas")
public class CargaController {

    @Autowired
    private CargaRepository cargaRepository;

    @GetMapping
    public List<Carga> listarCargas() {
        return cargaRepository.findAll();
    }

    @PostMapping
    public Carga criarCarga(@RequestBody Carga carga) {
        return cargaRepository.save(carga);
    }
}
