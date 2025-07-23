import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ViagemAluno } from '../models/viagem-aluno';

@Injectable({
  providedIn: 'root'
})
export class ViagemAlunoService {
  private apiUrl = 'http://localhost:8080/viagens-alunos';

  constructor(private http: HttpClient) { }

  getByViagemId(viagemId: number): Observable<ViagemAluno[]> {
    return this.http.get<ViagemAluno[]>(`${this.apiUrl}/viagem/${viagemId}`);
  }

  solicitar(solicitacao: Partial<ViagemAluno>): Observable<ViagemAluno> {
    return this.http.post<ViagemAluno>(this.apiUrl, solicitacao);
  }

  atualizarStatus(id: number, payload: ViagemAluno): Observable<ViagemAluno> {
    return this.http.put<ViagemAluno>(`${this.apiUrl}/${id}`, payload);
  }

  getByAlunoId(alunoId: number): Observable<ViagemAluno[]> {
    return this.http.get<ViagemAluno[]>(`${this.apiUrl}/aluno/${alunoId}`);
  }
}
