import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Aluno } from '../../models/aluno';
import { AlunoService } from '../../services/aluno';
import { BeeRating } from '../../pages/bee-rating/bee-rating';
import { FormsModule } from '@angular/forms';
import { AlterarSenhaDTO } from '../../models/alterar-senha';
import { ViagemAlunoService } from '../../services/viagem-aluno';
import { ViagemService } from '../../services/viagem';
import { AvaliacaoService } from '../../services/avaliacao';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ViagemAluno } from '../../models/viagem-aluno';
import { Viagem } from '../../models/viagem';

interface AvaliacaoDisplay {
  nomeAvaliador: string;
  nota: number;
  comentario: string;
}

declare var bootstrap: any;

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, BeeRating, FormsModule],
  templateUrl: './meu-perfil.html',
  styleUrls: ['./meu-perfil.css']
})
export class MeuPerfil implements OnInit {
  @ViewChild('alterarSenhaModal') alterarSenhaModal!: ElementRef;

  aluno: Aluno | null = null;
  alunoLogadoId: number = 0;
  isEditMode = false;
  alunoEdit: Partial<Aluno> = {};
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';

  avaliacoesComoMotorista: AvaliacaoDisplay[] = [];
  avaliacoesComoPassageiro: AvaliacaoDisplay[] = [];

  constructor(
    private alunoService: AlunoService,
    private viagemService: ViagemService,
    private viagemAlunoService: ViagemAlunoService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      this.carregarDadosAluno();
      this.carregarAvaliacoes();
    }
  }

  carregarDadosAluno(): void {
    this.alunoService.getById(this.alunoLogadoId).subscribe({
      next: (data) => {
        this.aluno = data;
        this.alunoEdit = { ...this.aluno };
      },
      error: (err) => console.error('Erro ao carregar dados do aluno:', err)
    });
  }

  carregarAvaliacoes(): void {
    this.viagemAlunoService.getByAlunoId(this.alunoLogadoId).pipe(
      switchMap((viagensComoPassageiro: ViagemAluno[]) => {
        const finalizadas = viagensComoPassageiro.filter(va => va.situacao === 'FINALIZADA');
        if (finalizadas.length === 0) return of([]);

        const observables = finalizadas.map(va =>
          this.avaliacaoService.getByViagemAlunoId(va.id!).pipe(
            map(avaliacao => ({ ...va, avaliacao })),
            catchError(() => of({ ...va, avaliacao: undefined }))
          )
        );
        return forkJoin(observables);
      })
    ).subscribe(viagensCompletas => {
      this.avaliacoesComoPassageiro = viagensCompletas
        .filter(va => va.avaliacao && va.avaliacao.notaCaronista != null)
        .map(va => ({
          nomeAvaliador: va.viagem.motoristaNome || 'Motorista',
          nota: va.avaliacao!.notaCaronista!,
          comentario: va.avaliacao!.comentarioCaronista || 'Nenhum comentário.'
        }));
    });

    this.viagemService.getHistoricoByMotoristaId(this.alunoLogadoId).pipe(
      switchMap((viagensComoMotorista: Viagem[]) => {
        if (viagensComoMotorista.length === 0) return of([]);

        const observables = viagensComoMotorista.map(viagem =>
          this.viagemAlunoService.getByViagemId(viagem.id!).pipe(
            switchMap(passageiros => {
              if (passageiros.length === 0) return of([]);
              const avaliacaoObs = passageiros.map(p =>
                this.avaliacaoService.getByViagemAlunoId(p.id!).pipe(
                  map(avaliacao => ({ ...p, avaliacao })),
                  catchError(() => of({ ...p, avaliacao: undefined }))
                )
              );
              return forkJoin(avaliacaoObs);
            })
          )
        );
        return forkJoin(observables);
      })
    ).subscribe(viagensComPassageiros => {
      const todosOsPassageiros = viagensComPassageiros.flat();

      this.avaliacoesComoMotorista = todosOsPassageiros
        .filter(p => p.avaliacao && p.avaliacao.notaMotorista != null)
        .map(p => ({
          nomeAvaliador: p.alunoNome || 'Passageiro',
          nota: p.avaliacao!.notaMotorista!,
          comentario: p.avaliacao!.comentarioMotorista || 'Nenhum comentário.'
        }));
    });
  }


  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.alunoEdit = { ...this.aluno };
    }
  }

  salvarAlteracoes(): void {
    if (!this.aluno || !this.aluno.id) return;
    const dadosParaAtualizar: Partial<Aluno> = {
      nome: this.alunoEdit.nome,
      email: this.alunoEdit.email,
    };
    this.alunoService.update(this.aluno.id, dadosParaAtualizar).subscribe({
      next: (alunoAtualizado) => {
        this.aluno = alunoAtualizado;
        alert('Perfil atualizado com sucesso!');
        this.isEditMode = false;
      },
      error: (err) => alert('Ocorreu um erro ao salvar as alterações.')
    });
  }

  cancelarEdicao(): void {
    this.alunoEdit = { ...this.aluno };
    this.isEditMode = false;
  }

  salvarNovaSenha(): void {
    if (this.novaSenha !== this.confirmarNovaSenha) {
      alert('A nova senha e a confirmação não correspondem.');
      return;
    }
    const senhasDTO: AlterarSenhaDTO = { senhaAtual: this.senhaAtual, novaSenha: this.novaSenha };
    this.alunoService.updatePassword(this.alunoLogadoId, senhasDTO).subscribe({
      next: () => {
        alert('Senha alterada com sucesso!');
        const modal = bootstrap.Modal.getInstance(this.alterarSenhaModal.nativeElement);
        modal.hide();
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarNovaSenha = '';
      },
      error: (err) => alert(`Erro: ${err.error?.message || 'Não foi possível alterar a senha.'}`)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.alunoService.updateFoto(this.alunoLogadoId, file).subscribe({
        next: (alunoAtualizado) => { this.aluno = alunoAtualizado; alert('Fotografia de perfil atualizada com sucesso!'); },
        error: (err) => alert('Não foi possível atualizar a sua fotografia.')
      });
    }
  }

  getIniciais(nome: string | undefined): string {
    if (!nome) return '';
    const nomes = nome.split(' ').filter(Boolean);
    if (nomes.length === 0) return '';
    const primeiroNome = nomes[0];
    const ultimoNome = nomes.length > 1 ? nomes[nomes.length - 1] : '';
    const primeiraLetra = primeiroNome[0];
    const ultimaLetra = ultimoNome ? ultimoNome[0] : '';
    return `${primeiraLetra}${ultimaLetra}`.toUpperCase();
  }
}
