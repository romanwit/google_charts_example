var chart;
var json_data;
var country_selected="";
var gen_table = function() {
	$.getJSON("https://api.myjson.com/bins/2s7yc", function(data) {
		json_data='{"cou":' + JSON.stringify(data) + "}";		
		var template = "{{#cou}}<tr><td onclick='country_selected=\"{{country}}\"; '>{{country}}</td></tr>{{/cou}}";
		var html = Mustache.render(template, JSON.parse(json_data));
		$("#countries").html("<table class='table-striped'>" + html + "</table>");
	});
}

$(document).ready(function() {
	gen_table();
	$(".nav-tabs a").on("shown.bs.tab", function() {		
		if (country_selected=="")
			{$("#name_of").html("<h2>No country selected at the first tab.</h2>");}
		else
			{$("#name_of").html(country_selected);}
		
		var filtered_json=JSON.parse(json_data).cou.filter(function(row) {
			if (row.country==country_selected)
				{return true;}
			else
				{return false;}
		});
		
		if (google.charts.Line==undefined)
			{
			google.charts.load('current', {packages: ['corechart', 'line']});
			}
		google.charts.setOnLoadCallback(drawBackgroundColor);
			

		function drawBackgroundColor() {
			if (chart!=undefined)
				{chart = new Object();}
      			var data = new google.visualization.DataTable();
      			data.addColumn('number', 'Year');
      			data.addColumn('number', 'Population');

			//data.addRows([[0,0]]);
			
			for (var i=0;i<Object.keys(filtered_json[0]).length-1;i++)
			{
			data.addRows([[1950+5*i, filtered_json[0][Object.keys(filtered_json[0])[i]]]]);			
			}
			
			var options = {
        			hAxis: {
          			title: 'Year',
				minValue: 1950, 
				gridlines: {count:7}
        			},
        			vAxis: {
          			title: 'Population'
        			},
        		//backgroundColor: '#f1f8e9'
      			};

			chart = new google.visualization.LineChart(document.getElementById("plotting"));
      			chart.draw(data, options);
		}


	});
});