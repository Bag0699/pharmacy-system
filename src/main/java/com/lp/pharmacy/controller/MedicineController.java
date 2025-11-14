package com.lp.pharmacy.controller;

import com.lp.pharmacy.model.dto.request.CreateMedicineRequest;
import com.lp.pharmacy.model.entity.Medicine;
import com.lp.pharmacy.service.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/medicines")
public class MedicineController {

  private static final String VIEW_FOLDER = "redirect:/medicine";
  private final MedicineService medicineService;

  // Lista todos los medicamentos
  @GetMapping
  public String getMedicines(Model model) {
    model.addAttribute("medicines", medicineService.findAll());
    return "medicine/list";
  }

  // Formulario para crear un nuevo medicamento
  @GetMapping("/new")
  public String newMedicineForm(Model model) {
    model.addAttribute("medicine", new Medicine());
    return "medicine/new";
  }

  // Crea un nuevo medicamento
  @PostMapping("/save")
  public String saveMedicine(@Valid @ModelAttribute("medicine") CreateMedicineRequest request) {
    medicineService.save(request);
    return VIEW_FOLDER;
  }

  // Formulario para editar un medicamento
  @GetMapping("/edit/{id}")
  public String editMedicineForm(@PathVariable Long id, Model model) {
    model.addAttribute("medicine", medicineService.findById(id));
    return "medicine/new";
  }

  // Actualiza un medicamento
  @PostMapping("/update/{id}")
  public String updateMedicine(
      @PathVariable Long id, @Valid @ModelAttribute("medicine") CreateMedicineRequest request) {

    medicineService.update(id, request);
    return VIEW_FOLDER;
  }

  // Elimina un medicamento
  @PostMapping("/delete/{id}")
  public String deleteMedicine(@PathVariable Long id) {
    medicineService.deleteById(id);
    return VIEW_FOLDER;
  }
}
