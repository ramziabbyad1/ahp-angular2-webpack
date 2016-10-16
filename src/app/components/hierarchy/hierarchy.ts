import {Component, Input, ElementRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {Criterium} from '../../models/criterium';
import {CriteriaService} from '../../services/criteria-service';

import * as D3 from 'd3';

@Component({
	selector: 'hierarchy',
	styleUrls: ['./hierarchy.css'],
	template: `
		<h2>Sample Hierarchy</h2>
		<p>Click criteria tab to edit</p>
		<ng-content></ng-content>
	`,
	directives: []
})

export class Hierarchy {
	/* Encapsulated variables for interfacing with d3
	 * TODO: A lot of these are missing types, need to improve Type Definitions
	 * */
	private host;
	private svg;
	private margin;
	private canvasHeight: number;
	private canvasWidth: number;
	private boxWidth: number;
	private boxHeight: number;
	private htmlElement: HTMLElement;
	private nodes;
	private root;
	private hierarchy;
	private containerGroup;
	@Input() private criteria: Criterium[];
	error: any;
	testCriteria: Observable<any>;

	/*Get the element reference from angular
	 * and interface with D3*/
	constructor(
		private element: ElementRef,
		private criteriaService: CriteriaService) {
		this.htmlElement = this.element.nativeElement;
		this.host = D3.select(this.element.nativeElement);
	}

	getRoot(): Promise<void> {
		return this.criteriaService
				.getCriteria()
				.then(criteria => {
					this.root = D3.stratify()
							.id(d => d.id)
							.parentId(d => d.parent_id)
							(criteria);
				})
				.catch(error => this.error = error);
	}	

	getRootTest(id: number): Observable<Criterium[]> {
		return this.criteriaService
				.getCriteriaTest(id);
	}	


	ngOnInit(): void {
		this.setup();
		this.getRootTest(1)
				.subscribe(criteria => {
					console.log(criteria);
					this.root = D3.stratify()
							.id(d => d.id)
							.parentId(d => d.parent_id)
							(criteria);
					this.render();
				});
	}

	private render() {
		this.buildSvg();
		this.buildHierarchy();
		this.buildPaths();
		this.buildNodes();
	}

	/*
	 * TODO: Add margins to boxes
	 * */
	private setup(): void {
		this.canvasHeight = 600;
		this.canvasWidth = 800;

		this.boxHeight = 50;
		this.boxWidth = 50;
		
	}

	private buildSvg(): void {
		this.svg = this.host.append("svg")
								.attr("width", this.canvasWidth)
								.attr("height", this.canvasHeight);

		this.containerGroup =this.svg.append("g").attr("transform", "translate(0,60)");
	}

	private buildHierarchy(): void {
		this.hierarchy = D3.hierarchy(this.root);

		let tree= D3.tree().size([this.canvasWidth, this.canvasHeight - 160]);
		tree(this.hierarchy);
	}

	private buildPaths(): void {
		this.containerGroup.selectAll(".link")
					.data(this.hierarchy.descendants().slice(1))
					.enter().append("path")
						.attr("class", "link")
						.attr("d", 
							d => 
									"M" + d.x + "," + d.y
								+ "C"	+ (d.x + d.parent.x) / 2 + "," + d.y
								+ " " + (d.x + d.parent.x) / 2 + "," + d.parent.y
								+ " " + d.parent.x             + "," + d.parent.y
						);
	
	}

	private buildNodes(): void {
		this.nodes = this.containerGroup.selectAll(".node")
				.data(this.hierarchy.descendants())
			.enter().append("g")
				.attr("class", 
							d => "node node--internal" )
				.attr("transform", d => "translate(" + d.x + "," + d.y + ")");

		this.nodes.append("rect")
			.attr("x", -this.boxWidth / 2)
			.attr("y", -this.boxHeight / 2)
			.attr("width", this.boxWidth)
			.attr("height", this.boxHeight);

		this.nodes.append("text")
			.attr("font-family", "sans-serif")
			.attr("font-size", "14px")
			.attr("fill", "white")
			.style("text-anchor", "middle")
			.style("word-wrap", "break-word")
			.style("width", 100)
			.text(d => d.data.data.name + (d.data.data.weight || ""));
	}

}
