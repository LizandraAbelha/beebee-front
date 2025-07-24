import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViagemService } from '../../services/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { Viagem } from '../../models/viagem';
import { ViagemAluno } from '../../models/viagem-aluno';
import { BeeRating } from '../../pages/bee-rating/bee-rating';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-viagem-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, BeeRating, FormsModule],
  templateUrl: './viagem-detail.html',
  styleUrl: './viagem-detail.css'
})
export class ViagemDetail implements OnInit {
  @ViewChild('solicitacaoModal') solicitacaoModal!: ElementRef;

  viagem: Viagem | null = null;
  alunoLogadoId: number = 0;
  pedidos: ViagemAluno[] = [];
  isMotorista: boolean = false;
  minhaSolicitacao: ViagemAluno | undefined = undefined;
  observacaoSolicitacao: string = '';

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router,
    private viagemAlunoService: ViagemAlunoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    const viagemId = this.route.snapshot.paramMap.get('id');

    if (viagemId) {
      this.carregarDetalhesViagem(Number(viagemId));
      this.carregarPedidos(Number(viagemId));
    } else {
      console.error('Nenhum ID de viagem encontrado na URL.');
      this.router.navigate(['/app/viagens']);
    }
  }

  carregarDetalhesViagem(id: number): void {
    this.viagemService.getById(id).subscribe({
      next: (data) => { this.viagem = data; this.isMotorista = this.alunoLogadoId === this.viagem.motoristaId; },
      error: (err) => { console.error('Falha ao carregar detalhes da viagem:', err); }
    });
  }

  carregarPedidos(viagemId: number): void {
    this.viagemAlunoService.getByViagemId(viagemId).subscribe(pedidos => {
      this.pedidos = pedidos;
      this.minhaSolicitacao = this.pedidos.find(p => p.alunoId === this.alunoLogadoId);
    });
  }

  iniciarViagem(): void {
    if (!this.viagem || !this.viagem.id) return;
    if (confirm('Tem a certeza que deseja iniciar a viagem?')) {
      this.viagemService.iniciar(this.viagem.id).subscribe({
        next: (viagemAtualizada) => {
          this.viagem = viagemAtualizada;
          alert('Viagem iniciada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao iniciar a viagem:', err);
          alert(`ERRO: ${err.error?.message || err.error || 'Não foi possível iniciar a viagem.'}`);
        }
      });
    }
  }

  encerrarViagem(): void {
    if (!this.viagem || !this.viagem.id) return;
    if (confirm('Tem a certeza de que deseja encerrar esta viagem para todos?')) {
      this.viagemService.encerrar(this.viagem.id).subscribe({
        next: (viagemAtualizada) => {
          this.viagem = viagemAtualizada;
          alert('Viagem encerrada com sucesso!');
          this.router.navigate(['/app/historico']);
        },
        error: (err) => {
          console.error('Erro ao encerrar a viagem:', err);
          alert(`ERRO: ${err.error?.message || err.error || 'Não foi possível encerrar a viagem.'}`);
        }
      });
    }
  }

  cancelarViagem(): void {
    if (!this.viagem || !this.viagem.id) return;
    if (confirm('Tem a certeza que deseja cancelar esta viagem? Esta ação não pode ser desfeita.')) {
      this.viagemService.cancelar(this.viagem.id).subscribe({
        next: (viagemAtualizada) => {
          this.viagem = viagemAtualizada;
          alert('Viagem cancelada com sucesso.');
          this.router.navigate(['/app/minhas-viagens']);
        },
        error: (err) => {
          console.error('Erro ao cancelar a viagem:', err);
          alert(`ERRO: ${err.error?.message || err.error || 'Não foi possível cancelar a viagem.'}`);
        }
      });
    }
  }

  gerirPedido(pedido: ViagemAluno, novoStatus: 'CONFIRMADA' | 'RECUSADA' | 'FINALIZADA'): void {
    if (!this.viagem || !pedido.id) return;
    const pedidoAtualizado: ViagemAluno = { ...pedido, situacao: novoStatus };
    this.viagemAlunoService.atualizarStatus(pedido.id, pedidoAtualizado).subscribe({
      next: () => {
        let acao = novoStatus.toLowerCase().replace('ada', 'ado');
        alert(`Pedido ${acao} com sucesso!`);
        this.carregarPedidos(this.viagem!.id!);
      },
      error: (err) => {
        console.error('Erro ao gerir pedido:', err);
        alert(`ERRO: ${err.error || 'Não foi possível atualizar o pedido.'}`);
      }
    });
  }

  solicitarParticipacao(): void {
    if (!this.viagem) return;
    const novaSolicitacao: Partial<ViagemAluno> = {
      situacao: 'SOLICITADA',
      alunoId: this.alunoLogadoId,
      viagem: this.viagem,
      observacao: this.observacaoSolicitacao
    };
    this.viagemAlunoService.solicitar(novaSolicitacao).subscribe({
      next: () => {
        alert('Participação solicitada com sucesso!');
        const modal = bootstrap.Modal.getInstance(this.solicitacaoModal.nativeElement);
        modal.hide();
        this.carregarPedidos(this.viagem!.id!);
        this.observacaoSolicitacao = '';
      },
      error: (err) => {
        console.error('Erro ao solicitar participação:', err);
        alert(`Erro: ${err.error.message || err.error}`);
      }
    });
  }

  finalizarCaronaPassageiro(pedido: ViagemAluno): void {
    if (!confirm('Tem a certeza de que deseja finalizar esta boleia para este passageiro?')) {
      return;
    }
    const pedidoFinalizado: ViagemAluno = { ...pedido, situacao: 'FINALIZADA' };
    this.viagemAlunoService.atualizarStatus(pedido.id!, pedidoFinalizado).subscribe(() => {
      alert('Boleia finalizada com sucesso!');
      this.carregarPedidos(this.viagem!.id!);
    });
  }
}
