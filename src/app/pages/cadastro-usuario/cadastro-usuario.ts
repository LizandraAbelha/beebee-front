import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlunoService } from '../../services/aluno';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-usuario.html',
  styleUrls: ['./cadastro-usuario.css']
})
export class CadastroUsuario {
    aluno = {
    nome: '',
    cpf: '',
    email: '',
    login: '',
    senha: ''
  };

  constructor(private alunoService: AlunoService) { }

  cadastrar() {
    console.log('Dados a serem enviados:', this.aluno);
    this.alunoService.cadastrar(this.aluno).subscribe({
      next: (response) => {
        console.log('Cadastro realizado com sucesso!', response);
        alert('Usuário cadastrado com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        alert('Erro ao cadastrar usuário. Verifique o console para mais detalhes.');
      }
    });
  }
}
