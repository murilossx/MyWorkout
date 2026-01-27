package com.murilossx.myworkout.controller;

import com.murilossx.myworkout.model.Rotina;
import com.murilossx.myworkout.repository.RotinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rotinas")
public class RotinaController {

    @Autowired
    private RotinaRepository rotinaRepository;

    @Autowired
    private com.murilossx.myworkout.repository.ExercicioRepository exercicioRepository;

    // 1. Criar uma nova Rotina (Ex: "Treino A")
    @PostMapping
    public Rotina criarRotina(@RequestBody Rotina rotina) {
        return rotinaRepository.save(rotina);
    }

    // 2. Listar todas as rotinas (Vai trazer os exercícios juntos)
    @GetMapping
    public List<Rotina> listarRotinas() {
        return rotinaRepository.findAll();
    }

    @PostMapping("/{idRotina}/adicionar/{idExercicio}")
    public Rotina adicionarExercicioNaRotina(@PathVariable Long idRotina, @PathVariable Long idExercicio) {

        // 1. Busca a Rotina no banco
        Rotina rotina = rotinaRepository.findById(idRotina).orElseThrow();

        // 2. Busca o Exercício no banco
        com.murilossx.myworkout.model.Exercicio exercicio = exercicioRepository.findById(idExercicio).orElseThrow();

        // 3. Adiciona na lista
        rotina.getExercicios().add(exercicio);

        // 4. Salva a Rotina atualizada
        return rotinaRepository.save(rotina);
    }

    @GetMapping("/{id}")
    public Rotina buscarPorId(@PathVariable Long id) {
        return rotinaRepository.findById(id).orElse(null);
    }


    @DeleteMapping("/{idRotina}/remover/{idExercicio}")
    public Rotina removerExercicioDaRotina(@PathVariable Long idRotina, @PathVariable Long idExercicio) {

        Rotina rotina = rotinaRepository.findById(idRotina).orElseThrow();

        rotina.getExercicios().removeIf(ex -> ex.getId().equals(idExercicio));

        return rotinaRepository.save(rotina);
    }

    @PutMapping("/{id}")
    public Rotina atualizarRotina(@PathVariable Long id, @RequestBody Rotina rotinaAtualizada) {
        Rotina rotina = rotinaRepository.findById(id).orElseThrow();
        rotina.setNome(rotinaAtualizada.getNome());
        return rotinaRepository.save(rotina);
    }

    @DeleteMapping("/{id}")
    public void deletarRotina(@PathVariable Long id) {
        rotinaRepository.deleteById(id);
    }
}