import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViagemService } from '../../services/viagem';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { Viagem } from '../../models/viagem';
import { ViagemAluno } from '../../models/viagem-aluno';
import { BeeRating } from '../../pages/bee-rating/bee-rating';

@Component({
  selector: 'app-viagem-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, BeeRating],
  templateUrl: './viagem-detail.html',
  styleUrl: './viagem-detail.css'
})
export class ViagemDetail implements OnInit {
  viagem: Viagem | null = null;
  alunoLogadoId: number = 0;
  pedidos: ViagemAluno[] = [];
  isMotorista: boolean = false;
  minhaSolicitacao: ViagemAluno | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private viagemService: ViagemService,
    private router: Router,
    private viagemAlunoService: ViagemAlunoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    const viagemId = this.route.snapshot.paramMap.get('id');

    console.log('ID da Viagem na URL:', viagemId);

    if (viagemId) {
      this.carregarDetalhesViagem(Number(viagemId));
      this.carregarPedidos(Number(viagemId));
    } else {
      console.error('Nenhum ID de viagem encontrado na URL.');
      alert('Não foi possível carregar a viagem. ID não encontrado.');
    }
  }

  carregarDetalhesViagem(id: number): void {
    this.viagemService.getById(id).subscribe({
      next: (data) => {
        console.log('Dados da viagem recebidos:', data);
        this.viagem = data;
        this.isMotorista = this.alunoLogadoId === this.viagem.motoristaId;
      },
      error: (err) => {
        console.error('Falha ao carregar detalhes da viagem:', err);
        alert('Ocorreu um erro ao carregar os detalhes da viagem. Verifique a consola para mais informações.');
        this.router.navigate(['/app/viagens']);
      }
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

    const viagemParaAtualizar: Viagem = {
      ...this.viagem,
      situacao: 'EM_ANDAMENTO'
    };

    this.viagemService.update(this.viagem.id, viagemParaAtualizar).subscribe({
      next: (viagemAtualizada) => {
        this.viagem = viagemAtualizada;
        alert('Viagem iniciada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao iniciar a viagem:', err);
        alert(`ERRO: Não foi possível iniciar a viagem. Motivo: ${err.error?.message || 'Erro desconhecido.'}`);
      }
    });
  }

  cancelarViagem(): void {
    if (!this.viagem || !this.viagem.id) return;

    if (confirm('Tem a certeza que deseja cancelar esta viagem? Esta ação não pode ser desfeita.')) {

      const viagemParaAtualizar: Viagem = {
        ...this.viagem,
        situacao: 'CANCELADA'
      };

      this.viagemService.update(this.viagem.id, viagemParaAtualizar).subscribe({
        next: () => {
          alert('Viagem cancelada com sucesso.');
          this.router.navigate(['/app/viagens']);
        },
        error: (err) => {
          console.error('Erro ao cancelar a viagem:', err);
          alert(`ERRO: Não foi possível cancelar a viagem. Motivo: ${err.error?.message || 'Erro desconhecido.'}`);
        }
      });
    }
  }


  gerirPedido(pedido: ViagemAluno, novoStatus: 'CONFIRMADA' | 'RECUSADA' | 'FINALIZADA'): void {
    if (!this.viagem || !pedido.id) return;

    const pedidoAtualizado: ViagemAluno = {
      ...pedido,
      situacao: novoStatus
    };

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
      viagem: this.viagem
    };

    this.viagemAlunoService.solicitar(novaSolicitacao).subscribe({
      next: () => {
        alert('Participação solicitada com sucesso!');
        this.carregarPedidos(this.viagem!.id!);
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

  finalizarCaronaMotorista(): void {
    if (!this.viagem || !confirm('Tem a certeza de que deseja finalizar esta viagem?')) {
      return;
    }
    const viagemAtualizada = { ...this.viagem, situacao: 'FINALIZADA' };
    this.viagemService.update(this.viagem.id!, viagemAtualizada).subscribe(viagemAtualizadaDoServidor => {
      this.viagem = viagemAtualizadaDoServidor;
      alert('Viagem finalizada com sucesso!');
      this.router.navigate(['/app/viagens']);
    });
  }

  encerrarViagem(): void {
    if (!this.viagem || !confirm('Tem a certeza de que deseja encerrar esta viagem para todos?')) {
      return;
    }
    const viagemAtualizada = { ...this.viagem, situacao: 'FINALIZADA' };
    this.viagemService.update(this.viagem.id!, viagemAtualizada).subscribe(viagemAtualizadaDoServidor => {
      this.viagem = viagemAtualizadaDoServidor;
      alert('Viagem encerrada com sucesso!');
    });
  }
}
