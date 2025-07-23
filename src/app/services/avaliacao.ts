import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/avaliacao';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {
  private apiUrl = 'http://localhost:8080/avaliacoes';

  constructor(private http: HttpClient) { }

  getByViagemAlunoId(viagemAlunoId: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(`${this.apiUrl}/viagem-aluno/${viagemAlunoId}`);
  }
  
  salvar(avaliacao: Partial<Avaliacao>): Observable<Avaliacao> {
    return this.http.post<Avaliacao>(this.apiUrl, avaliacao);
  }
}
