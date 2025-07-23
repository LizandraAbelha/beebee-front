import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HorarioAcademicoService } from '../../services/horario-academico';
import { HorarioAcademico } from '../../models/horario-academico';

@Component({
  selector: 'app-horario-academico-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './horario-academico-form.html'
})
export class HorarioAcademicoForm implements OnInit {
  horario: HorarioAcademico = {
    descricao: '',
    dia: 'SEGUNDA',
    horario: '',
    situacao: '',
    idAluno: 0
  };

  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private horarioService: HorarioAcademicoService
  ) {}

  ngOnInit(): void {
    this.horario.idAluno = Number(localStorage.getItem('aluno_id'));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.horarioService.getById(Number(id)).subscribe(data => {
        this.horario = data;
      });
    }
  }

  salvar(): void {
    if (this.isEditMode && this.horario.id) {
      this.horarioService.atualizar(this.horario.id, this.horario).subscribe(() => {
        alert('Horário atualizado!');
        this.router.navigate(['/app/horarios']);
      });
    } else {
      this.horarioService.salvar(this.horario).subscribe(() => {
        alert('Horário salvo!');
        this.router.navigate(['/app/horarios']);
      });
    }
  }
}
