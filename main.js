$(function() {

	var myChart = bamChart()
	   .title('Sample Chart1')
        .xAxisLabel('Values')
        .categoryKey('CategoryKey');

	var myChart2 = bamChart()
	    .title('Sample Chart2')
        .xAxisLabel('Values')
        .clickColor("orange")
        .categoryKey('CategoryKey');

	d3.csv('dataset.csv', function(data) {

		var chartWrapper = d3.select("#my-div")
							 .datum(data)
							 .call(myChart);

		var chartWrapper2 = d3.select("#my-div")
							  .datum(data)
							  .call(myChart2);


		$('form').submit(function(event){
			
			myChart.clickColor("royalblue")
					.xAxisLabel("numbers")
				   .title('Sample Chart1 Update');

		    // Re-call your chart function on your chartWrapper
		    chartWrapper.call(myChart);

		    return false; // don't reload the page
	 	})
	})




});