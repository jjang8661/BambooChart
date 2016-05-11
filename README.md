# d3 Bamboo Chart Documentation (bamChart.js)

##Overview
bamChart.js is a reusable charting function that constructs a bamboo chart from properly formatted data. 

##Data the Chart Supports
A bamboo chart displays data from a data matrix with categories for the columns and rows. The row categories are stored in the first column which is identified by a column name like 'Category'. This column's name must be set using the CategoryKey function. Lastly, the first row of data must contain aggregate data like the column's mean. The aggregate data is used to construct the trunks of each bamboo 'tree' while the remaining rows are used to construct the 'branches'. Example data is below

![alt tag](https://raw.githubusercontent.com/jkinsfat/BambooChart/master/sample_data/exampleDataPic.png)

##Usage

```javascript
	var chart = bamChart()
		.title('ChartTitle')
		.xAxisLabel('AxisLabel')
		.CategoryID('CategoryColumnID');

	d3.csv('dataset', function(data) {
	    d3.select("#targetdiv")
	        .datum(data)
	        .call(chart);
		});
```

##Functions
\# *bamChart*(Key).CategoryKey

> Sets the key for the column that contains the label for each row of the dataset and returns that bamChart instance. Used to extract the labels for the y Axis and process data.

\# *bamChart*(Int).height

> Sets the height of the chart and returns that bamChart instance. 

\# *bamChart*(Int).width

> Sets the width of the chart and returns that bamChart instance.

\# *bamChart*(Int).lmargin

> Sets the left margin of the chart to accomodate the length of the labels on the y Axis and returns that bamChart instance

\# *bamChart*(String).title

> Sets the Chart Title and returns that bamChart instance.

\# *bamChart*(String).xAxisLabel

> Sets the label for the x Axis and returns that bamChart instance

\# *bamChart*(Int).ticks

> Divides the x axis into given number of sections with labeled marks at each division and returns that bamChart instance.

\# *bamChart*(Color).clickColor

> Sets the color that a tree will turn when it is clicked and returns that bamChart instance.

d3 implementation inspired by and sample data acquired from http://www.excelcharts.com/blog/bamboo-charts-people-at-risk-of-poverty-or-social-exclusion/
Code that moves html elements to the front or back taken from http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2