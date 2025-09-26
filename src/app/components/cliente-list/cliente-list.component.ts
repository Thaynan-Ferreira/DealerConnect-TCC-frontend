import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common';
import { ApiResponse, Cliente, ClienteService } from '../../services/cliente.service';
import { RouterLink } from '@angular/router';

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
    MatPaginatorModule,
    RouterLink
  ],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit, OnDestroy {
  
  dataSource = new MatTableDataSource<Cliente>();
  colunasExibidas: string[] = ['nome', 'cpf_cnpj', 'email', 'classificacao', 'situacao', 'acoes'];
  carregandoAcao: { [key: number]: boolean } = {};
  opcoesSituacao = ['NOVO', 'NEGOCIANDO', 'VENDIDO', 'PERDIDO'];
  totalDeClientes = 0;

  // Um Subject é como um "canal" onde podemos enviar os termos de busca.
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  // Guarda o termo de busca atual para ser usado na paginação.
  private termoBuscaAtual = '';

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
    // Configuramos o "debounce": esperamos 300ms após o usuário parar de digitar
    // e só enviamos a busca se o texto for diferente do anterior.
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.termoBuscaAtual = searchTerm;
      this.carregarClientes(); // Recarrega os clientes com o novo termo de busca
    });
  }

  ngOnDestroy(): void {
    // É uma boa prática "cancelar a inscrição" para evitar vazamentos de memória.
    this.searchSubscription?.unsubscribe();
  }

  carregarClientes(): void {
    this.clienteService.getClientes(undefined, this.termoBuscaAtual).subscribe((response: ApiResponse) => {
      this.dataSource.data = response.results;
      this.totalDeClientes = response.count;
      // NÃO PRECISO MAIS do filterPredicate aqui, pois a filtragem é no back-end.
    });
  }

  // Agora, a paginação também envia o termo de busca atual.
  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    let url = `${this.clienteService['apiUrl']}?page=${page}&page_size=${event.pageSize}`;
    if (this.termoBuscaAtual) {
      url += `&search=${this.termoBuscaAtual}`;
    }
    this.clienteService.getClientes(url).subscribe((response: ApiResponse) => {
        this.dataSource.data = response.results;
        this.totalDeClientes = response.count;
    });
  }

  // Em vez de filtrar, agora ela envia o valor digitado para o nosso "canal" (Subject).
  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue.trim().toLowerCase());
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