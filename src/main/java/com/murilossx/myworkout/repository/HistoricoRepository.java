package com.murilossx.myworkout.repository;

import com.murilossx.myworkout.model.Historico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface HistoricoRepository extends JpaRepository<Historico, Long> {
    List<Historico> findByExercicioIdOrderByDataHoraDesc(Long exercicioId);
    List<Historico> findByExercicioIdAndDataHoraBetweenOrderByDataHoraAsc(Long exercicioId, LocalDateTime inicio, LocalDateTime fim);
    List<Historico> findByExercicioIdOrderByDataHoraAsc(Long exercicioId);
}