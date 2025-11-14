package com.lp.pharmacy.repository;

import com.lp.pharmacy.model.entity.Pharmacist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PharmacistRepository extends JpaRepository<Pharmacist, Long> {

    Optional<Pharmacist> findByUsername(String username);
}
