package com.lp.pharmacy.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sale_details")
public class SaleDetail {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Integer quantity;

  @Column(name = "unit_price")
  private BigDecimal unitPrice;

  @Column(name = "sub_total")
  private BigDecimal subTotal;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sale_id", nullable = false)
  private Sale sale;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "medicine_id", nullable = false)
  private Medicine medicine;
}
