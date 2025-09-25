import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo comum para diretivas como *ngIf, *ngFor
import { Cliente, ClienteService } from '../../services/cliente.service';
import { MatTableModule } from '@angular/material/table'; // Módulo da tabela do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table'; // Importamos o DataSource


@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {
  
  // 1. A variável agora é 'dataSource' e já é inicializada como um objeto especial da tabela.
  dataSource = new MatTableDataSource<Cliente>();
  colunasExibidas: string[] = ['nome', 'cpf_cnpj', 'email', 'classificacao', 'acoes'];

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe(dados => {
      // 2. Os dados da API são colocados DENTRO do dataSource.
      this.dataSource.data = dados;
      // Nós ensinamos ao dataSource como ele deve filtrar os dados.
      this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
        // Criamos uma string única com todos os dados que queremos que sejam pesquisáveis.
        // Incluímos o nome, cpf e email do objeto aninhado 'pessoa'.
        const dataStr = (
          data.pessoa.nome +
          data.pessoa.cpf_cnpj +
          data.pessoa.email
        ).toLowerCase(); // Convertemos tudo para minúsculas
        
        // Retornamos true se o texto do filtro for encontrado na nossa string de dados.
        return dataStr.includes(filter);
      };
      // ------------------------------------

      console.log('Dados dos clientes carregados e filtro customizado aplicado!', this.dataSource.data);

    });
  }

  // 3. A função de filtro agora opera sobre 'dataSource', que existe e tem o método .filter.
  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  classificarCliente(clienteId: number): void {
    // Lógica para chamar a API de classificação (próximo passo)
    console.log(`Solicitando classificação para o cliente ID: ${clienteId}`);
    // this.clienteService.classificar(clienteId).subscribe(() => this.carregarClientes());
  }
  
  atualizarSituacao(clienteId: number): void {
    // Lógica para chamar a API de atualização (próximo passo)
    console.log(`Solicitando atualização de situação para o cliente ID: ${clienteId}`);
  }

  getCorClassificacao(classificacao: string): string {
    switch (classificacao) {
      case 'Potencial Alto': return 'primary';
      case 'Potencial Padrão': return 'accent';
      default: return 'basic';
    }
  }
}