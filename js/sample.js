$(function() {
	var chart = bamChart()
		.title('People at risk of poverty or social exclusion')
		.xAxisLabel('% of population')
		.categoryKey('Category');

	d3.csv('sample_data/risk-poverty-dataset.csv', function(data) {
	    d3.select("#sampleChart")
	        .datum(data.slice(0,9))
	        .call(chart);
		});
});