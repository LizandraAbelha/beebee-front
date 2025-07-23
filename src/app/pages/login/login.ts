import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  credenciais = {
    login: '',
    senha: ''
  };

  constructor(
    private alunoService: AlunoService,
    private router: Router
  ) {}

  login() {
    console.log('Tentando fazer login com:', this.credenciais);
    this.alunoService.login(this.credenciais).subscribe({
      next: (alunoLogado) => {
        console.log('Login bem-sucedido!', alunoLogado);
        alert(`Bem-vindo, ${alunoLogado.nome}!`);
        localStorage.setItem('aluno_id', alunoLogado.id);
        localStorage.setItem('aluno_nome', alunoLogado.nome);
        this.router.navigate(['/app/home']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        alert('Erro: Login ou senha inválidos.');
      }
    });
  }
}
