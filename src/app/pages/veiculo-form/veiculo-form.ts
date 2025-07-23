import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './veiculo-form.html',
  styleUrls: ['./veiculo-form.css']
})
export class VeiculoForm implements OnInit {
  veiculo: Veiculo = {
    placa: '',
    modelo: '',
    cor: '',
    motoristaId: Number(localStorage.getItem('aluno_id'))
  };
  isEditMode = false;

  constructor(
    private veiculoService: VeiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.veiculoService.getVeiculoPorId(Number(id)).subscribe(veiculo => {
        this.veiculo = veiculo;
      });
    }
  }

  salvarVeiculo() {
    if (this.isEditMode && this.veiculo.id) {
      this.veiculoService.atualizar(this.veiculo.id, this.veiculo).subscribe(() => {
        alert('Veículo atualizado com sucesso!');
        this.router.navigate(['/app/veiculos']);
      });
    } else {
      this.veiculoService.salvar(this.veiculo).subscribe(() => {
        alert('Veículo salvo com sucesso!');
        this.router.navigate(['/app/veiculos']);
      });
    }
  }
}
