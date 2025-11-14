package com.lp.pharmacy.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "medicines")
public class Medicine {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;

  private BigDecimal price;

  private Integer stock;

  @Column(name = "expiration_date")
  private LocalDate expirationDate;

  @OneToMany(mappedBy = "medicine")
  private List<SaleDetail> saleDetails;
}
