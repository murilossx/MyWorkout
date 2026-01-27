package com.murilossx.myworkout.controller;

import com.murilossx.myworkout.model.Historico;
import com.murilossx.myworkout.repository.HistoricoRepository;
import com.murilossx.myworkout.repository.ExercicioRepository;
import com.murilossx.myworkout.repository.RotinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/treinos")
public class TreinoController {
    @Autowired
    private HistoricoRepository historicoRepository;
    @Autowired
    private ExercicioRepository exercicioRepository;
    @Autowired
    private RotinaRepository rotinaRepository;

    @PostMapping("/registrar")
    public Historico registrarTreino(@RequestBody Historico dados){
        return historicoRepository.save(dados);
    }

    @GetMapping("/ultimo/{idExercicio}")
    public Historico buscarUltimoRegistro(@PathVariable Long idExercicio) {
        List<Historico> lista = historicoRepository.findByExercicioIdOrderByDataHoraDesc(idExercicio);
        if(lista.isEmpty()) {
            return null;
        }
        return lista.get(0);
    }

    @GetMapping("/hoje/{idExercicio}")
    public List<Historico> buscarTreinosDeHoje(@PathVariable Long idExercicio) {
        java.time.LocalDateTime inicioDia = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime fimDia = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);
        return historicoRepository.findByExercicioIdAndDataHoraBetweenOrderByDataHoraAsc(idExercicio, inicioDia, fimDia);
    }

    @GetMapping("/evolucao/{idExercicio}")
    public List<Historico> buscarHistoricoParaGrafico(@PathVariable Long idExercicio) {
        return historicoRepository.findByExercicioIdOrderByDataHoraAsc(idExercicio);
    }

    @DeleteMapping("/{id}")
    public void apagarTreino(@PathVariable Long id) {
        historicoRepository.deleteById(id);
    }
}

