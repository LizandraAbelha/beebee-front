import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorarioAcademicoList } from './horario-academico-list';

describe('HorarioAcademicoList', () => {
  let component: HorarioAcademicoList;
  let fixture: ComponentFixture<HorarioAcademicoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioAcademicoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorarioAcademicoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
