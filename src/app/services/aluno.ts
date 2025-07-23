import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aluno } from '../models/aluno';
import { AlterarSenhaDTO } from '../models/alterar-senha';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private apiUrl = 'http://localhost:8080/alunos';

  constructor(private http: HttpClient) { }

  cadastrar(aluno: any): Observable<any> {
    return this.http.post(this.apiUrl, aluno);
  }
  login(credenciais: any): Observable<any> {
    return this.http.post('http://localhost:8080/alunos/autenticar', credenciais);
  }

  getAll(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.apiUrl);
  }

  getById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl}/${id}`);
  }

  update(id: number, aluno: Partial<Aluno>): Observable<Aluno> {
    return this.http.put<Aluno>(`${this.apiUrl}/${id}`, aluno);
  }

  updatePassword(id: number, senhas: AlterarSenhaDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/senha`, senhas);
  }

  updateFoto(id: number, file: File): Observable<Aluno> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Aluno>(`${this.apiUrl}/${id}/foto`, formData);
  }
}
