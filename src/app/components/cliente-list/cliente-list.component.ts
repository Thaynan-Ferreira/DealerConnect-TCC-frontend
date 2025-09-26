import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse, Cliente, ClienteService } from '../../services/cliente.service';

// Módulos do Angular Material que estamos usando
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Import do Paginador

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
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule // Adiciona o módulo do paginador aqui
  ],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  
  dataSource = new MatTableDataSource<Cliente>();
  colunasExibidas: string[] = ['nome', 'cpf_cnpj', 'email', 'classificacao', 'situacao', 'acoes'];
  carregandoAcao: { [key: number]: boolean } = {};
  opcoesSituacao = ['NOVO', 'NEGOCIANDO', 'VENDIDO', 'PERDIDO'];
  totalDeClientes = 0;

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(url?: string): void {
    this.clienteService.getClientes(url).subscribe((response: ApiResponse) => {
      this.dataSource.data = response.results;
      this.totalDeClientes = response.count;
      
      this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
        const dataStr = (
          data.pessoa.nome +
          data.pessoa.cpf_cnpj +
          data.pessoa.email
        ).toLowerCase();
        return dataStr.includes(filter);
      };
    });
  }

  onPageChange(event: PageEvent): void {
    // A API do Django usa page numbers (começando em 1), enquanto o paginator do Angular usa pageIndex (começando em 0)
    const page = event.pageIndex + 1;
    const url = `${this.clienteService['apiUrl']}?page=${page}&page_size=${event.pageSize}`;
    this.carregarClientes(url);
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  classificarCliente(clienteId: number): void {
    this.carregandoAcao[clienteId] = true;
    this.clienteService.classificarCliente(clienteId).subscribe({
      next: (clienteAtualizado) => {
        this.atualizarClienteNaTabela(clienteAtualizado);
        this.abrirNotificacao('Cliente classificado com sucesso!', 'sucesso');
        this.carregandoAcao[clienteId] = false;
      },
      error: (err) => {
        console.error('Erro ao classificar cliente', err);
        this.abrirNotificacao('Erro ao classificar cliente.', 'erro');
        this.carregandoAcao[clienteId] = false;
      }
    });
  }
  
  atualizarSituacao(clienteId: number, novaSituacao: string): void {
    this.carregandoAcao[clienteId] = true;
    this.clienteService.atualizarSituacaoCliente(clienteId, novaSituacao).subscribe({
      next: (clienteAtualizado) => {
        this.atualizarClienteNaTabela(clienteAtualizado);
        this.abrirNotificacao(`Situação atualizada para ${clienteAtualizado.situacao}!`, 'sucesso');
        this.carregandoAcao[clienteId] = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar situação', err);
        this.abrirNotificacao('Erro ao atualizar situação.', 'erro');
        this.carregandoAcao[clienteId] = false;
      }
    });
  }
  
  private atualizarClienteNaTabela(clienteAtualizado: Cliente): void {
    const index = this.dataSource.data.findIndex(c => c.pessoa_id === clienteAtualizado.pessoa_id);
    if (index > -1) {
      const dadosAtuais = this.dataSource.data;
      dadosAtuais[index] = clienteAtualizado;

      // A "mágica" está aqui: criamos um NOVO array usando o spread operator (...)
      // Isso garante que o Angular detecte a mudança e atualize a tabela instantaneamente.
      this.dataSource.data = [...dadosAtuais];
    }
  }

  private abrirNotificacao(mensagem: string, tipo: 'sucesso' | 'erro'): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      panelClass: tipo === 'sucesso' ? 'snackbar-sucesso' : 'snackbar-erro'
    });
  }

  getCorClassificacao(classificacao: string): string {
    switch (classificacao) {
      case 'Potencial Alto': return 'primary';
      case 'Potencial Padrão': return 'accent';
      default: return 'basic';
    }
  }
}