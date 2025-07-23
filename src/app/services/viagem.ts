import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viagem } from '../models/viagem';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private apiUrl = 'http://localhost:8080/viagens';

  constructor(private http: HttpClient) { }

  salvar(viagem: Viagem): Observable<Viagem> {
    return this.http.post<Viagem>(this.apiUrl, viagem);
  }

  getAll(origem?: string, destino?: string, data?: string): Observable<Viagem[]> {
    let params = new HttpParams();
    if (origem) {
      params = params.append('origem', origem);
    }
    if (destino) {
      params = params.append('destino', destino);
    }
    if (data) {
      params = params.append('data', data);
    }

    return this.http.get<Viagem[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Viagem> {
    return this.http.get<Viagem>(`${this.apiUrl}/${id}`);
  }

  getByMotoristaId(motoristaId: number): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.apiUrl}/motorista/${motoristaId}`);
  }

  getHistoricoByMotoristaId(motoristaId: number): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.apiUrl}/historico/motorista/${motoristaId}`);
  }

  update(id: number, viagem: Viagem): Observable<Viagem> {
    return this.http.put<Viagem>(`${this.apiUrl}/${id}`, viagem);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
