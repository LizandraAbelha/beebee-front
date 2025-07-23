import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { CadastroUsuario } from './pages/cadastro-usuario/cadastro-usuario';
import { Home } from './pages/home/home';
import { MainLayout } from './layouts/main-layout/main-layout';
import { VeiculoList } from './pages/veiculo-list/veiculo-list';
import { VeiculoForm } from './pages/veiculo-form/veiculo-form';
import { ViagemForm } from './pages/viagem-form/viagem-form';
import { ViagemList } from './pages/viagem-list/viagem-list';
import { ViagemDetail } from './pages/viagem-detail/viagem-detail';
import { MinhasViagens} from './pages/minhas-viagens/minhas-viagens';
import { Historico } from './pages/historico/historico';
import { MeuPerfil } from './pages/meu-perfil/meu-perfil';
import { HorarioAcademicoList } from './pages/horario-academico-list/horario-academico-list';
import { HorarioAcademicoForm } from './pages/horario-academico-form/horario-academico-form';


export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'cadastro', component: CadastroUsuario },
    {
    path: 'app',
    component: MainLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'veiculos', component: VeiculoList },
      { path: 'veiculos/form', component: VeiculoForm },
      { path: 'veiculos/form/:id', component: VeiculoForm },

      { path: 'viagens', component: ViagemList },
      { path: 'viagens/nova', component: ViagemForm },
      { path: 'viagens/editar/:id', component: ViagemForm },
      { path: 'viagens/:id', component: ViagemDetail },

      { path: 'minhas-viagens', component: MinhasViagens },
      { path: 'historico', component: Historico },
      { path: 'meu-perfil', component: MeuPerfil },

      { path: 'horarios', component: HorarioAcademicoList },
      { path: 'horarios/form', component: HorarioAcademicoForm },
      { path: 'horarios/form/:id', component: HorarioAcademicoForm },

      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
];
