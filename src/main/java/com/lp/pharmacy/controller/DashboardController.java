package com.lp.pharmacy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

  @GetMapping("/")
  public String dashboard() {
    return "dashboard";
  }

  @GetMapping("/dashboard")
  public String dashboardAlt() {
    return "dashboard";
  }
}
