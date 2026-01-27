package com.murilossx.myworkout.controller;

import com.murilossx.myworkout.model.Exercicio;
import com.murilossx.myworkout.repository.ExercicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercicios")
public class ExercicioController {

    @Autowired
    private ExercicioRepository repository;

    @GetMapping("/ola")
    public String dizerOla() {
        return "Olá! O Backend está funcionando!";
    }

    @GetMapping
    public List<Exercicio> listarTodos() {
        return repository.findAll();
    }

    @PostMapping("/exercicios")
    public Exercicio criar(@RequestBody Exercicio novoExercicio) {
        return repository.save(novoExercicio);
    }

    @GetMapping("/filtro")
    public List<Exercicio> filtrarPorGrupo(@RequestParam String grupo) {
        return repository.findByGrupoMuscular(grupo);
    }

}