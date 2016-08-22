import {Component, Input, ElementRef} from '@angular/core';

import {Criterium} from '../../models/criterium';
import {CriteriaService} from '../../services/criteria-service';

import * as D3 from 'd3';

@Component({
	selector: 'hierarchy',
	styleUrls: ['./hierarchy.css'],
	template: `
		<ng-content></ng-content>
	`,
	directives: []
})

export class Hierarchy {
	/*Encapsulated variables for interfacing with d3*/
	private host;
	private svg;
	private margin;
	private height;
	private htmlElement: HTMLElement;
	private root;
	@Input() private criteria: Criterium[];
	error: any;
/*	private root: any =
		{
		  "name": "Eve",
		  "children": [
		    {
		      "name": "Cain"
		    },
		    {
		      "name": "Seth",
		      "children": [
		        {
		          "name": "Enos"
		        },
		        {
		          "name": "Noam"
		        }
		      ]
		    },
		    {
		      "name": "Abel"
		    },
		    {
		      "name": "Awan",
		      "children": [
		        {
		          "name": "Enoch"
		        }
		      ]
		    },
		    {
		      "name": "Azura"
		    }
		  ]
		};
	 */	

	/*Get the element reference from angular
	 * and interface with D3*/
	constructor(
		private element: ElementRef,
		private criteriaService: CriteriaService) {
		this.htmlElement = this.element.nativeElement;
		this.host = D3.select(this.element.nativeElement);
	}

	getCriteria(): void {
		this.criteriaService
				.getCriteria()
				.then(criteria => {
					this.root = D3.stratify()
							.id(d => d.id)
							.parentId(d => d.parent_id)
							(criteria);
					this.setup(this.root);
				})
				.catch(error => this.error = error);
	}	

	ngOnInit(): void {
		console.log('oninit hierarchy');
		this.getCriteria();
	}

	private setup(root: any): void {
		let height: number = 600;
		let width: number = 960;
		this.svg = this.host.append("svg")
								.attr("width", width)
								.attr("height", height);

		let g: any = this.svg.append("g").attr("transform", "translate(0,40)");
		let hierarchy = D3.hierarchy(root);

		let tree= D3.tree().size([width, height - 160]);
		tree(hierarchy);

		let boxHeight: number = 50;
		let boxWidth: number = 100;
		let link = g.selectAll(".link")
					.data(hierarchy.descendants().slice(1))
					.enter().append("path")
						.attr("class", "link")
						.attr("d", 
							d => 
									"M" + d.x + "," + d.y
								+ "C"	+ (d.x + d.parent.x) / 2 + "," + d.y
								+ " " + (d.x + d.parent.x) / 2 + "," + d.parent.y
								+ " " + d.parent.x             + "," + d.parent.y
						);
		
		let node = g.selectAll(".node")
				.data(hierarchy.descendants())
			.enter().append("g")
				.attr("class", 
							d => "node node--internal" )
				.attr("transform", d => "translate(" + d.x + "," + d.y + ")");

		node.append("rect")
			.attr("x", -boxWidth / 2)
			.attr("y", -boxHeight / 2)
			.attr("width", boxWidth)
			.attr("height", boxHeight);

		node.append("text")
			.attr("font-family", "sans-serif")
			.attr("font-size", "14px")
			.attr("fill", "white")
			.style("text-anchor", "middle")
			.text(d => d.data.data.name);
	}

}
