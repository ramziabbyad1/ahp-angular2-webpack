import {Component, ElementRef, Input, OnInit} from '@angular/core';

import * as D3 from 'd3';

import {Matrix} from '../../models/matrix';

@Component({
	selector: 'pie-chart',
	styleUrls: ['./pie-chart.css'],
	template: '<div class="chart"></div>'
})

export class PieChart implements OnInit 
{
	@Input() matrix: Matrix;
	private colorScale;
	private _current;
	private width: number;
	private donutWidth: number;
	private height: number;
	private radius: number;
	private legendRectSize: number;
	private legendSpacing: number;
	private svg;
	private g;
	private htmlElement;
	private host;


	constructor(private element: ElementRef) {
		this.htmlElement = this.element.nativeElement;
		this.host = D3.select(this.element.nativeElement);
	}

	ngOnInit(): void {
		this.setup();
		this.buildSvg();
	}

	setup(): void {
		this.width = 360;
		this.height = 360;
		this.legendRectSize = 18;
		this.legendSpacing = 4;
		this.donutWidth = 75;
		this.radius = Math.min(this.width, this.height) / 2;
		this.colorScale = D3.scaleOrdinal(D3.schemeCategory20b);
	}

	buildSvg(): void {
		this.svg = this.host.select('.chart')
			.append('svg');
		this.g = this.svg
			.attr('width', this.width)
			.attr('height', this.height)
			.append('g')
			.attr('transform', 'translate(' + (this.width/2) + ',' + (this.height/2) + 			')');
		let arc = D3.arc()
    	.innerRadius(this.radius - this.donutWidth)
    	.outerRadius(this.radius);

    let pie = D3.pie()
      .value(d => d.count)
      .sort(null);

    let tooltip = this.host.select('.chart')
      .append('div')
      .attr('class', 'tooltip');
    
    tooltip.append('div')
      .attr('class', 'label');

    tooltip.append('div')
      .attr('class', 'percent');

		let weights = this.matrix.weights;
		let labels = this.matrix.names;

		let dataset = [];
		weights.forEach((w,i) => dataset.push({count: w, label: labels[i], enabled:false}));

    let path = this.g.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d =>  this.colorScale(d.data.label))                              .each(d => this._current = d);                
    path.on('mouseover', function(d) {
			let percent = d.data.count.toFixed(2) * 100;
      tooltip.select('.label').html(d.data.label);
      tooltip.select('.percent').html(percent + '%'); 
      tooltip.style('display', 'block');
    });
    
    path.on('mouseout', function() {
      tooltip.style('display', 'none');
    });
    /* OPTIONAL 
    path.on('mousemove', function(d) {
      tooltip.style('top', (D3.event.pageY + 10) + 'px')
        .style('left', (D3.event.pageX + 10) + 'px');
    });
    */
    var legend = this.g.selectAll('.legend')
      .data(this.colorScale.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => {
        var height = this.legendRectSize + this.legendSpacing;
        var offset =  height * this.colorScale.domain().length / 2;
        var horz = -2 * this.legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });
    legend.append('rect')
      .attr('width', this.legendRectSize)
      .attr('height', this.legendRectSize)                                   
      .style('fill', this.colorScale)
      .style('stroke', this.colorScale)                                             	.on('click', function(label) {                            																																								
        var rect = D3.select(this);                             
        var enabled = true;                                     
        var totalEnabled = D3.sum(this.weights.map(function(d) {     
          return (d.enabled) ? 1 : 0;                           
        }));                                                    
        
        if (rect.attr('class') === 'disabled') {                
          rect.attr('class', '');                               
        } else {                                                
          if (totalEnabled < 2) return;                         
          rect.attr('class', 'disabled');                       
          enabled = false;                                      
        }                                                       

        pie.value(function(d, i) {                                 
          if (d === label) d.enabled = enabled;           
          return (d.enabled) ? d.count : 0;                     
        });                                                     

        path = path.data(pie(dataset));                         

        path.transition()                                       
          .duration(750)                                        
          .attrTween('d', function(d) {                         
            var interpolate = D3.interpolate(this._current, d); 
            this._current = interpolate(0);                     
            return function(t) {                                
              return arc(interpolate(t));                       
            };                                                  
          });                                                   
      });                                                       
      
    legend.append('text')
      .attr('x', this.legendRectSize + this.legendSpacing)
      .attr('y', this.legendRectSize - this.legendSpacing)
      .text(function(d) { return d; });

	}

	

}
