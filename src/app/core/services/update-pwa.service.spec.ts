import { TestBed } from '@angular/core/testing';

import { UpdatePWAService } from './update-pwa.service';

describe('UpdatePWAService', () => {
  let service: UpdatePWAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePWAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
