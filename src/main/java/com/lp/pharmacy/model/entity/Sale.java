package com.lp.pharmacy.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sales")
public class Sale {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "sale_date")
  private LocalDateTime saleDate;

  @Column(name = "total_amount")
  private BigDecimal totalAmount;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pharmacist_id", nullable = false)
  private Pharmacist pharmacist;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "customer_id", nullable = false)
  private Customer customer;

  @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<SaleDetail> saleDetails = new ArrayList<>();
}
