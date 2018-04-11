import { TestBed } from '@angular/core/testing';
import * as AdminMapActions from '../admin-map';

describe('AdminMap actions', () => {
  it('should have action names defined', () => {
    expect(AdminMapActions.REGISTER_MAP).toEqual('[AdminMap] Register Map');
    expect(AdminMapActions.RESET_MAP).toEqual('[AdminMap] Reset Map');
  });

  it('should create RegisterMap action', () => {
    const payload = { mapId: 'fakeMapId' };
    const action = new AdminMapActions.RegisterMap(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: AdminMapActions.REGISTER_MAP,
      payload
    });
  });

  it('should create ResetMap action', () => {
    const action = new AdminMapActions.ResetMap();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: AdminMapActions.RESET_MAP
    });
  });
});
