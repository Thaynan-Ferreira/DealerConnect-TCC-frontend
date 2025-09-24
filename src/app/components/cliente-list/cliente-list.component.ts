import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Módulo comum para diretivas como *ngIf, *ngFor
import { Cliente, ClienteService } from '../../services/cliente.service';
import { MatTableModule } from '@angular/material/table'; // Módulo da tabela do Angular Material

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {
  // Propriedade para armazenar a lista de clientes recebida
  clientes: Cliente[] = [];
  // Define as colunas que serão exibidas na tabela
  colunasExibidas: string[] = ['nome', 'cpf_cnpj', 'email', 'telefone'];

  constructor(private clienteService: ClienteService) {}

  // Assim que o componente é iniciado, ele pede os dados ao service
  ngOnInit(): void {
    this.clienteService.getClientes().subscribe(dadosRecebidos => {
      this.clientes = dadosRecebidos;
      console.log('Dados dos clientes carregados com sucesso!', this.clientes);
    });
  }
}