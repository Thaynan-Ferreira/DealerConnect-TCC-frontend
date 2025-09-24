// src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos a "forma" dos dados de Cliente para o TypeScript
export interface Cliente {
  pessoa_id: number;
  pessoa: {
    id: number;
    nome: string;
    cpf_cnpj: string;
    email: string;
    telefone: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  // O endereço EXATO da nossa API Django
  private apiUrl = 'http://localhost:8000/api/clientes/';

  constructor(private http: HttpClient) { }

  // Função que busca a lista de clientes na API
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }
}