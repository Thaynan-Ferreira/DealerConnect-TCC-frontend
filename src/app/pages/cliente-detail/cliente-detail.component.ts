// src/app/pages/cliente-detail/cliente-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importa ferramentas de roteamento
import { Cliente, ClienteService } from '../../services/cliente.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Imports do Angular Material para um visual bonito
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatListModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule
  ],
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.css']
})
export class ClienteDetailComponent implements OnInit {
  
  // Usamos um Observable para lidar com os dados de forma assíncrona
  cliente$!: Observable<Cliente>;

  // Injetamos o ActivatedRoute para ler parâmetros da URL e o ClienteService para buscar dados
  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    // Criamos um "pipeline" de dados:
    // 1. Fica ouvindo as mudanças nos parâmetros da URL (route.paramMap)
    // 2. Para cada mudança, pega o parâmetro 'id'
    // 3. Usa o 'id' para chamar o serviço e buscar o cliente (switchMap)
    // 4. O resultado final é um Observable<Cliente> que é atribuído à nossa variável cliente$
    this.cliente$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.clienteService.getClienteById(id);
      })
    );
  }

  // Esta função será usada para pegar a cor do chip, igual na outra tela
  getCorClassificacao(classificacao: string): string {
    switch (classificacao) {
      case 'Potencial Alto': return 'primary';
      case 'Potencial Padrão': return 'accent';
      default: return 'basic';
    }
  }
}