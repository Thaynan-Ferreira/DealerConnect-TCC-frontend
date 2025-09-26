import { Routes } from '@angular/router';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';
import { ClienteDetailComponent } from './pages/cliente-detail/cliente-detail.component'; // (será criado a seguir)

export const routes: Routes = [
  // A rota principal (/) carrega a lista de clientes
  { path: '', component: ClienteListComponent },
  
  // Uma rota como /clientes/123 vai carregar o componente de detalhes.
  // O ':id' é um parâmetro dinâmico, que vamos usar para saber qual cliente buscar.
  { path: 'clientes/:id', component: ClienteDetailComponent }
];