import { TestBed } from '@angular/core/testing';
import * as RoutingActions from '../routing';

describe('RouteInfoData actions', () => {
  it('should have action names defined', () => {
    expect(RoutingActions.ROUTING_START).toEqual('[Routing] Start');
    expect(RoutingActions.ROUTING_FINISHED).toEqual('[Routing] Finished');
    expect(RoutingActions.ROUTING_ERROR).toEqual('[Routing] Error');
  });

  it('should create RoutingStart action', () => {
    const action = new RoutingActions.RoutingStart();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RoutingActions.ROUTING_START
    });
  });

  it('should create RoutingFinished action', () => {
    const action = new RoutingActions.RoutingFinished();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RoutingActions.ROUTING_FINISHED
    });
  });

  it('should create RoutingError action', () => {
    const action = new RoutingActions.RoutingError();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: RoutingActions.ROUTING_ERROR
    });
  });
});
