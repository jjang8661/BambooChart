function bamChart() {
	var margin = {top: 50, right: 20, bottom: 45, left: 70},
		width = 700 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom,
		yID = 'Category',
		colTotals = [],
		xLabels = [],
		yLabels = [],
		xScale = d3.scale.linear().range(0, width),
		yScale = d3.scale.ordinal(),
		ticks = 6,
		clickColor = 'red',
		title = 'This is a cool chart',
		xAxisLabel = 'Here be the x Axis';

	function chart(selection) {
		selection.each(function(data){
			colTotals = data[0];
			keys = d3.keys(data[0]);
			fullData = [];
			maxValue = 0;
			minValue = null;
			data.slice(1).forEach(function(d){
				yLabels.push(d[yID]);	
				keys.forEach(function(f){
					if (f !== yID) {
						var branch = [];
							branch.push(+d[f]);//Value for Row, used to calculate branch x1
							branch.push(yLabels.indexOf(d[yID]));//Name of Row, used to calculate branch y1 and y2
							branch.push(f);//Value of Country Average, used to calculate x2;
						if (branch[0] > maxValue) maxValue = branch[0];
						if (branch[2] > maxValue) maxValue = branch[2];
						if (minValue !== null) {
							if (branch[0] < minValue) minValue = branch[0];
							if (branch[2] < minValue) minValue = branch[2];
						} else {
							minValue = branch[0];
							if(branch[2] < minValue) minValue = branch[2];
						}
						fullData.push(branch);
					}
				})
			})

			var IDindex = keys.indexOf(yID);//finds index of row category
			keys.splice(IDindex, 1);//Gets rid of row category key
			delete colTotals[yID];//Gets rid of key/value that in the the column that contains the row's category
			yLabels.push('');//Extends y axis to account for adjusted label heights

			xScale.domain([0, maxValue]).range([0, width]);
			yScale.domain(yLabels).rangePoints([height, 0]);
			xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(ticks);
			yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(keys.length - 1);
	        yUnits = yScale(yLabels[1]) - yScale(yLabels[0]);//width of the y range bands
			// Select the svg element, if it exists.

			var svg = d3.select(this).append('svg')
				.attr('width', width + margin.right + margin.left)
	      		.attr('height', height + margin.top + margin.bottom)
	      		.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');	

			svg.selectAll('line.trunk').data(d3.values(colTotals))
				.enter()
				.append('svg:line')
				.attr('x1', function(d){return xScale(d);})
				.attr('y1',  0)
				.attr('x2', function(d){return xScale(d);})
				.attr('y2', height)
				.attr('class', function(d, i) {return 'trunk key' + i; })
				.attr('stroke-width', 2)
				.style('stroke', 'gray')
				.on('click', function(d, i) {
					if(this.style.stroke == 'black') {
						d3.selectAll('.key' + i).moveToFront();
						svg.selectAll('.key' + i).style('stroke', clickColor);
						svg.selectAll('.label' + i).style('opacity', 1);
					} else {
						svg.selectAll('.key' + i).style('stroke', 'black');
						svg.selectAll('.label' + i).style('opacity', 0);
					}})
				.on('mouseover', function(d, i) {
					if(this.style.stroke == 'gray'){
						d3.selectAll('.key' + i).moveToFront();
						svg.selectAll('.key' + i).style('stroke', 'black');
						svg.selectAll('.label' + i).style('opacity', 1);
					}})
				.on('mouseout', function(d, i) {
					if(this.style.stroke == 'black'){
						d3.selectAll('.key' + i).moveToBack();
						svg.selectAll('.key' + i).style('stroke', 'gray');
						svg.selectAll('.label' + i).style('opacity', 0)
					}})
					

			svg.selectAll('line.branch').data(fullData)
				.enter()
				.append('svg:line')
				.attr('x1', function(d){return xScale(colTotals[d[2]]);})
				.attr('y1', function(d){return yScale(yLabels[d[1]]) + yUnits / 2 ;})
				.attr('x2', function(d){return xScale(d[0]);})
				.attr('y2', function(d){return yScale(yLabels[d[1]]);})
				.attr('class', function(d) {return 'branch key' + keys.indexOf(d[2]); })
				.attr('stroke-width', 2)
				.style('stroke', 'gray')
				.on('click', function(d, i) {
					if(this.style.stroke == 'black') {
						d3.selectAll('.key' + keys.indexOf(d[2])).moveToFront();
						svg.selectAll('.key' + keys.indexOf(d[2])).style('stroke', clickColor);
						svg.selectAll('.label' + keys.indexOf(d[2])).style('opacity', 1);
					} else {
						svg.selectAll('.key' + keys.indexOf(d[2])).style('stroke', 'black');
						svg.selectAll('.label' + keys.indexOf(d[2])).style('opacity', 0);
					}})
				.on('mouseover', function(d, i) {
					if(this.style.stroke == 'gray'){
						d3.selectAll('.key' + keys.indexOf(d[2])).moveToFront();
						svg.selectAll('.key' + keys.indexOf(d[2])).style('stroke', 'black');
						svg.selectAll('.label' + keys.indexOf(d[2])).style('opacity', 1);
					}})
				.on('mouseout', function(d, i) {
					if(this.style.stroke == 'black'){
						d3.selectAll('.key' + keys.indexOf(d[2])).moveToBack();
						svg.selectAll('.key' + keys.indexOf(d[2])).style('stroke', 'gray');
						svg.selectAll('.label' + keys.indexOf(d[2])).style('opacity', 0)
					}})
			
			svg.selectAll('trunkLabel').data(d3.values(colTotals))
				.enter()
				.append('text')
				.attr('x', function(d){ return xScale(d)})	
				.attr('y', -5)
				.text(function(d, i){return keys[i];})
				.attr('class', function(d, i){return 'trunkLabel label' + i})
				.style("font-size", "10px")
				.style("text-anchor", "middle")
				.style('opacity', 0)

	  		svg.append('g')
	  			.attr('transform', 'translate(0,' + height +')')
	        	.attr('text-anchor', 'middle')
	            .attr('font-family', 'sans-serif')
	            .attr('font-size', '10px')
	            .attr('class', 'xAxis')
	            .style('stroke', 'black')
	            .style('fill', 'none')
	            .style('stroke-width', 1)
	            .style('shape-rendering', 'crispEdges')
	            .call(xAxis);

	        svg.append('g')
	        	.attr('transform', 'translate('+ xScale(minValue * 0.9) +', 0)')
	        	.attr('text-anchor', 'middle')
	            .attr('font-family', 'sans-serif')
	            .attr('font-size', '10px')
	            .style('stroke', 'black')
	            .style('fill', 'none')
	            .style('stroke-width', 1)
	            .style('shape-rendering', 'crispEdges')
	            .call(yAxis)
	            .selectAll('text')	
	            .attr('transform', 'translate(0,'+ yUnits / 2 +')')

	        svg.append("text")
		        .attr("x", (width / 2))				
		        .attr("y", 0 - (margin.top / 2) - 5)
		        .attr("text-anchor", "middle")	
		        .style("font-size", "18px") 
		        .style("text-decoration", "underline") 	
		        .text(title);

		  	svg.append("text")
		        .attr("x", (width / 2))				
		        .attr("y", height + (margin.bottom / 2) + 20)
		        .attr("text-anchor", "middle")	
		        .style("font-size", "12px") 
		        .text(xAxisLabel);

		    d3.selection.prototype.moveToFront = function() {  
		    	return this.each(function(){
		        	this.parentNode.appendChild(this);
		      	});
		    };

		    d3.selection.prototype.moveToBack = function() {  
		        return this.each(function() { 
		            var firstChild = this.parentNode.firstChild; 
		            if (firstChild) { 
		                this.parentNode.insertBefore(this, firstChild); 
		            } 
		        });
		    };
		});
	}

	chart.height = function(arg) {
		if (!arg.length) return height;
		height = arg;
		return this;
	}

	chart.width = function(arg) {
		if (!arg.length) return width;
		width = arg;
		return this;
	}

	chart.lmargin = function(arg) {
		if (!arg.length) return margin.left;
		margin.left = arg;
		return this;
	}

	chart.title = function(arg) {
		if (!arg.length) return title;
		title = arg;
		return this;
	}

	chart.xAxisLabel = function(arg) {
		if (!arg.length) return xAxisLabel;
		xAxisLabel = arg;
		return this;
	}

	chart.ticks = function(arg) {
		if (!arg.length) return xAxisLabel;
		ticks = arg;
		return this;
	}

	chart.clickColor = function(arg) {
		if (!arg.length) return clickColor;
		clickColor = arg;
		return this;
	}

	chart.yID = function(arg) {
		if (!arg.length) return yID;
		yID = arg;
		return this;
	}

	return chart;
}