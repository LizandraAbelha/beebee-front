import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ViagemService } from '../../services/viagem';
import { Viagem } from '../../models/viagem';
import { Veiculo } from '../../models/veiculo';
import { VeiculoService } from '../../services/veiculo';

@Component({
  selector: 'app-viagem-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './viagem-form.html',
  styleUrls: ['./viagem-form.css']
})
export class ViagemForm implements OnInit {
  viagem: Viagem = {
    descricao: '',
    dataInicio: '',
    dataFim: '',
    origem: '',
    destino: '',
    situacao: 'PLANEJADA',
    motoristaId: Number(localStorage.getItem('aluno_id'))
  };
  isEditMode: boolean = false;
  pageTitle: string = 'Criar Nova Viagem';
  veiculos: Veiculo[] = [];

  constructor(
    private viagemService: ViagemService,
    private veiculoService: VeiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const motoristaId = Number(localStorage.getItem('aluno_id'));
    if (motoristaId) {
      this.carregarVeiculos(motoristaId);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.pageTitle = 'Editar Viagem';
      this.viagemService.getById(Number(id)).subscribe(data => {
        this.viagem = {
          ...data,
          dataInicio: this.formatDateForInput(data.dataInicio),
          dataFim: this.formatDateForInput(data.dataFim),
        };
      });
    }
  }

  carregarVeiculos(motoristaId: number): void {
    this.veiculoService.getVeiculosPorMotorista(motoristaId).subscribe(data => {
      this.veiculos = data;
      if (!this.isEditMode && this.veiculos.length === 1) {
        this.viagem.veiculoId = this.veiculos[0].id;
      }
    });
  }

  private formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().substring(0, 16);
  }

  salvarViagem() {
    if (this.isEditMode && this.viagem.id) {
      this.viagemService.update(this.viagem.id, this.viagem).subscribe({
        next: () => {
          alert('Viagem atualizada com sucesso!');
          this.router.navigate(['/app/minhas-viagens']);
        },
        error: (err) => {
          console.error('Erro ao atualizar viagem:', err);
          alert(`Ocorreu um erro ao atualizar a viagem: ${err.error || 'Verifique o console.'}`);
        }
      });
    } else {
      this.viagemService.salvar(this.viagem).subscribe({
        next: () => {
          alert('Viagem criada com sucesso!');
          this.router.navigate(['/app/minhas-viagens']);
        },
        error: (err) => {
          console.error('Erro ao criar viagem:', err);
          alert(`Ocorreu um erro ao criar a viagem: ${err.error || 'Verifique o console.'}`);
        }
      });
    }
  }
}
