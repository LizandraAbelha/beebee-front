import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Veiculo } from '../models/veiculo';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private apiUrl = 'http://localhost:8080/veiculos';

  private _possuiVeiculos = new BehaviorSubject<boolean>(false);
  public readonly possuiVeiculos$ = this._possuiVeiculos.asObservable();

  constructor(private http: HttpClient) { }

  verificarVeiculos(motoristaId: number): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.apiUrl}/motorista/${motoristaId}`).pipe(
      tap(veiculos => {
        this._possuiVeiculos.next(veiculos.length > 0);
      })
    );
  }

  notificarVeiculoAdicionado() {
    this._possuiVeiculos.next(true);
  }

  getVeiculosPorMotorista(motoristaId: number): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.apiUrl}/motorista/${motoristaId}`);
  }

  getVeiculoPorId(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.apiUrl}/${id}`);
  }

  salvar(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.post<Veiculo>(this.apiUrl, veiculo);
  }

  atualizar(id: number, veiculo: Veiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.apiUrl}/${id}`, veiculo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
