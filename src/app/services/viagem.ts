import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Viagem } from '../models/viagem';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private apiUrl = `${environment.backendUrl}/viagens`;

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

  update(id: number, viagem: ViagemDTO): Observable<Viagem> {
    return this.http.put<Viagem>(`${this.apiUrl}/${id}`, viagem);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  iniciar(id: number): Observable<Viagem> {
    return this.http.post<Viagem>(`${this.apiUrl}/${id}/iniciar`, {});
  }

  encerrar(id: number): Observable<Viagem> {
    return this.http.post<Viagem>(`${this.apiUrl}/${id}/encerrar`, {});
  }

  cancelar(id: number): Observable<Viagem> {
    return this.http.post<Viagem>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}

export interface ViagemDTO {
    id?: number;
    descricao?: string;
    dataInicio?: string;
    dataFim?: string;
    origem?: string;
    destino?: string;
    situacao?: string;
    motoristaId?: number;
    veiculoId?: number;
}
