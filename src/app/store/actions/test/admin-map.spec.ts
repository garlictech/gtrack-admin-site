import { TestBed } from '@angular/core/testing';
import * as AdminMapActions from '../admin-map';

describe('AdminMap actions', () => {
  it('should have action names defined', () => {
    expect(AdminMapActions.REGISTER_MAP).toEqual('[AdminMap] Register Map');
  });

  it('should create RegisterMap action', () => {
    let expectedClass = new AdminMapActions.RegisterMap({mapId: 'fakeId'});
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(AdminMapActions.REGISTER_MAP);
  });
});
