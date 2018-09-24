import * as AdminMapActions from '../admin-map';

describe('AdminMap actions', () => {
  it('should have action names defined', () => {
    expect(AdminMapActions.REGISTER_MAP).toEqual('[AdminMap] Register Map');
    expect(AdminMapActions.RESET_MAP).toEqual('[AdminMap] Reset Map');
  });

  it('should create RegisterMap action', () => {
    const mapId = 'fakeMapId';
    const action = new AdminMapActions.RegisterMap(mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: AdminMapActions.REGISTER_MAP,
      mapId
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
