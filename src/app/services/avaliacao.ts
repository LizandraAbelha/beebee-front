import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private apiUrl = `${environment.backendUrl}/avaliacoes`;

  constructor(private http: HttpClient) { }

  getByViagemAlunoId(viagemAlunoId: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(`${this.apiUrl}/viagem-aluno/${viagemAlunoId}`);
  }

  salvar(avaliacao: Partial<Avaliacao>): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(this.apiUrl, avaliacao);
  }
}
