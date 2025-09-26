// src/app/app.routes.ts

import { Routes } from '@angular/router';

// Importamos todos os componentes que servirão como páginas
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { ClienteDetailComponent } from './pages/cliente-detail/cliente-detail.component';
import { ClienteFormComponent } from './pages/cliente-form/cliente-form.component';

export const routes: Routes = [
  // Rota Principal: Quando o usuário acessa "/", carrega o Dashboard.
  { 
    path: '', 
    component: DashboardComponent 
  },
  
  // Rota da Lista de Clientes: Acessada via "/clientes".
  { 
    path: 'clientes', 
    component: ClienteListComponent 
  },

  // Rota do Formulário de Cadastro: Acessada via "/clientes/novo".
  // É importante que ela venha ANTES da rota de detalhes, para não confundir o roteador.
  { 
    path: 'clientes/novo', 
    component: ClienteFormComponent 
  },

  // Rota de Detalhes do Cliente: Acessada via "/clientes/123", por exemplo.
  { 
    path: 'clientes/:id', 
    component: ClienteDetailComponent 
  }
];