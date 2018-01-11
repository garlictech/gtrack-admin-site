import { TestBed } from '@angular/core/testing';
import * as RoutingActions from '../routing';

describe('RouteInfoData actions', () => {
  it('should have action names defined', () => {
    expect(RoutingActions.ROUTING_START).toEqual('[Routing] Start');
    expect(RoutingActions.ROUTING_FINISHED).toEqual('[Routing] Finished');
    expect(RoutingActions.ROUTING_ERROR).toEqual('[Routing] Error');
  });

  it('should create RoutingStart action', () => {
    let expectedClass = new RoutingActions.RoutingStart();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RoutingActions.ROUTING_START);
  });

  it('should create RoutingFinished action', () => {
    let expectedClass = new RoutingActions.RoutingFinished();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RoutingActions.ROUTING_FINISHED);
  });

  it('should create RoutingError action', () => {
    let expectedClass = new RoutingActions.RoutingError();
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(RoutingActions.ROUTING_ERROR);
  });
});
