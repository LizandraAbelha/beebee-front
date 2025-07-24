import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { VeiculoService } from '../../services/veiculo';
import { ViagemAluno } from '../../models/viagem-aluno';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { Aluno } from '../../models/aluno';
import { AlunoService } from '../../services/aluno';
import { Veiculo } from '../../models/veiculo';
import { AvaliacaoService } from '../../services/avaliacao';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit, OnDestroy, AfterViewInit {

  possuiVeiculos: boolean = false;
  filtroOrigem: string = '';
  filtroDestino: string = '';
  filtroData: string = '';

  viagemEmDestaque: ViagemAluno | null = null;
  motoristaDoDestaque: Aluno | null = null;
  veiculoDoDestaque: Veiculo | null = null;

  public environment = environment;
  private map: maplibregl.Map | undefined;

  constructor(
    private veiculoService: VeiculoService,
    private router: Router,
    private viagemAlunoService: ViagemAlunoService,
    private alunoService: AlunoService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    const alunoId = localStorage.getItem('aluno_id');
    if (alunoId) {
      this.verificarViagensAtivas(Number(alunoId));
      this.veiculoService.getVeiculosPorMotorista(Number(alunoId)).subscribe(veiculos => {
        this.possuiVeiculos = veiculos.length > 0;
      });
    }
  }

  verificarViagensAtivas(alunoId: number): void {
    this.viagemAlunoService.getByAlunoId(alunoId).subscribe(viagens => {
      const viagemAtiva = viagens.find(v => ['EM_ANDAMENTO', 'CONFIRMADA', 'SOLICITADA'].includes(v.situacao));

      if (viagemAtiva) {
        this.viagemEmDestaque = viagemAtiva;
        this.carregarDetalhesDestaque();
      } else {
        const viagensFinalizadas = viagens.filter(v => v.situacao === 'FINALIZADA');

        if (viagensFinalizadas.length === 0) {
          this.viagemEmDestaque = null;
          return;
        }

        const avaliacaoObservables = viagensFinalizadas.map(viagem =>
          this.avaliacaoService.getByViagemAlunoId(viagem.id!).pipe(
            catchError(() => of(undefined)),
            map(avaliacao => ({ ...viagem, avaliacao: avaliacao }))
          )
        );

        forkJoin(avaliacaoObservables).subscribe(viagensComAvaliacao => {
          const viagemParaAvaliar = viagensComAvaliacao.find(v =>
            !v.avaliacao || v.avaliacao.notaMotorista == null
          );

          this.viagemEmDestaque = viagemParaAvaliar || null;
          this.carregarDetalhesDestaque();
        });
      }
    });
  }

  carregarDetalhesDestaque(): void {
    if (!this.viagemEmDestaque) {
      this.motoristaDoDestaque = null;
      this.veiculoDoDestaque = null;
      return;
    }

    const motoristaId = this.viagemEmDestaque.viagem.motoristaId;
    this.alunoService.getById(motoristaId).subscribe(motorista => {
      this.motoristaDoDestaque = motorista;
    });

    this.veiculoService.getVeiculosPorMotorista(motoristaId).subscribe(veiculos => {
      if (veiculos && veiculos.length > 0) {
        this.veiculoDoDestaque = veiculos[0];
      }
    });
  }

  ngAfterViewInit(): void { this.initializeMap(); }
  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  initializeMap(): void {
    const apiKey = environment.locationiqToken;
    if (!apiKey || apiKey === 'COLE_SEU_TOKEN_AQUI') return;
    const styleUrl = `https://tiles.locationiq.com/v3/streets/vector.json?key=${apiKey}`;
    if (this.map) this.map.remove();
    this.map = new maplibregl.Map({
      container: 'global-map-background', style: styleUrl, center: [-42.65004, -19.53882], zoom: 14
    });
    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
  }

  procurarViagens(): void {
    this.router.navigate(['/app/viagens'], {
      queryParams: {
        origem: this.filtroOrigem,
        destino: this.filtroDestino,
        data: this.filtroData
      }
    });
  }

  getIniciais(nome: string | undefined): string {
    if (!nome) return '';
    const nomes = nome.split(' ').filter(Boolean);
    if (nomes.length === 0) return '';
    const primeiraLetra = nomes[0][0] || '';
    const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    const ultimaLetra = ultimoNome ? ultimoNome[0] : '';
    return `${primeiraLetra}${ultimaLetra}`.toUpperCase();
  }
}
