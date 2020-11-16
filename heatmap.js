//Read the data
var file = "GOT_deaths.csv"
data = d3.csv(file, function(d) {
  return {
    // extract important data features
    season : d['Season'],
	episode : d['Episode'],
	killer : d['Killer'],
	name : d['Name'],
	killershouse : d['Killers House'],
	method : d['Method'],
	gender : d['Gender'],
	nobility : d['Nobility'],
	isAnimal : d['Is Animal']
  };
}).then(function(data) {
	var filterGroups = ['Default','Season','Books','Character','Killer\'s House', 'Killing Method',
						'Gender','Nobility','Animals']
	var totalByEpisode = [];
	var selectedGroup;
	var selectedSecond;
	// add the options to the button
	var dropdown = d3.select("#selectButton")
	.selectAll()
	.data(filterGroups)
	.enter()
	.append('option')
	.text(function (d) { return d; }) // text showed in the menu
	.attr("value", function (d) { return d; }) // corresponding value returned by the button

	var seasonData = d3.map(data, function(d){return d.season;})
	var seasonValues = Array.from([...new Set(seasonData)]).sort();
	var bookValues = ['GoT','CoK','SoS','FfC','DwD']
	var characterData = d3.map(data, function(d){return d.name;})
	var characterValues = Array.from([...new Set(characterData)]).sort();
	var killersHouseData = d3.map(data, function(d){return d.killershouse;})
	var killershouseValues = Array.from([...new Set(killersHouseData)]).sort();
	var methodData = d3.map(data, function(d){return d.method;})
	var methodValues = Array.from([...new Set(methodData)]).sort();
	var genderValues = ['Female', 'Male'];
	var nobilityValues = ['Noble','Peasant'];
	var animalData = d3.map(data.filter(function(d) {return d.isAnimal == 1}), function(d){return d.name;})
	var animalValues = Array.from([...new Set(animalData)]).sort();

	
	var secondDropdown = d3.select('#secondSelectButton')
	.style('visibility','hidden');


	function createGroups(fil){
		totalByEpisode = [];
		if (fil == null)
			epGroups = d3.group(data, d => d.season, d => d.episode)
		else
		epGroups = d3.group(data.filter(fil), d => d.season, d => d.episode)
		var currentLocationIndex = 0
		console.log(epGroups)
		epGroups.forEach( function (vals, key) {
			summary_vals = vals.forEach( function (val2, key2) {
				
				currentSeason = key;
				currentEpisode = key2;

				return_object = {
					season: key,
					episode: key2,
					val: val2.length
				};
				totalByEpisode.push(return_object)
			});

			
			});
			totalByEpisode.push({season: 7,episode: 8, val:undefined});
			totalByEpisode.push({season: 7,episode: 9, val:undefined});
			totalByEpisode.push({season: 7,episode: 10, val:undefined});
			totalByEpisode.push({season: 8,episode: 7, val:undefined});
			totalByEpisode.push({season: 8,episode: 8, val:undefined});
			totalByEpisode.push({season: 8,episode: 9, val:undefined});
			totalByEpisode.push({season: 8,episode: 10, val:undefined});
		return totalByEpisode;
	}
	createGroups(null);

	function filtro(d){
		return d;
	}


    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
		// recover the option that has been chosen
		secondDropdown.selectAll('*').remove()
		selectedGroup = d3.select(this).property("value");
		if (selectedGroup == 'Default')
			selectedGroup = undefined;
		d3.select('#secondSelectButton').style('visibility',function(d) {
			if (selectedGroup != undefined) return 'visible'; else return 'hidden';})
			.selectAll()
			.data(function() {
				switch(selectedGroup){
					case 'Season':
						return seasonValues;
						break;
					case 'Books':
						return bookValues;
						break;
					case 'Character':
						return characterValues;
						break;
					case 'Killer\'s House':
						return killershouseValues;
						break;
					case 'Killing Method':
						return methodValues;
						break;
					case 'Gender':
						return genderValues;
						break;
					case 'Nobility':
						return nobilityValues;
						break;
					case 'Animals':
						return animalValues;
						break;
				}

			})
			.enter()
			.append('option')
			.text(function (d) { return d; }) // text showed in the menu
			.attr("value", function (d) { return d; }) // corresponding value returned by the button
        // run the updateChart function with this selected option
        updateHeatmap(selectedGroup)
	})
	
	d3.select("#secondSelectButton").on("change", function(d) {
		// recover the option that has been chosen
		selectedSecond = d3.select(this).property("value");
	})

	// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
	var seasons = ['1','2','3','4','5','6','7','8']
	var episodes = ['1', '2', '3', '4', '5', '6', 
                   '7', '8', '9', '10']

	// set the dimensions and margins of the graph
	var margin = {top: 80, right: 0, bottom: 50, left: 80},
	  width = 500 - margin.left - margin.right,
	  height = 500 - margin.top - margin.bottom;

	var svg = d3.select("body").append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
    .append("g")
     .attr("transform", 
           "translate(" + margin.left + "," + margin.top + ")");

	// Build X scales and axis:
	var x = d3.scaleBand()
		.range([ 0, width ])
		.domain(episodes)
		.padding(0.05);
		svg.append("g")
		.style("font-size", 15)
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSize(0))
		.select(".domain").remove()

	// // Build Y scales and axis:
	var y = d3.scaleBand()
		.range([ height, 0 ])
		.domain(seasons)
		.padding(0.05);
		svg.append("g")
		.style("font-size", 15)
		.call(d3.axisLeft(y).tickSize(0))
		.select(".domain").remove()

	// Build color scale
	min = d3.min(totalByEpisode, function (d) { return d.val})
	max = d3.max(totalByEpisode, function (d) { return d.val})

	var myColor = d3.scaleSequentialLog()
	.interpolator(d3.interpolateReds)
	.domain([min,max])

	// // create a tooltip
	var tooltip = d3.select("body")
	  .append("div")
	  .style("opacity", 0)
	  .attr("class", "tooltip")
	  .style("background-color", "white")
	  .style("border", "solid")
	  .style("border-width", "2px")
	  .style("border-radius", "5px")
	  .style("padding", "5px")

	// // Three functions that change the tooltip when user hover / move / leave a cell

	var mouseover = function(d) {
	  tooltip
	    .style("opacity", 1)
	  d3.select(this)
	    .style("stroke", "black")
	    //.html("The exact value of<br>this cell is: " + d)
		  //.style('left', d.screenX + 'px')
		  //.style('top', d.screenY + 'px')

	}
	var mousemove = function(d) {
	if (d.target.__data__.val != undefined){
	  tooltip.html("Kills: " + d.target.__data__.val)
		  .style('left', d.screenX + 'px')
		  .style('top', d.screenY + 'px')
	}
	else{
		tooltip
	    .style("opacity", 0)
	  d3.select(this)
	    .style("stroke", "none")
	    .style("opacity", 0.8)
	}
	}
	var mouseleave = function(d) {
	  tooltip
	    .style("opacity", 0)
	  d3.select(this)
	    .style("stroke", "none")
	    .style("opacity", 0.8)
	}

	titlex = width / 2
	titley = -25
	subtitley = titley + 25

	// // add the squares
	var heatmap = svg.selectAll()
	.data(totalByEpisode)
	.enter()
	.append("rect")
	  .attr("x", function(d) { return x(d.episode) })
	  .attr("y", function(d) { return y(d.season) })
	  .attr("rx", 4)
	  .attr("ry", 4)
	  .attr("width", x.bandwidth() )
	  .attr("height", y.bandwidth() )
	  .style("fill", function(d) {
		if (d.val == undefined) return "#888888";
		else return myColor(d.val)} )
	  .style("stroke-width", 4)
	  .style("stroke", "none")
	  .style("opacity", 0.8)
	.on("mouseover",mouseover)
	.on("mousemove", mousemove)
	.on("mouseleave", mouseleave)

	// // Add title to graph
	svg.append("text")
	  .attr("x", titlex)
	  .attr("y", titley)
	  .attr("text-anchor", "middle")
	  .style("font-size", "22px")
	  .text("Deaths in Game of Thrones");

	// // // Add subtitle to graph
	// svg.append("text")
	//   .attr("x", titlex)
	//   .attr("y", subtitley)
	//   .attr("text-anchor", "middle")
	//   .style("font-size", "14px")
	//   .style("fill", "grey")
	//   .style("max-width", 400)
	//   .text("Explore your favorite or local airport and find something fun!");

	xlabelx = width / 2;
	xlabely = height + 40;

	svg.append("text")
	  .attr("x", xlabelx)
	  .attr("y", xlabely)
	  .attr("text-anchor", "middle")
	  .style("font-size", "18px")
	  .style("max-width", 400)
	  .text("Episode");

	ylabelx = -50;
	ylabely = height / 2;

	// adapted from https://stackoverflow.com/a/30417969
	svg.append("g")
	.attr('transform', 'translate(' + ylabelx + ', ' + ylabely + ')')
	.append('text')
	.attr("text-anchor", "middle")
	.style("font-size", "18px")
	.attr("transform", "rotate(-90)")
	.text("Season");

	 // A function that update the chart
	 function updateHeatmap(selectedGroup) {

		// Create new data with the selection?
		var dataFilter = createGroups(function(d){ return d.killer == selectedGroup;});
		//console.log(dataFilter)
		// Give these new data to update line
		heatmap
			.data(dataFilter)
			.transition()
			.duration(1000)
			.attr("x", function(d) { return x(d.episode) })
			.attr("y", function(d) { return y(d.season) })
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("width", x.bandwidth() )
			.attr("height", y.bandwidth() )
			.style("fill", function(d) {
			  if (d.val == undefined) return "#888888";
			  else return myColor(d.val)} )
			.style("stroke-width", 4)
			.style("stroke", "none")
			.style("opacity", 0.8)
			// .on("mouseover",mouseover)
			// .on("mousemove", mousemove)
			// .on("mouseleave", mouseleave)
	  }
});