import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';

// Imports do Angular Material e da Biblioteca de Gráficos
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgxChartsModule // Adiciona o módulo de gráficos
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Propriedades para armazenar os dados do dashboard
  stats?: DashboardStats;
  dadosGraficoSituacao: any[] = [];
  dadosGraficoClassificacao: any[] = [];

  // Define um esquema de cores para os gráficos
  esquemaDeCores: Color = {
    name: 'dealerConnectScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3f51b5', '#ff4081', '#4CAF50', '#F44336', '#FFC107'],
  };

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(dados => {
      this.stats = dados;
      
      // O ngx-charts espera os dados em um formato específico: { name: '...', value: ... }
      // Então, transforma os dados que vêm da API para este formato.
      this.dadosGraficoSituacao = dados.contagem_por_situacao.map(item => ({
        name: item.situacao,
        value: item.count
      }));
      
      this.dadosGraficoClassificacao = dados.contagem_por_classificacao.map(item => ({
        name: item.classificacao,
        value: item.count
      }));
    });
  }
}