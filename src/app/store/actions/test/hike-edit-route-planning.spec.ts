import * as HikeEditRoutePlannerActions from '../hike-edit-route-planner';

describe('HikeEditRoutePlanner actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditRoutePlannerActions.RESET_ROUTE_PLANNING_STATE).toEqual('[HikeEditRoutePlanner] Reset');
    expect(HikeEditRoutePlannerActions.ROUTING_START).toEqual('[HikeEditRoutePlanner] Routing start');
    expect(HikeEditRoutePlannerActions.ROUTING_FINISHED).toEqual('[HikeEditRoutePlanner] Routing finished');
    expect(HikeEditRoutePlannerActions.ROUTING_ERROR).toEqual('[HikeEditRoutePlanner] Routing error');
    expect(HikeEditRoutePlannerActions.ADD_ROUTE).toEqual('[HikeEditRoutePlanner] Add route');
    expect(HikeEditRoutePlannerActions.PUSH_SEGMENT).toEqual('[HikeEditRoutePlanner] Push segment');
    expect(HikeEditRoutePlannerActions.UPDATE_SEGMENT).toEqual('[HikeEditRoutePlanner] Update segment');
    expect(HikeEditRoutePlannerActions.REMOVE_SEGMENTS).toEqual('[HikeEditRoutePlanner] Remove segments');
    expect(HikeEditRoutePlannerActions.POP_SEGMENT).toEqual('[HikeEditRoutePlanner] Pop segment');
    expect(HikeEditRoutePlannerActions.UPDATE_TOTAL).toEqual('[HikeEditRoutePlanner] Update total');
    expect(HikeEditRoutePlannerActions.SET_LOCATION).toEqual('[HikeEditRoutePlanner] Set location');
    expect(HikeEditRoutePlannerActions.SAVE_ROUTE).toEqual('[HikeEditRoutePlanner] Save route');
  });

  it('should create Reset action', () => {
    const action = new HikeEditRoutePlannerActions.ResetRoutePlanningState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.RESET_ROUTE_PLANNING_STATE
    });
  });

  it('should create RoutingStart action', () => {
    const action = new HikeEditRoutePlannerActions.RoutingStart();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.ROUTING_START
    });
  });

  it('should create RoutingFinished action', () => {
    const action = new HikeEditRoutePlannerActions.RoutingFinished();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.ROUTING_FINISHED
    });
  });

  it('should create RoutingError action', () => {
    const action = new HikeEditRoutePlannerActions.RoutingError();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.ROUTING_ERROR
    });
  });

  it('should create Addroute action', () => {
    const route = 'fakeRouteData';
    const action = new HikeEditRoutePlannerActions.AddRoute(route);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.ADD_ROUTE,
      route: route
    });
  });

  it('should create PushSegment action', () => {
    const segment = 'fakeSegmentData';
    const action = new HikeEditRoutePlannerActions.PushSegment(segment);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.PUSH_SEGMENT,
      segment: segment
    });
  });

  it('should create UpdateSegment action', () => {
    const segment = 'fakeSegmentData';
    const action = new HikeEditRoutePlannerActions.UpdateSegment(0, segment);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.UPDATE_SEGMENT,
      index: 0,
      segment: segment
    });
  });

  it('should create RemoveSegments action', () => {
    const action = new HikeEditRoutePlannerActions.RemoveSegments(0, 2);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.REMOVE_SEGMENTS,
      idx: 0,
      count: 2
    });
  });

  it('should create PopSegment action', () => {
    const action = new HikeEditRoutePlannerActions.PopSegment();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.POP_SEGMENT
    });
  });

  it('should create UpdateTotal action', () => {
    const total = 'fakeValue';
    const action = new HikeEditRoutePlannerActions.UpdateTotal(total);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.UPDATE_TOTAL,
      total: total
    });
  });

  it('should create SetLocation action', () => {
    const location = 'fakeLocation';
    const action = new HikeEditRoutePlannerActions.SetLocation(location);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.SET_LOCATION,
      location: location
    });
  });

  it('should create SetPlanning action', () => {
    const action = new HikeEditRoutePlannerActions.SetPlanning(true);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditRoutePlannerActions.SET_PLANNING,
      planning: true
    });
  });
});
