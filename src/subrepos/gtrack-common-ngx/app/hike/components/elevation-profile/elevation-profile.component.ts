import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

import { DistancePipe, UnitsService } from '../../../shared';
import { Route, RouteService, IElevationData } from '../../services/route';
import { HikeProgram } from '../../services/hike-program';

@Component({
  selector: 'gtcn-elevation-profile',
  templateUrl: './elevation-profile.component.html',
  styleUrls: ['./elevation-profile.component.scss']
})
export class ElevationProfileComponent {
  @ViewChild('elevationProfile') public mainDiv: ElementRef;

  public route: Route | null;
  public marker: d3.Selection<d3.BaseType, {}, null, undefined>;
  public elevationText: d3.Selection<d3.BaseType, {}, null, undefined>;

  protected vis: d3.Selection<d3.BaseType, {}, null, undefined>;
  protected res: IElevationData | null;
  protected markerOn = false;
  protected distance: DistancePipe;

  @Input()
  public set hikeProgram(hikeProgram: HikeProgram) {
    if (hikeProgram) {
      this.routeId = hikeProgram.routeId;
    } else {
      this.routeId = null;
    }
  }

  @Input()
  public set routeId(routeId: string | null) {
    if (!routeId) {
      this.route = null;
      return;
    }

    this.routeService
      .get(routeId)
      .take(1)
      .subscribe((route: Route) => {
        if (!route) {
          throw new Error(`Route #${this.routeId} is unknown`);
        }

        if (!this.vis) {
          this.vis = d3
            .select(this.mainDiv.nativeElement)
            .append('svg')
            .attr('viewBox', `0, 0, ${this.width}, ${this.height}`);
        }

        this.res = this.routeService.elevationData(route, this.width, this.height, this.margins);

        if (this.res === null) {
          return;
        }

        let xAxis = d3.axisBottom(this.res.xRange).tickSize(5);

        let yAxis = d3.axisLeft(this.res.yRange).tickSize(5);

        this.vis
          .append('svg:g')
          .attr('class', 'x axis')
          .attr('transform', `translate(0, ${this.height - this.margins.bottom})`)
          .call(xAxis);

        this.vis
          .append('svg:g')
          .attr('class', 'y axis')
          .attr('transform', `translate(${this.margins.left}, 0)`)
          .call(yAxis);

        this.marker = this.vis
          .append('circle')
          .attr('r', 4)
          .style('fill', '#FFFFFF')
          .style('display', 'none')
          .style('pointer-events', 'none')
          .style('stroke', 'orange')
          .style('stroke-width', '2px');

        this.elevationText = this.vis
          .append('text')
          .attr('class', 'elevation-label')
          .attr('x', 70)
          .attr('y', this.margins.top);

        let line = this.res.lineFunc(this.res.lineData);

        if (line !== null) {
          this.vis
            .append('svg:path')
            .attr('d', line)
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        }

        this.vis.on('mouseover', () => this.marker.style('display', 'inherit'));

        this.vis.on('mouseout', () => {
          if (!this.markerOn) {
            this.marker.style('display', 'none');
          }
        });

        this.vis.on('mousemove', () => {
          if (!this.markerOn) {
            let mouse = d3.mouse(d3.event.currentTarget);
            this.moveHandler(mouse[0]);
          }
        });

        this.vis.on('click', () => {
          let mouse = d3.mouse(d3.event.currentTarget);
          this.moveHandler(mouse[0]);
          this.markerOn = !this.markerOn;
        });
      });
  }

  @Input() public width = 450;

  @Input() public height = 200;

  @Input()
  public margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
  };

  constructor(private routeService: RouteService, unitsService: UnitsService) {
    this.distance = new DistancePipe(unitsService);
  }

  protected moveHandler(eventX: number) {
    if (this.res !== null) {
      let lineData = this.res.lineData;
      let xRange = this.res.xRange;
      let yRange = this.res.yRange;
      let bisect = d3.bisector((d: [number, number]) => {
        return d[0];
      }).right;

      let x = xRange.invert(eventX);
      let index = bisect(lineData, x);

      let startData = lineData[index - 1];
      let endData = lineData[index];

      if (startData && endData) {
        let interpolate = d3.interpolateNumber(startData[1], endData[1]);
        let range = endData[0] - startData[0];
        let valueY = interpolate((x % range) / range);
        this.marker.attr('cx', eventX);
        this.marker.attr('cy', yRange(valueY));
        this.elevationText.text(this.distance.transform(valueY));
      }
    }
  }
}
