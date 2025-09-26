import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define a "forma" dos dados que esperamos da nossa API de estatísticas
export interface DashboardStats {
  total_clientes: number;
  total_leads: number;
  contagem_por_situacao: { situacao: string, count: number }[];
  contagem_por_classificacao: { classificacao: string, count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/api/dashboard/stats/';

  constructor(private http: HttpClient) { }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}