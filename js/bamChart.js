function bamChart() {
	var margin = {top: 50, right: 20, bottom: 45, left: 70},//Margins around Chart
		width = 700 - margin.left - margin.right,//Chart Width
		height = 500 - margin.top - margin.bottom,//Chart Height
		yID = 'Category',//Key for column that contains the label for the row's data
		colTotals = [],//Row of aggregate values for each column. Used for the trunk position
		yLabels = [],//Row Labels.  For Vertical Axis
		xScale = d3.scale.linear().range(0, width),//Scaling for xAxis
		yScale = d3.scale.ordinal(),//Scaling for yAxis
		ticks = 6,//Number of x axis divisions
		clickColor = 'red',//Color trees turn when clicked
		title = '',//Chart Title
		xAxisLabel = '';//x axis title

	function chart(selection) {
		selection.each(function(data){
			colTotals = data[0];//Gets first row of data that contains aggregate numbers
			keys = d3.keys(colTotals);//Gets column keys
			fullData = [];//Will contain all data points for branch construction
			maxValue = 0;//For max value in data
			minValue = null;//For min value in data
			data.slice(1).forEach(function(d){//Goes through all but the first row.
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
			delete colTotals[yID];//Gets rid of key/value that in the the column that contains the category for each row
			yLabels.push('');//Extends y axis to account for adjusted label heights

			xScale.domain([0, maxValue]).range([0, width]);//Creates x value to pixel conversion
			yScale.domain(yLabels).rangePoints([height, 0]);//Creates y category to pixel conversion
			xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(ticks);//Create x axis to call later
			yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(keys.length - 1);//Create y axis to call later
	        yUnits = yScale(yLabels[1]) - yScale(yLabels[0]);//width of the y range bands
			
			// Select the svg element
			var svg = d3.select(this).append('svg')
				.attr('width', width + margin.right + margin.left)
	      		.attr('height', height + margin.top + margin.bottom)
	      		.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');	

	      	//Selects all the trunks
			trunks = svg.selectAll('line.trunk').data(d3.values(colTotals))
			//Enters and Updates Trunks
			trunks.enter()
				.append('svg:line').transition().duration(1000)
				.attr('x1', function(d){return xScale(d);})
				.attr('y1',  0)
				.attr('x2', function(d){return xScale(d);})
				.attr('y2', height)

			trunks.attr('class', function(d, i) {return 'trunk key' + i; })
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
			//Old trunks are removed from canvas
			trunks.exit().remove();	

			//Selects branches 
			branches = svg.selectAll('line.branch').data(fullData)	
			//Enters And Updates Branches
			branches.enter()
				.append('svg:line').transition().duration(1000)
				.attr('x1', function(d){return xScale(colTotals[d[2]]);})
				.attr('y1', function(d){return yScale(yLabels[d[1]]) + yUnits / 2 ;})
				.attr('x2', function(d){return xScale(d[0]);})
				.attr('y2', function(d){return yScale(yLabels[d[1]]);})

			branches.attr('class', function(d) {return 'branch key' + keys.indexOf(d[2]); })
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
			//Transitions Branches
			//Removes old branches
			branches.exit().remove();

			trunkLabels = svg.selectAll('trunkLabel').data(d3.values(colTotals))
			//Enters and updates labels
			trunkLabels.enter()
				.append('text')
				.attr('x', function(d){ return xScale(d)})	
				.attr('y', -5)
				.text(function(d, i){return keys[i];})
				.attr('class', function(d, i){return 'trunkLabel label' + i})
				.style("font-size", "10px")
				.style("text-anchor", "middle")
				.style('opacity', 0)

			//Removes old labels
			trunkLabels.exit().remove();
			//Creates X Axis 
	  		svg.append('g')
	  			.attr('transform', 'translate(0,' + height +')')//Moves Axis to bottom of the chart
	        	.attr('text-anchor', 'middle')
	            .attr('font-family', 'sans-serif')
	            .attr('font-size', '10px')
	            .attr('class', 'xAxis')
	            .style('stroke', 'black')
	            .style('fill', 'none')
	            .style('stroke-width', 1)
	            .style('shape-rendering', 'crispEdges')
	            .call(xAxis);
	        //Creates y Axis 
	        svg.append('g')
	        	.attr('transform', 'translate('+ xScale(minValue * 0.9) +', 0)')//Moves axis to the slight left of the lowest data
	        	.attr('text-anchor', 'middle')
	            .attr('font-family', 'sans-serif')
	            .attr('font-size', '10px')
	            .style('stroke', 'black')
	            .style('fill', 'none')
	            .style('stroke-width', 1)
	            .style('shape-rendering', 'crispEdges')
	            .call(yAxis)
	            .selectAll('text')	
	            .attr('transform', 'translate(0,'+ yUnits / 2 +')')//Moves y labels up half a division
	        //Adds Title to Canvas
	        svg.append("text")
		        .attr("x", (width / 2))				
		        .attr("y", 0 - (margin.top / 2) - 5)
		        .attr("text-anchor", "middle")	
		        .style("font-size", "18px") 
		        .style("text-decoration", "underline") 	
		        .text(title);
		    //Adds label to the x axis
		  	svg.append("text")
		        .attr("x", (width / 2))				
		        .attr("y", height + (margin.bottom / 2) + 20)
		        .attr("text-anchor", "middle")	
		        .style("font-size", "12px") 
		        .text(xAxisLabel);
		    //Moves selected elements to front of canvas
		    d3.selection.prototype.moveToFront = function() {  
		    	return this.each(function(){
		        	this.parentNode.appendChild(this);
		      	});
		    };
		    //Moves Selected Elements to Back of Canvas
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

	//Sets the height of the chart and returns that bamChart instance. 
	chart.height = function(arg) {
		if (!arg.length) return height;
		height = arg;
		return this;
	}
	//Sets the width of the chart and returns that bamChart instance.
	chart.width = function(arg) {
		if (!arg.length) return width;
		width = arg;
		return this;
	}
	//Sets the left margin of the chart to accomodate the length of the labels on the y Axis and returns that bamChart instance
	chart.lmargin = function(arg) {
		if (!arg.length) return margin.left;
		margin.left = arg;
		return this;
	}
	//Sets the Chart Title and returns that bamChart instance.
	chart.title = function(arg) {
		if (!arg.length) return title;
		title = arg;
		return this;
	}
	//Sets the label for the x Axis and returns that bamChart instance
	chart.xAxisLabel = function(arg) {
		if (!arg.length) return xAxisLabel;
		xAxisLabel = arg;
		return this;
	}
	//Divides the x axis into given number of sections with labeled marks at each division and returns that bamChart instance.
	chart.ticks = function(arg) {
		if (!arg.length) return xAxisLabel;
		ticks = arg;
		return this;
	}
	//Sets the color that a tree will turn when it is clicked and returns that bamChart instance.
	chart.clickColor = function(arg) {
		if (!arg.length) return clickColor;
		clickColor = arg;
		return this;
	}
	//Sets the key for the column that contains the label for each row of the dataset and returns that bamChart instance. 
	chart.categoryKey = function(arg) {
		if (!arg.length) return yID;
		yID = arg;
		return this;
	}

	return chart;
}