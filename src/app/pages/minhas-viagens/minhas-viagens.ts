import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Viagem } from '../../models/viagem';
import { ViagemAluno } from '../../models/viagem-aluno';
import { ViagemService } from '../../services/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { VeiculoService } from '../../services/veiculo';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-minhas-viagens',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './minhas-viagens.html',
  styleUrl: './minhas-viagens.css'
})
export class MinhasViagens implements OnInit {
  viagensComoMotorista: Viagem[] = [];
  viagensComoPassageiro: ViagemAluno[] = [];
  alunoLogadoId: number = 0;
  isMotorista: boolean = false;

  constructor(
    private viagemService: ViagemService,
    private viagemAlunoService: ViagemAlunoService,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      this.verificarSeEhMotorista();
      this.carregarViagensPassageiro();
    }
  }

  verificarSeEhMotorista(): void {
    this.veiculoService.getVeiculosPorMotorista(this.alunoLogadoId).subscribe(veiculos => {
      this.isMotorista = veiculos.length > 0;

      if (this.isMotorista) {
        this.carregarViagensMotorista();
      }
    });
  }

  carregarViagensMotorista(): void {
    this.viagemService.getByMotoristaId(this.alunoLogadoId).subscribe(data => {
      this.viagensComoMotorista = data.filter(viagem =>
        viagem.situacao !== 'CANCELADA' && viagem.situacao !== 'FINALIZADA'
      );
    });
  }

  carregarViagensPassageiro(): void {
    this.viagemAlunoService.getByAlunoId(this.alunoLogadoId).subscribe(data => {
      this.viagensComoPassageiro = data.filter(solicitacao =>
        solicitacao.situacao !== 'CANCELADA' && solicitacao.situacao !== 'FINALIZADA'
      );
    });
  }

}
