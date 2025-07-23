import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
import { Viagem } from '../../models/viagem';
import { ViagemService } from '../../services/viagem';
import { VeiculoService } from '../../services/veiculo';

@Component({
  selector: 'app-viagem-list',
  standalone: true,
  imports: [ CommonModule, RouterLink, DatePipe, FormsModule ],
  templateUrl: './viagem-list.html',
})
export class ViagemList implements OnInit {
  viagens: Viagem[] = [];
  filtroOrigem: string = '';
  filtroDestino: string = '';
  filtroData: string = '';
  isMotorista: boolean = false;
  alunoLogadoId: number = 0;

  constructor(
    private viagemService: ViagemService,
    private veiculoService: VeiculoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filtroOrigem = params['origem'] || '';
      this.filtroDestino = params['destino'] || '';
      this.filtroData = params['data'] || '';

      this.procurarViagens();
    });

    const id = localStorage.getItem('aluno_id');
    if (id) {
      this.alunoLogadoId = Number(id);
      this.verificarSeEhMotorista();
    }
  }

  procurarViagens(): void {
    this.viagemService.getAll(this.filtroOrigem, this.filtroDestino, this.filtroData).subscribe({
      next: (data) => {
        this.viagens = data;
      },
      error: (err) => {
        console.error('Erro ao procurar viagens:', err);
        alert('Não foi possível carregar a lista de viagens.');
      }
    });
  }

  limparFiltros(): void {
    this.filtroOrigem = '';
    this.filtroDestino = '';
    this.filtroData = '';
    this.procurarViagens();
  }

  verificarSeEhMotorista(): void {
    if (this.alunoLogadoId > 0) {
      this.veiculoService.getVeiculosPorMotorista(this.alunoLogadoId).subscribe(veiculos => {
        this.isMotorista = veiculos && veiculos.length > 0;
      });
    }
  }
}
