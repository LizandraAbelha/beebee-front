import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViagemAluno } from '../../models/viagem-aluno';
import { Viagem } from '../../models/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { ViagemService } from '../../services/viagem';
import { VeiculoService } from '../../services/veiculo';
import { AvaliacaoService } from '../../services/avaliacao';
import { Avaliacao } from '../../models/avaliacao';
import { BeeRating } from '../../pages/bee-rating/bee-rating';

declare var bootstrap: any;

interface ViagemComPassageiros extends Viagem {
  passageiros?: ViagemAluno[];
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    BeeRating
  ],
  templateUrl: './historico.html',
  styleUrl: './historico.css'
})
export class Historico implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('avaliacaoModal') avaliacaoModal!: ElementRef;

  historicoMotorista: ViagemComPassageiros[] = [];
  historicoPassageiro: ViagemAluno[] = [];
  alunoLogadoId: number = 0;
  isMotorista: boolean = false;

  avaliacaoAtual: ViagemAluno | null = null;
  roleAvaliacao: 'motorista' | 'passageiro' | null = null;
  avaliacaoParaEnviar: Partial<Avaliacao> = {};

  private modalInstance: any;

  constructor(
    private viagemService: ViagemService,
    private viagemAlunoService: ViagemAlunoService,
    private veiculoService: VeiculoService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      this.verificarSeEhMotorista();
      this.carregarHistoricoPassageiro();
    }
  }

  ngAfterViewInit(): void {
    if (this.avaliacaoModal) {
      this.modalInstance = new bootstrap.Modal(this.avaliacaoModal.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }

  verificarSeEhMotorista(): void {
    this.veiculoService.getVeiculosPorMotorista(this.alunoLogadoId).subscribe(veiculos => {
      this.isMotorista = veiculos.length > 0;
      if (this.isMotorista) {
        this.carregarHistoricoMotorista();
      }
    });
  }

  carregarHistoricoMotorista(): void {
    this.viagemService.getHistoricoByMotoristaId(this.alunoLogadoId).subscribe(viagens => {
      this.historicoMotorista = viagens;
      this.historicoMotorista.forEach(viagem => {
        if (viagem.id && viagem.situacao === 'FINALIZADA') {
          this.viagemAlunoService.getByViagemId(viagem.id).subscribe(passageiros => {
            viagem.passageiros = passageiros.filter(p => p.situacao === 'FINALIZADA');
            viagem.passageiros.forEach(passageiro => {
              if (passageiro.id) {
                this.avaliacaoService.getByViagemAlunoId(passageiro.id).subscribe(avaliacao => {
                  passageiro.avaliacao = avaliacao;
                });
              }
            });
          });
        }
      });
    });
  }

  carregarHistoricoPassageiro(): void {
    this.viagemAlunoService.getByAlunoId(this.alunoLogadoId).subscribe(data => {
      this.historicoPassageiro = data.filter(item =>
        item.situacao === 'FINALIZADA' || item.situacao === 'CANCELADA' || item.situacao === 'RECUSADA'
      );
      this.historicoPassageiro.forEach(item => {
        if (item.id && item.situacao === 'FINALIZADA') {
          this.avaliacaoService.getByViagemAlunoId(item.id).subscribe(avaliacao => {
            item.avaliacao = avaliacao;
          });
        }
      });
    });
  }

  abrirModalAvaliacao(viagemAluno: ViagemAluno, role: 'motorista' | 'passageiro'): void {
    this.avaliacaoAtual = viagemAluno;
    this.roleAvaliacao = role;
    if (role === 'motorista') {
        this.avaliacaoParaEnviar = { notaMotorista: undefined, comentarioMotorista: '' };
    } else {
        this.avaliacaoParaEnviar = { notaCaronista: undefined, comentarioCaronista: '' };
    }
    this.modalInstance?.show();
  }

  salvarAvaliacao(): void {
    if (!this.avaliacaoAtual?.id) return;
    this.avaliacaoParaEnviar.viagemAlunoId = this.avaliacaoAtual.id;
    this.avaliacaoService.salvar(this.avaliacaoParaEnviar).subscribe({
      next: () => {
        alert('Avaliação enviada com sucesso!');
        this.modalInstance?.hide();
        this.carregarHistoricoPassageiro();
        if (this.isMotorista) {
          this.carregarHistoricoMotorista();
        }
      },
      error: (err) => {
        console.error('Erro ao guardar avaliação:', err);
        alert(`Erro: ${err.error?.message || err.error || 'Não foi possível enviar a sua avaliação.'}`);
      }
    });
  }
}
