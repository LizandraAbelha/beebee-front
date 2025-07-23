import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Aluno } from '../../models/aluno';
import { AlunoService } from '../../services/aluno';
import { BeeRating } from '../../pages/bee-rating/bee-rating';
import { FormsModule } from '@angular/forms';
import { AlterarSenhaDTO } from '../../models/alterar-senha';

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

  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';

  constructor(private alunoService: AlunoService) {}

  ngOnInit(): void {
    this.alunoLogadoId = Number(localStorage.getItem('aluno_id'));
    if (this.alunoLogadoId) {
      this.carregarDadosAluno();
    }
  }

  carregarDadosAluno(): void {
    this.alunoService.getById(this.alunoLogadoId).subscribe({
      next: (data) => {
        this.aluno = data;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do aluno:', err);
        alert('Não foi possível carregar os dados do perfil.');
      }
    });
  }

  salvarNovaSenha(): void {
    if (this.novaSenha !== this.confirmarNovaSenha) {
      alert('A nova senha e a confirmação não correspondem.');
      return;
    }

    if (this.novaSenha.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const senhasDTO: AlterarSenhaDTO = {
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    };

    this.alunoService.updatePassword(this.alunoLogadoId, senhasDTO).subscribe({
      next: () => {
        alert('Senha alterada com sucesso!');
        const modal = bootstrap.Modal.getInstance(this.alterarSenhaModal.nativeElement);
        modal.hide();
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarNovaSenha = '';
      },
      error: (err) => {
        console.error('Erro ao alterar senha:', err);
        alert(`Erro: ${err.error?.message || err.error || 'Não foi possível alterar a senha.'}`);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.alunoService.updateFoto(this.alunoLogadoId, file).subscribe({
        next: (alunoAtualizado) => {
          this.aluno = alunoAtualizado;
          alert('Fotografia de perfil atualizada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao fazer upload da foto:', err);
          alert('Não foi possível atualizar a sua fotografia.');
        }
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
