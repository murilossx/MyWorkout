package com.murilossx.myworkout.repository;

import com.murilossx.myworkout.model.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {

    List<Exercicio> findByGrupoMuscular(String grupoMuscular);

}


