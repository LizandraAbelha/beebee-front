import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VeiculoService } from '../../services/veiculo';
import { RouterLink } from '@angular/router';
import { Veiculo } from '../../models/veiculo';

@Component({
  selector: 'app-veiculo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './veiculo-list.html',
  styleUrls: ['./veiculo-list.css']
})
export class VeiculoList implements OnInit {
  veiculos: Veiculo[] = [];

  constructor(private veiculoService: VeiculoService) { }

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    const alunoId = localStorage.getItem('aluno_id');
    if (alunoId) {
      this.veiculoService.getVeiculosPorMotorista(Number(alunoId)).subscribe(data => {
        this.veiculos = data;
      });
    }
  }

  excluir(id: number | undefined): void {
    if (id === undefined) {
      alert('ID do veículo não encontrado para exclusão.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.')) {
      this.veiculoService.delete(id).subscribe({
        next: () => {
          alert('Veículo excluído com sucesso!');
          this.carregarVeiculos();
        },
        error: (err) => {
          console.error('Erro ao excluir veículo:', err);
          alert(`Erro ao excluir veículo: ${err.error?.message || 'Erro desconhecido.'}`);
        }
      });
    }
  }
}
