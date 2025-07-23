// src/app/layouts/main-layout/main-layout.ts
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Aluno } from '../../models/aluno';
import { AlunoService } from '../../services/aluno';
import { Notificacao } from '../../models/notificacao';
import { NotificacaoService } from '../../services/notificacao';
import { Subscription, interval } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SidebarService } from '../../services/sidebar';
import { VeiculoService } from '../../services/veiculo';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout implements OnInit, OnDestroy, AfterViewInit {
  aluno: Aluno | null = null;
  notificacoes: Notificacao[] = [];
  unreadCount: number = 0;
  private notificacaoSubscription!: Subscription;
  private sidebarSubscription!: Subscription;
  isSidebarOpen = false;
  hasVehicles: boolean = false;

  public environment = environment;

  private map: maplibregl.Map | undefined;

  constructor(
    private router: Router,
    private alunoService: AlunoService,
    private notificacaoService: NotificacaoService,
    private sidebarService: SidebarService,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    this.sidebarSubscription = this.sidebarService.toggle$.subscribe(() => {
      this.isSidebarOpen = !this.isSidebarOpen;
    });

    const id = localStorage.getItem('aluno_id');
    if (id) {
      const alunoId = Number(id);
      this.alunoService.getById(alunoId).subscribe(data => {
        this.aluno = data;
      });
      this.carregarNotificacoes(alunoId);
      this.notificacaoSubscription = interval(30000).subscribe(() => {
        this.carregarNotificacoes(alunoId);
      });
      this.checkUserVehicles(alunoId);
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.notificacaoSubscription) {
      this.notificacaoSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }

  closeSidebar(): void {
    if (this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getIniciais(): string {
    const nome = this.aluno?.nome;
    if (!nome) return '';
    const nomes = nome.split(' ').filter(Boolean);
    if (nomes.length === 0) return '';
    const primeiroNome = nomes[0];
    const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    const primeiraLetra = primeiroNome[0];
    const ultimaLetra = ultimoNome ? ultimoNome[0] : '';
    return `${primeiraLetra}${ultimaLetra}`.toUpperCase();
  }

  carregarNotificacoes(alunoId: number): void {
    if (alunoId > 0) {
      this.notificacaoService.getNotificacoes(alunoId).subscribe(data => {
        this.notificacoes = data;
        this.unreadCount = this.notificacoes.filter(n => !n.lida).length;
      });
    }
  }

  checkUserVehicles(alunoId: number): void {
    this.veiculoService.getVeiculosPorMotorista(alunoId).subscribe(veiculos => {
      this.hasVehicles = veiculos && veiculos.length > 0;
    });
  }

  initializeMap(): void {
    const apiKey = environment.locationiqToken;

    if (!apiKey || apiKey === 'COLE_SEU_TOKEN_AQUI') {
      console.error('Token do LocationIQ não configurado em environment.ts');
      return;
    }

    const styleUrl = `https://tiles.locationiq.com/v3/streets/vector.json?key=${apiKey}`;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    this.map = new maplibregl.Map({
      container: 'global-map-background',
      style: styleUrl,
      center: [-42.65004, -19.53882],
      zoom: 14,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

    this.map.on('load', () => console.log('Mapa carregado com sucesso!'));
    this.map.on('error', (e) => console.error('Erro no mapa:', e.error));
  }

  logout() {
    this.toggleSidebar();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
