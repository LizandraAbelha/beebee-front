import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HorarioAcademico } from '../models/horario-academico';

@Injectable({
  providedIn: 'root'
})
export class HorarioAcademicoService {
  private apiUrl = 'http://localhost:8080/horarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HorarioAcademico[]> {
    return this.http.get<HorarioAcademico[]>(this.apiUrl);
  }

  getByAlunoId(idAluno: number): Observable<HorarioAcademico[]> {
    return this.http.get<HorarioAcademico[]>(`${this.apiUrl}/aluno/${idAluno}`);
  }

  getById(id: number): Observable<HorarioAcademico> {
    return this.http.get<HorarioAcademico>(`${this.apiUrl}/${id}`);
  }

  salvar(horario: HorarioAcademico): Observable<HorarioAcademico> {
    return this.http.post<HorarioAcademico>(this.apiUrl, horario);
  }

  atualizar(id: number, horario: HorarioAcademico): Observable<HorarioAcademico> {
    return this.http.put<HorarioAcademico>(`${this.apiUrl}/${id}`, horario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
