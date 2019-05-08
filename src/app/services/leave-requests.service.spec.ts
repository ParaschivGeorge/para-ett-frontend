import { TestBed } from '@angular/core/testing';

import { LeaveRequestsService } from './leave-requests.service';

describe('LeaveRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeaveRequestsService = TestBed.get(LeaveRequestsService);
    expect(service).toBeTruthy();
  });
});
