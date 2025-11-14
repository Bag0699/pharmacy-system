package com.lp.pharmacy.controller;

import com.lp.pharmacy.model.dto.request.CreatePharmacistRequest;
import com.lp.pharmacy.model.entity.Pharmacist;
import com.lp.pharmacy.service.PharmacistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/pharmacists")
public class PharmacistController {

  private static final String VIEW_FOLDER = "redirect:/pharmacists";
  private final PharmacistService pharmacistService;

  // Lista todos los farmacéuticos
  @GetMapping
  public String getPharmacists(Model model) {
    model.addAttribute("pharmacists", pharmacistService.findAll());
    return "pharmacist/list";
  }

  // Formulario para crear un nuevo farmacéutico
  @GetMapping("/new")
  public String newPharmacistForm(Model model) {
    model.addAttribute("pharmacist", new Pharmacist());
    return "pharmacist/new";
  }

  // Crea un nuevo farmacéutico
  @PostMapping("/save")
  public String savePharmacist(
      @Valid @ModelAttribute("pharmacist") CreatePharmacistRequest request) {
    pharmacistService.save(request);
    return VIEW_FOLDER;
  }

  // Formulario para editar un farmacéutico
  @GetMapping("/edit/{id}")
  public String editPharmacistForm(@PathVariable Long id, Model model) {
    model.addAttribute("pharmacist", pharmacistService.findById(id));
    return "pharmacist/new";
  }

  // Actualizar un farmacéutico
  @PostMapping("/update/{id}")
  public String updatePharmacist(
      @PathVariable Long id, @Valid @ModelAttribute CreatePharmacistRequest request) {

    pharmacistService.update(id, request);
    return VIEW_FOLDER;
  }

  // Elimina un farmacéutico
  @PostMapping("/delete/{id}")
  public String deletePharmacist(@PathVariable Long id) {
    pharmacistService.deleteById(id);
    return VIEW_FOLDER;
  }
}
