import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-veiculo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veiculo-form.html',
  styleUrls: ['./veiculo-form.css']
})
export class VeiculoForm implements OnInit, OnDestroy {
  veiculo: Veiculo = {
    placa: '',
    modelo: '',
    cor: '',
    motoristaId: Number(localStorage.getItem('aluno_id'))
  };
  isEditMode = false;
  private hasVehicles = false;
  private veiculoSubscription!: Subscription;

  constructor(
    private veiculoService: VeiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.veiculoSubscription = this.veiculoService.possuiVeiculos$.subscribe(possui => {
      this.hasVehicles = possui;
    });

    const motoristaId = Number(localStorage.getItem('aluno_id'));
    if (motoristaId) {
        this.veiculoService.verificarVeiculos(motoristaId).subscribe();
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.veiculoService.getVeiculoPorId(Number(id)).subscribe(veiculo => {
        this.veiculo = veiculo;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.veiculoSubscription) {
      this.veiculoSubscription.unsubscribe();
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
        this.veiculoService.notificarVeiculoAdicionado();
        this.router.navigate(['/app/veiculos']);
      });
    }
  }

  cancelar(): void {
    if (this.hasVehicles) {
      this.router.navigate(['/app/veiculos']);
    } else {
      this.router.navigate(['/app/home']);
    }
  }
}
