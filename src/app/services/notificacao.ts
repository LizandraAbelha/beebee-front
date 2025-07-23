import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacao } from '../models/notificacao';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  private apiUrl = 'http://localhost:8080/notificacoes';

  constructor(private http: HttpClient) { }

  getNotificacoes(destinatarioId: number): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${this.apiUrl}/aluno/${destinatarioId}`);
  }

  marcarComoLida(notificacaoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${notificacaoId}/lida`, {});
  }
}
