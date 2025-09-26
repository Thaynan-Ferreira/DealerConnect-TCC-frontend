// src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// A interface que define a estrutura de dados de um Cliente
export interface Cliente {
  pessoa_id: number;
  pessoa: {
    id: number;
    nome: string;
    cpf_cnpj: string;
    email: string;
    telefone: string;
  };
  classificacao: string;
  situacao: string;
}

// Criamos uma interface para representar a resposta paginada da API
export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Cliente[];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  createCliente(clienteData: any): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, clienteData);
  }
  // O endereço base da nossa API de clientes no Django
  private apiUrl = 'http://localhost:8000/api/clientes/';

  constructor(private http: HttpClient) { }

  // A função agora pode receber uma URL (para navegar entre as páginas)
  // e retorna um Observable do tipo ApiResponse.
  getClientes(url?: string, searchTerm?: string): Observable<ApiResponse> {
    const endpoint = url || this.apiUrl;
    
    // Se um termo de busca for fornecido, nós o adicionamos como um parâmetro na URL.
    let params = new HttpParams();
    if (searchTerm) {
      params = params.append('search', searchTerm);
    }

    // A requisição agora envia os parâmetros de busca para o back-end.
    return this.http.get<ApiResponse>(endpoint, { params });
  }


  
  /**
   * Busca os dados de um único cliente pelo seu ID.
   * Faz uma requisição GET para /api/clientes/{id}/
   * @param id O ID do cliente a ser buscado.
   */
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}${id}/`);
  }


  /**
   * Envia uma requisição para o back-end para rodar o modelo de ML
   * em um cliente específico.
   * Faz uma requisição POST para /api/clientes/{id}/classificar/
   * @param id O ID do cliente a ser classificado.
   */
  classificarCliente(id: number): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}${id}/classificar/`, {});
  }

  /**
   * Envia uma requisição para o back-end para mudar a situação
   * de atendimento de um cliente.
   * Faz uma requisição PATCH para /api/clientes/{id}/atualizar_situacao/
   * @param id O ID do cliente a ser atualizado.
   * @param novaSituacao A nova situação (ex: 'NEGOCIANDO').
   */
  atualizarSituacaoCliente(id: number, novaSituacao: string): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.apiUrl}${id}/atualizar_situacao/`, { situacao: novaSituacao });
  }
}