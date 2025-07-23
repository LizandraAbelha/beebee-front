import { TestBed } from '@angular/core/testing';

import { HorarioAcademico } from './horario-academico';

describe('HorarioAcademico', () => {
  let service: HorarioAcademico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioAcademico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
