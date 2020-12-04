var previousRectHouse, selectedRectHouse, clickedHouse, selectedCharacter, names_order, color_order, names = [], allegiances_chord = [];
var file = "GOT_deaths.csv"
var chord_names = "data/names.csv"
data = d3.csv(file, function(d) {
  return {
    // extract important data features
    season : d['Season'],
	episode : d['Episode'],
	estimatedBookDeathSeason : d['Estimated Book Death Season'],
	estimatedBookDeathEpisode : d['Estimated Book Death Episode'],
	killer : d['Killer'],
	killer_chord : d['Killer_chord'],
	character : d['Name'],
	killed_chord : d['Killed_chord'],
	allegiance : d['Allegiance'],
	killershouse : d['Killers House'],
	method : d['Method'],
	gender : d['Gender'],
	killerGender : d['Killer Gender'],
	nobility : d['Nobility'],
	killerNobility : d['Killer Nobility'],
	isAnimal : d['Is Animal'],
	killerIsAnimal : d['KillerIsAnimal'],
	got : d['GoT'],
	cok : d['CoK'],
	sos : d['SoS'],
	ffc : d['FfC'],
	dwd : d['DwD']
  };
}).then(function(data) {
	data_chord = d3.csv(chord_names, function(d) {
		return {
			names : d['name'],
			colors : d['color']
			};
	}).then(function (data_chord){
		names_order = d3.map(data_chord, function(d){return d.names;})
		colors_order = d3.map(data_chord, function(d){return d.colors;})
		
	var filterGroups = ['No Filter','Season','Books','Character','House', 'Killing Method',
						'Gender','Nobility','Animals']
	var totalByEpisode = [];
	var selectedGroup;
	var selectedSecond;
	var min;
	var max;
	var title;
	// add the options to the button
	var dropdown = d3.select("#selectButton")
	.selectAll()
	.data(filterGroups)
	.enter()
	.append('option')
	.text(function (d) { return d; }) // text showed in the menu
	.attr("value", function (d) { return d; }) // corresponding value returned by the button

	var seasonValues = ['1','2','3','4','5','6','7','8'];
	var bookValues = ['GoT','CoK','SoS','FfC','DwD']
	var characterDeathData = d3.map(data.filter(function(d){ return d.isAnimal == 0;}), function(d){return d.character});
	var characterKillData = d3.map(data.filter(function(d){ return d.killerIsAnimal == 0;}), function(d){return d.killer;})
	var characterValues = Array.from([...new Set([...characterKillData,...characterDeathData])]).sort();
	var houseKillsData = d3.map(data, function(d){return d.killershouse;})
	var houseDeathsData = d3.map(data, function(d){return d.allegiance;})
	var killershouseValues = Array.from([...new Set([...houseKillsData,...houseDeathsData])]).sort();
	var methodData = d3.map(data, function(d){return d.method;})
	var methodValues = Array.from([...new Set(methodData)]).sort();
	var genderValues = ['Female', 'Male'];
	var nobilityValues = ['Noble','Peasant'];
	var animalDeathData = d3.map(data.filter(function(d) {return d.isAnimal == 1}), function(d){return d.character;})
	var animalKillData = d3.map(data.filter(function(d) {return d.killerIsAnimal == 1}), function(d){return d.killer;})
	var animalValues = Array.from([...new Set(['All Animals',...animalDeathData,...animalKillData])]).sort();

	
	var secondDropdown = d3.select('#secondSelectButton')
	.style('visibility','hidden');

	var currentLabel = "Deaths";

	var radiodeaths = d3.select("#radiodeaths").on("change", function(d){
		currentLabel = "Deaths";
		//updateTitle();
		if (selectedGroup != undefined && selectedSecond == undefined) return;
		updateHeatmap();
		updateTreemap();
		updateChord();
	})
	var radiokills = d3.select("#radiokills").on("change", function(d){
		currentLabel = "Kills";
		//updateTitle();
		if (selectedGroup != undefined && selectedSecond == undefined) return;
		updateHeatmap();
		updateTreemap();
		updateChord();
	})


	function createGroups(fil,fil2){
		totalByEpisode = [];
		if(selectedGroup == undefined && clickedRect == undefined){
			// console.log("SG0 CR0");
			epGroups = d3.group(data, d => d.season, d => d.episode)
		}
		else if (selectedGroup == undefined && clickedRect != undefined){
			// console.log("SG0 CR1");
			epGroups = d3.group(data.filter(fil), d => d.season, d => d.episode)
		}
		else if (selectedGroup != undefined && clickedRect == undefined){
			// console.log("SG1 CR0");
			epGroups = d3.group(data.filter(fil2), d => d.season, d => d.episode)
		}
		else{
			// console.log("SG1 CR1");
			epGroups = d3.group(data.filter(fil).filter(fil2), d => d.season, d => d.episode)
		}
		//console.log(epGroups)
		totalByEpisode.push({season: 1,episode: 1, val:0, info: -1});
		totalByEpisode.push({season: 1,episode: 2, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 3, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 4, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 5, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 6, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 7, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 8, val:0, info: -1});
		totalByEpisode.push({season: 1,episode: 9, val:0,info: -1});
		totalByEpisode.push({season: 1,episode: 10, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:2,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 8, val:0, info: -1});
		totalByEpisode.push({season:2,episode: 9, val:0,info: -1});
		totalByEpisode.push({season:2,episode: 10, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:3,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 8, val:0, info: -1});
		totalByEpisode.push({season:3,episode: 9, val:0,info: -1});
		totalByEpisode.push({season:3,episode: 10, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:4,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 8, val:0, info: -1});
		totalByEpisode.push({season:4,episode: 9, val:0,info: -1});
		totalByEpisode.push({season:4,episode: 10, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:5,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 8, val:0, info: -1});
		totalByEpisode.push({season:5,episode: 9, val:0,info: -1});
		totalByEpisode.push({season:5,episode: 10, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:6,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 8, val:0, info: -1});
		totalByEpisode.push({season:6,episode: 9, val:0,info: -1});
		totalByEpisode.push({season:6,episode: 10, val:0,info: -1});
		totalByEpisode.push({season:7,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:7,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:7,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:7,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:7,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:7,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:7,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 1, val:0, info: -1});
		totalByEpisode.push({season:8,episode: 2, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 3, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 4, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 5, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 6, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 7, val:0,info: -1});
		totalByEpisode.push({season:8,episode: 8, val:0, info: -1});
		totalByEpisode.push({season: 7,episode: 8, val:undefined, info: -1});
		totalByEpisode.push({season: 7,episode: 9, val:undefined,info: -1});
		totalByEpisode.push({season: 7,episode: 10, val:undefined,info: -1});
		totalByEpisode.push({season: 8,episode: 7, val:undefined,info: -1});
		totalByEpisode.push({season: 8,episode: 8, val:undefined,info: -1});
		totalByEpisode.push({season: 8,episode: 9, val:undefined,info: -1});
		totalByEpisode.push({season: 8,episode: 10, val:undefined,info: -1});
		epGroups.forEach( function (vals, key) {
			summary_vals = vals.forEach( function (val2, key2) {
				currentSeason = key;
				currentEpisode = key2;
				return_object = {
					season: parseInt(key),
					episode: parseInt(key2),
					val: val2.length,
					info: epGroups.get(currentSeason).get(currentEpisode)
				};
				var a = totalByEpisode.find(d => d.season == currentSeason && d.episode == currentEpisode)
				a.season = return_object.season;
				a.episode = return_object.episode;
				a.val = return_object.val;
				a.info = return_object.info;
			});
		});
		//console.log(totalByEpisode)
		
		
		return totalByEpisode;
	}
	createGroups(null);

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
		// recover the option that has been chosen
		secondDropdown.selectAll('*').remove()
		selectedGroup = d3.select(this).property("value"); //value of first dropdown
		if (selectedGroup == 'No Filter'){
			selectedGroup = undefined;
			menuFilter = undefined;
		}
		d3.select('#secondSelectButton').style('visibility',function(d) {
			return (selectedGroup != undefined) ? 'visible' : 'hidden';}); //hide second menu in case of NoFilter
		if(selectedGroup != undefined){
			updateSecondDropdown(); //yupdate values on second dropdown menu
			//updateHeatmap acontece no segundo dropdown
			selectedSecond = undefined;
		}
		else{
			updateHeatmap() //caso a opcao seja No Filter
			updateTreemap()
			updateChord()
			selectedSecond = undefined;
		}
	})
	
	d3.select("#secondSelectButton").on("change", function(d) {
		// recover the option that has been chosen
		selectedSecond = d3.select(this).property("value");
		updateHeatmap()
		updateTreemap()
		updateChord()
	})

	// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
	var seasons = ['1','2','3','4','5','6','7','8']
	var episodes = ['1', '2', '3', '4', '5', '6', 
                   '7', '8', '9', '10']

	// set the dimensions and margins of the graph
	var margin = {top: 80, right: 0, bottom: 50, left: 80},
	  width = 400 - margin.left - margin.right,
	  height = 400 - margin.top - margin.bottom;

	var svg = d3.select("#heatmap").append("svg")
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
		.style("font-size", "15px")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSize(0))
		.select(".domain").remove()

	// // Build Y scales and axis:
	var y = d3.scaleBand()
		.range([ height, 0 ])
		.domain(seasons)
		.padding(0.05);
		svg.append("g")
		.style("font-size", "15px")
		.call(d3.axisLeft(y).tickSize(0))
		.select(".domain").remove()

	// Build color scale
	function setColorDomain(dataset){
		min = d3.min(dataset, function (d) { return d.val})
		if (min == 0) min = 1;
		max = d3.max(dataset, function (d) { return d.val})
		if (max == 0) max = 1;
	}

	setColorDomain(totalByEpisode); //first time: set colorscale to all episodes

	var myColor = d3.scaleSequentialLog()
	.interpolator(d3.interpolateReds)
	.domain([min/2,max])

	// // // create a tooltip
	// var tooltip = d3.select("#heatmap")
	//   .append("div")
	//   .style("opacity", 0)
	//   .attr("class", "tooltip")
	//   .style("background-color", "white")
	//   .style("border", "solid")
	//   .style("border-width", "2px")
	//   .style("border-radius", "5px")
	//   .style("padding", "5px")

	// // Three functions that change the tooltip when user hover / move / leave a cell

	function mouseover(d){
	if (d.target.className.baseVal == "ebd" && currentLabel == 'Kills' || d.target.__data__.val == 0){return;}
	  tooltip3
	    .style("opacity", 1)
	  d3.select(this)
	  .style("stroke",'black')
	    //.html("The exact value of<br>this cell is: " + d)
		  //.style('left', d.screenX + 'px')
		  //.style('top', d.screenY + 'px')

	}
	function mousemove(d){
		if (d.target.className.baseVal == "ebd" || d.target.__data__.val == 0){
			tooltip3.html("Approximate Book Death: Season " + d.target.__data__.ebds + ", Episode " + d.target.__data__.ebde)
			.style("position","absolute")
			.style('left', d.x - 900+ 'px')
			.style('top', d.y - 20 + 'px')
		}
		else if (d.target.__data__.val != undefined){
			if(currentLabel == 'Deaths')
				tooltip3.html("Deaths: " + d.target.__data__.val)
			else
				tooltip3.html("Kills: " + d.target.__data__.val)
			tooltip3			
			.style("position","absolute")
			.style('left', d.x - 900+ 'px')
			.style('top', d.y - 20 + 'px')
		}
		else{
			tooltip3
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", "none")
			.style("opacity", 0.8)
		}
	}
	function mouseleave(d){
		var strokecolor = d.fromElement.style.stroke;
		if (d.target.className.baseVal == "ebd"){
			tooltip3
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", "red")
			.style("opacity", 0.8)
		}
		else{
		tooltip3
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", function(d){
				return (strokecolor == 'green') ? 'green' : 'none';
			})
			.style("opacity", 0.8)
		}
	}

	var clickedSeason;
	var clickedEpisode;
	var clickedMethod;
	var previousRectSeason;
	var previousRectEpisode;
	var selectedRectSeason;
	var selectedRectEpisode;
	var clickedRect; //keep clicked rectangle
	var allegiance;

	function rectClick(d){
		if (d.target.__data__.val != undefined && d.target.__data__.val != 0){
			clickedRect = d.target;
			if (previousRectSeason != selectedRectSeason && previousRectEpisode != selectedRectEpisode){
				previousRectSeason = selectedRectSeason;
				previousRectEpisode = selectedRectEpisode;
			}
			else{
				previousRectSeason = undefined;
				previousRectEpisode = undefined;
			}
			selectedRectSeason = clickedRect.__data__.season;
			selectedRectEpisode = clickedRect.__data__.episode;
			if (previousRectSeason == selectedRectSeason && previousRectEpisode == selectedRectEpisode){
				clickedRect = undefined;
				clickFilter = undefined;
				clickedSeason = undefined;
				clickedEpisode = undefined;
			}else{
				clickedSeason = clickedRect.__data__.season;
				clickedEpisode = clickedRect.__data__.episode;
				clickedMethod = undefined;
				clickedHouse = undefined;
			}
		updateHeatmap();
		updateTreemap();
		updateChord();
		fadeAll(1);
		}
	}

	var previousRectMethod, selectedRectMethod;
	function rectClick2(d){	
		if (d.target.__data__.data.value != undefined){
			clickedRect = d.target;
			if (previousRectMethod != selectedRectMethod)
				previousRectMethod = selectedRectMethod;
			else
				previousRectMethod = undefined;
			selectedRectMethod = clickedRect.__data__.data.Method;
			if (previousRectMethod == selectedRectMethod){
				clickedRect = undefined;
				clickFilter = undefined;
				clickedMethod = undefined;
			}else{
				clickedEpisode = undefined;
				clickedSeason = undefined;
				clickedMethod = clickedRect.__data__.data.Method;
				clickedHouse = undefined;
			}
		updateHeatmap();
		updateTreemap();
		updateChord();
		fadeAll(1);
		}
	}
	

	function rectClick3(d){
		if (d.target.__data__ != undefined){
			clickedRect = d.target;
			if (previousRectHouse != selectedRectHouse)
				previousRectHouse = selectedRectHouse;
			else				
				previousRectHouse = undefined;
			selectedRectHouse = allegiances_chord[clickedRect.__data__.index];
			if (previousRectHouse == selectedRectHouse){
				if (names[clickedRect.__data__.index] != selectedCharacter){
					previousRectHouse = selectedRectHouse;
					selectedCharacter = names[clickedRect.__data__.index];}
				else{
					clickedRect = undefined;
					clickFilter = undefined;
					clickedHouse = undefined;
					selectedCharacter = undefined;
				}
			}else{
				clickedEpisode = undefined;
				clickedSeason = undefined;
				clickedMethod = undefined;
				clickedHouse = allegiances_chord[clickedRect.__data__.index];
				selectedCharacter = names[clickedRect.__data__.index];
			}
		//console.log(clickedHouse)
		updateHeatmap();
		updateTreemap();
		}		
	}


	titlex = width / 2
	titley = -25
	// // add the squares
	function createHeatmap(){
		heatmap = svg.selectAll()
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
			if (d.val == 0) return "#ffffff";
			else return myColor(d.val)} )
		.style("stroke-width", 4)
		.style("stroke", "none")
		.style("opacity", 0.8)
		.on("mouseover",mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave)
		.on("click",rectClick)

		// // Add title to graph
		// title = svg.append("text")
		// .attr("x", titlex)
		// .attr("y", titley)
		// .attr("text-anchor", "middle")
		// .style("font-size", "22px")
		// .text(function() {return  currentLabel + " in Game of Thrones"});
	  }
	  
	  createHeatmap();

	//   function updateTitle(){
	// 	  title.text(function() {return  currentLabel + " in Game of Thrones"});
	//   }

	xlabelx = width / 2;
	xlabely = height + 40;

	svg.append("text")
	  .attr("x", xlabelx)
	  .attr("y", xlabely)
	  .attr("text-anchor", "middle")
	  .style("font-size", "15px")
	  .style("max-width", 400)
	  .text("Episode");

	ylabelx = -25;
	ylabely = height / 2;

	// adapted from https://stackoverflow.com/a/30417969
	svg.append("g")
	.attr('transform', 'translate(' + ylabelx + ', ' + ylabely + ')')
	.append('text')
	.attr("text-anchor", "middle")
	.style("font-size", "15px")
	.attr("transform", "rotate(-90)")
	.text("Season");

	function filterClick(d){
		if (clickedRect != undefined){
			if (clickedSeason != undefined)
				return d.season == clickedSeason && d.episode == clickedEpisode;
			else if (clickedMethod != undefined)
				return d.method == clickedMethod;
			else if (clickedHouse != undefined){
				if(currentLabel == 'Deaths')
					return d.allegiance == clickedHouse;
				return d.killershouse == clickedHouse;
			}
		}
	}

	function filterData(d){
		switch(selectedGroup){
			case undefined:
				return null;
				break;
			case 'Character':
				if (currentLabel == 'Deaths')
					return d.character == selectedSecond;
				return d.killer == selectedSecond;
				break;
			case 'Books':
				return d[selectedSecond.toLowerCase()] == 1;
				break;
			case 'House':
				if (currentLabel == "Deaths")
					return d.allegiance == selectedSecond;
				return d.killershouse == selectedSecond;
				break;
			case 'Killing Method':
				return d.method == selectedSecond;
				break;
			case 'Gender':
				if (currentLabel == 'Deaths')
					return selectedSecond == 'Female' ? d.gender == 0 : d.gender == 1;
				return selectedSecond == 'Female' ? d.killerGender == 0 : d.killerGender == 1;
				break;
			case 'Nobility':
				if (currentLabel == 'Deaths')
					return selectedSecond == 'Peasant' ? d.nobility == 0 : d.nobility == 1;
				return selectedSecond == 'Peasant' ? d.killerNobility == 0 : d.killerNobility == 1;
				break;
			case 'Animals':
				if (selectedSecond == 'All Animals')
					if (currentLabel == 'Deaths')
						return d.allegiance == 'Animal';
					else
						return d.killershouse == 'Animal';
				if (currentLabel == 'Deaths')
					return d.character == selectedSecond;
				return d.killer == selectedSecond;
				break;
			default:
				return d[selectedGroup.toLowerCase()] == selectedSecond;
				break;
		}
	}

	var clickFilter; //current filter created by clicking 
	var menuFilter; //current filter created by menu

	 // A function that update the chart
	 function updateHeatmap() {
		// Create new data with the selection?
		if (clickedRect != undefined){
			clickFilter = function(d){return filterClick(d);}
		}
		if (selectedGroup != undefined){
			menuFilter = function(d){return filterData(d);}
		}
		// console.log(clickFilter);
		// console.log(menuFilter);
		var dataFilter = createGroups(clickFilter,menuFilter);
		squares = svg.selectAll("rect")
			.data(dataFilter)
			.join("rect")
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("width", x.bandwidth() )
			.attr("height", y.bandwidth() )
		squares.transition()
			.duration(750)
			.attr("x", function(d) { return x(d.episode) })
			.attr("y", function(d) { return y(d.season) })
			.style("fill", function(d) {
				setColorDomain(totalByEpisode);	
				if (d.val == undefined) return "#888888";
				if (d.val == 0) return "#ffffff";
				else return myColor(d.val);} )
		squares.style("stroke-width", 4) //chama-se squares outra vez por causa do stroke
			.style("stroke", "none")
			.style("opacity", 0.8)
		squares.on("mouseover",mouseover) //depois do transition é preciso chamar squares outra vez
		squares.on("mousemove", mousemove)
		squares.on("mouseleave", mouseleave)
		squares.on("click", rectClick)

		if(currentLabel == 'Kills'){
			d3.selectAll('.ebd').style('stroke','none').style('stroke-width',0)
		}

		if(currentLabel == 'Deaths'){
		if(selectedGroup == 'Character' && totalByEpisode.find(d => d.val != 0) != undefined){
			var ebdRect = totalByEpisode.find(d => d.val != 0)
			ebdSeason = ebdRect.info[0].estimatedBookDeathSeason;
			ebdEpisode = ebdRect.info[0].estimatedBookDeathEpisode;
			if (ebdSeason > -1 && ebdEpisode > -1){
				svg.append("rect")
					.data([{ebds: ebdSeason, ebde: ebdEpisode}])
					.attr("class", "ebd")
					.attr("x", x(ebdEpisode))
					.attr("y", y(ebdSeason))
					.attr("rx", 4)
					.attr("ry", 4)
					.attr("width", x.bandwidth() )
					.attr("height", y.bandwidth() )
					.style("fill", "none")
					.style("stroke-width", 7)
					.style("stroke", "red")
					.style("opacity", 0.8)
					.on("mouseover",mouseover) //depois do transition é preciso chamar  outra vez
					.on("mousemove", mousemove)
					.on("mouseleave", mouseleave)
			}
		}
	}
	  }

	function updateSecondDropdown() {
		secondDropdown.selectAll('*').remove()
		if (selectedGroup != undefined){
			d3.select('#secondSelectButton').selectAll()
				.data(function () {
					switch (selectedGroup) {
						case 'Season':
							return seasonValues;
							break;
						case 'Books':
							return bookValues;
							break;
						case 'Character':
							return characterValues;
							break;
						case 'House':
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
			.text(function (d) { return d; }) //menu text
			.attr("value", function (d) { return d; }); //button value
		}
	}

	/////////////////////////////////////////////////////////////////

	var methodTreeData = [];

	//get the count of each method
	function rollup(arr) {
		var a = [], b = [], prev;
		
		arr.sort();
		for ( var i = 0; i < arr.length; i++ ) {
			if ( arr[i] !== prev ) {
				a.push(arr[i]);
				b.push(1);
			} else {
				b[b.length-1]++;
			}
			prev = arr[i];
		}
		return [a, b];
	}
  
	// set the dimensions and margins of the graph
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
		width = 510 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg2 = d3.select("#tree_map")
				.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");

	// var tooltip2 = d3.select("#tree_map")
	// 	.append("div")
	// 	.style("opacity", 0)
	// 	.attr("class", "tooltip2")
	// 	.style("background-color", "white")
	// 	.style("border", "solid")
	// 	.style("border-width", "2px")
	// 	.style("border-radius", "5px")
	// 	.style("padding", "5px")

	function mouseover2(d){
		if (d.target.__data__.data.value){
			tooltip3
				.style("opacity", 1)
			d3.select(this)
				.style("stroke", 'black');
		}
	}

	function mousemove2(d){
		if(currentLabel == 'Deaths')
			tooltip3.html("Deaths: " + d.target.__data__.data.value)
		else
			tooltip3.html("Kills: " + d.target.__data__.data.value)
		tooltip3
			.style("position","absolute")
			.style('left', d.x - 900+ 'px')
			.style('top', d.y - 20 + 'px')
	}

	function mouseleave2(d){
		tooltip3
			.style("opacity", 0)
		d3.select(this)
			.style("stroke", 'none');
	}

	function createFilterTree(fil, fil2){
		if(selectedGroup == undefined && clickedRect == undefined){
			return data;
		}
		else if (selectedGroup == undefined && clickedRect != undefined){
			return data.filter(fil);
		}
		else if (selectedGroup != undefined && clickedRect == undefined){
			return data.filter(fil2);
		}
		else{
			return data.filter(fil).filter(fil2);
		}
	}
	
	function createTreemap(){
		methodTreeData = [];
		var dataTree = createFilterTree(clickFilter,menuFilter);
		//console.log(dataTree)
		d3.map(dataTree, function(d) { 
			methodTreeData.push(d.method);})

		var result = rollup(methodTreeData);

		var objs = [];
		var elem = [];
		for (var i=0; i<result[0].length; i++){
			elem = [];
			elem[0] = result[0][i];
			elem[1] = result[1][i];
			objs.push(elem);
		}
  
		objs.sort(function(a, b) { return b[1] - a[1]; });
		objs = objs.slice(0,6);
		//console.log(objs);
	
		//generate tree structure
		var listTree = [];
		var obj = [];
		obj["Method"] = "No method";
		obj["parent"] = "";
		obj["value"] = undefined;
		listTree.push(obj);
		for (var i=0; i<objs.length; i++){
			obj = [];
			obj["Method"] = objs[i][0];
			obj["parent"] = "No method";
			obj["value"] = objs[i][1];
			listTree.push(obj);
		}
		//console.log(listTree);

		var root = d3.stratify()
					.id(function(d) { return d.Method; })
					.parentId(function(d) { return d.parent; })
					(listTree);
		root.sum(function(d) { return +d.value })

		// Then d3.treemap computes the position of each element of the hierarchy
		// The coordinates are added to the root
		d3.treemap()
		.size([width, height])
		.padding(4)
		(root)
		//console.log(root.leaves())
		rootLeaves = root.leaves();

		//console.log(rootLeaves)
		return rootLeaves;
	}

	rootLeaves = createTreemap();
	
	//add rectangles
	svg2
		.selectAll("rect")
		.data(rootLeaves)
		.enter()
		.append("rect")
		.attr('x', function (d) { return d.x0; })
		.attr('y', function (d) { return d.y0; })
		.attr('width', function (d) { return d.x1 - d.x0; })
		.attr('height', function (d) { return d.y1 - d.y0; })
		.style("stroke-width", 4)
		.style("fill", function(d) {
			return myColor(d.value)} )
		.on("mouseover",mouseover2)
		.on("mousemove", mousemove2)
		.on("mouseleave", mouseleave2)
		.on("click",rectClick2);

	//add text labels
	svg2
		.selectAll("text")
		.data(rootLeaves)
		.enter()
		.append("text")
		.attr("x", function(d){ return d.x0+10})    // +10 to adjust position (right)
		.attr("y", function(d){ return d.y0+20})    // +20 to adjust position (down)
		.text(function(d){ return d.data.Method})
		.attr("font-size", "15px")
		.attr("fill", function(d) {
			if (d.value > 50){
				return "white"
			}
			return "black" });

	function updateTreemap() {

		if (clickedRect != undefined){
			clickFilter = function(d){return filterClick(d);}
		}
		if (selectedGroup != undefined){
			menuFilter = function(d){return filterData(d);}
		}

		var root = createTreemap();
		//console.log(root.leaves())

		squares2 = svg2.selectAll("rect")
			.data(rootLeaves)
			.join("rect")
		squares2.transition()
			.duration(750)
			.attr('x', function (d) { return d.x0; })
			.attr('y', function (d) { return d.y0; })
			.attr('width', function (d) { return d.x1 - d.x0; })
			.attr('height', function (d) { return d.y1 - d.y0; })
		squares2.style("stroke-width", 4)
			.style("fill", function(d) {
			return myColor(d.value)} )
			.on("mouseover",mouseover2)
			.on("mousemove", mousemove2)
			.on("mouseleave", mouseleave2)
			.on("click",rectClick2);

		text = svg2.selectAll("text")
			.data(rootLeaves)
			.join("text")
		text.transition()
			.duration(750)
			.attr("x", function(d){ return d.x0+10})    // +10 to adjust position (right)
			.attr("y", function(d){ return d.y0+20})    // +20 to adjust position (down)
			.text(function(d){ return d.data.Method})
			.attr("font-size", "15px")
			.attr("fill", function(d) {
				if (d.value > 50){
					return "white"
				}
				return "black" });
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var matrix, colors;
	var totalChord = 0;
	
	function createGroupsChord(fil,fil2){
		list_chord = [];
		matrix = [];
		colors = [];
		names = [];
		totalChord = 0;
		if(selectedGroup == undefined && clickedRect == undefined){
			epGroups = d3.group(data, d => d.killer_chord, d => d.killed_chord)
		}
		else if (selectedGroup == undefined && clickedRect != undefined){
			epGroups = d3.group(data.filter(fil), d => d.killer_chord, d => d.killed_chord)
		}
		else if (selectedGroup != undefined && clickedRect == undefined){

			epGroups = d3.group(data.filter(fil2), d => d.killer_chord, d => d.killed_chord)
		}
		else{
			epGroups = d3.group(data.filter(fil).filter(fil2), d => d.killer_chord, d => d.killed_chord)
		}
		//console.log(epGroups)
		epGroups.forEach( function (vals, key) {
			summary_vals = vals.forEach( function (val2, key2) {
				currentKiller = key;
				currentKilled = key2;
				return_object = {
					killer: key,
					name: key2,
					val: val2.length,
					info: epGroups.get(currentKiller).get(currentKilled)
				};
				list_chord.push(return_object)
			});
		});
		for (var i = 0; i < list_chord.length; i++){
			totalChord = totalChord + list_chord[i].val;
			names.push(list_chord[i].killer);
			names.push(list_chord[i].name);
		}
	
		names = names.filter (function (value, index, array) { 
			return names.indexOf (value) == index;
		});

		names = names.sort(function(a, b) {
			return names_order.indexOf(a) - names_order.indexOf(b);
		  });


		for (var i = 0; i < names.length; i++){
			matrix.push(new Array(names.length+1).join('0').split('').map(parseFloat));
			colors.push(colors_order[names_order.indexOf(names[i])]);
		}
		
		for (var i = 0; i < list_chord.length; i++){
			//console.log(list_chord[i])
			killer = names.indexOf(list_chord[i].killer);
			killed = names.indexOf(list_chord[i].name);
			matrix[killer][killed] = list_chord[i].val / totalChord;
			var order = names_order.indexOf(list_chord[i].killer);
			allegiances_chord[order] = list_chord[i].info[0].killershouse;
		}
		return matrix;
	}
	matrix = createGroupsChord(null);
		
	var width3="700", height3="700";
	var svg3 = d3.select("#chord")
		.append("svg")
		  .attr("width", width3)
		  .attr("height", height3)
		.append("g")
		  .attr("transform", "translate(0,0)");
	  
	tooltip3 = d3.select("#chord")
		.append("div")
		.style("opacity", 0)
		.attr("class", "tooltip")
		.style("background-color", "white")
		.style("font-size", "15px")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "5px")
		.style("padding", "5px");
	  
	var outerRadius = Math.min(width3, height3) * 0.5 - 150;
	var innerRadius = outerRadius - 30;
	  	  
	var chord = d3.chord()
		.padAngle(0.03)
		.sortSubgroups(d3.descending);
	
	var arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);
	
	var ribbon = d3.ribbon()
		.radius(innerRadius);
	
	var color = d3.scaleOrdinal()
		.domain(d3.range(4))
		.range(colors);
	
	var g = svg3.append("g")
		.attr("transform", "translate(" + 300 + "," + 350 + ")")
		.datum(chord(matrix));
	
	var group = g.append("g")
		.attr("class", "groups")
		.attr("font-size", 10)
		.selectAll("g")
		.data(function(chords) { return chords.groups; })
		.enter().append("g")
		.on("mouseover", function(d,i){
			if (clickedHouse == undefined) return fade(d);
		})
		.on("mouseout", function(d){ 
			if (clickedHouse == undefined) return fadeAll(1);
		})
		.on("click", function(d){ rectClick3(d); fadeAll(1); fade(d);});
	  
	group.append("path")
		.style("fill", function(d) { return color(d.index); })
		.style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
		.attr("d", arc)
		.on("mousemove", showTooltip())
		.on("mouseout", hideTooltip());
	  
	var groupTick = group.selectAll(".group-tick")
		.data(function(d) { return groupTicks(d, 1e3); })
		.enter().append("g")
		  .attr("class", "group-tick")
		  .attr("transform", function(d) { 
			return "rotate(" + (d.angle * 180 / Math.PI - 90) + 
			  ") translate(" + outerRadius + ",2)";
		  });
	  
	groupTick.append("line")
		.attr("x2", 6);
	
	groupTick
		.append("text")
		  .attr("x", 8)
		  .attr("dy", ".35em")
		  .attr("transform", function(d) { return d.angle > Math.PI && d.angle < Math.PI*2 ? "rotate(180) translate(-16)" : null; })
		  .style("text-anchor", function(d) { return d.angle > Math.PI && d.angle < Math.PI*2 ? "end" : null; })
		  .text(function(d) { return names[d.index]; });
	  
	var ribbons = g.append("g")
		.attr("class", "ribbons")
		.attr("fill-opacity", 1)
		.selectAll("path")
		.data(function(chords) { return chords; })
		.enter().append("path")
		  .attr("d", ribbon)
		  .style("fill", function(d) { return color(d.source.index); })
		  .style("stroke", function(d) { return d3.rgb(color(d.source.index)).darker(); })
		  .on("mousemove", showTooltipArc())
		  .on("mouseover", fadeArc(0.1))
		  .on("mouseout", function(d) {
			tooltip3.style("opacity", 0);
		  })
		  .on("mouseout", fadeArc(1));
	  
	  
	function groupTicks(d, step) {
		var k = (d.endAngle - d.startAngle) / d.value;
		return d3.range(0, d.value, step).map(function(value) {
		  return {
			index: d.index,
			value: value, 
			angle: value * k + d.startAngle + d.value*1.5
		  };
		});
	  }

	var selectedIndex;
	function fade(d) {
		selectedIndex = d.target.__data__.index;
		d3.selectAll("g.ribbons path")
			.filter(function(d,i) {
				return d.source.index != selectedIndex && d.target.index!= selectedIndex;
			})
			.transition()
			.duration(60)
			.style("opacity", 0.05); 
	  }

	  
	function fadeAll(opacity) {
		d3.selectAll("g.ribbons path")
			.transition()
			.duration(60)
			.style("opacity", opacity);  
  	}

	  
	function showTooltip() {
		var p = d3.format(".2%"), q = d3.format(",.4r")
		return function(d) {
			tooltip3
				.style("opacity", 1)
				.html(names[d.srcElement.__data__.index] + "→ " + p(d.target.__data__.value) + " of the kills")
				.style("position", "absolute")
				.style('left', d.x - 900+ 'px')
				.style('top', d.y - 20 + 'px')
		};
	  }
	  
	function hideTooltip() {
		return function(d) {
			tooltip3
				.style("opacity", 0)
		};
	  }
	  
	function fadeArc(opacity) {
		return function(d, i) {
			g.selectAll(".ribbons path").filter(function(d) { 
				return d.source.index != i.source.index || d.target.index != i.target.index;
			})
				.transition()
                .style("opacity", opacity);  
		};
	}

	function showTooltipArc() {
		var p = d3.format(".2%"), q = d3.format(",.4r")
		return function(d) {
			tooltip3
				.style("opacity", 1)
				.html("Killer → Killed:<br/>" + 
				names[d.target.__data__.source.index] + "→ " + names[d.target.__data__.target.index] + ": " + p(d.target.__data__.source.value) + "<br/>" +
				names[d.target.__data__.target.index] + "→ " + names[d.target.__data__.source.index] + ": " + p(d.target.__data__.target.value))
				.style("position", "absolute")
				.style('left', d.x - 900+ 'px')
				.style('top', d.y - 20 + 'px')
		};
	  }

	function updateChord() {
		if (clickedRect != undefined){
			clickFilter = function(d){return filterClick(d);}
		}
		if (selectedGroup != undefined){
			menuFilter = function(d){return filterData(d);}
		}
		var data = createGroupsChord(clickFilter, menuFilter);
		console.log(data);

		///
		
		var color = d3.scaleOrdinal()
			.domain(d3.range(4))
			.range(colors);

		var chords = chord(data);

		var ribbonsUpdate = ribbons.selectAll("path")
		  .data(chords, ({source, target}) => source.index + '-' + target.index)
	  
		var groupUpdate = group.selectAll("g")
		  .data(chords.groups)
	  
		var groupTickUpdate = group.selectAll(".group-tick")
			.attr("class", "group-tick")
			.data(function(d) { return groupTicks(d, 1e3); })
	  
		var duration = 500;
	  
	  	// ribbons
		ribbonsUpdate
		  .transition()
			.duration(duration)
			  .attr("d", ribbon)
			  .style("fill", function(d) { return color(d.source.index); })
			  .style("stroke", function(d) { return d3.rgb(color(d.source.index)).darker() })
	  
		ribbonsUpdate
		  .enter()
			.append("path")
			.attr("opacity", 0)
			.attr("d", ribbon)
			.style("fill", function(d) { return color(d.source.index); })
			.style("stroke", function(d) { return d3.rgb(color(d.source.index)).darker(); })
			.on("mousemove", showTooltipArc())
			.on("mouseover", fadeArc(0.1))
			.on("mouseout", function(d) {
			  tooltip3.style("opacity", 0);
			})
			.on("mouseout", fadeArc(1))
			.transition()
			  .duration(duration)
			  .attr("opacity", 1);
	  
		ribbonsUpdate
		  .exit()
			.transition()
			  .duration(duration)
			  .attr("opacity", 0)
			  .remove();
	  
		// arcs
		groupUpdate
		  .select('path')
		  .transition()
			.duration(duration)
			.attr("d", arc)
			.style("fill", function(d) { return color(d.index); })
			.style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
	  
		const groupUpdateG = groupUpdate.enter().append('g')
			.on("mouseover", function(d,i){
				if (clickedHouse == undefined) return fade(d);
			})
			.on("mouseout", function(d){ 
				if (clickedHouse == undefined) return fadeAll(1);
			})
			.on("click", function(d){ rectClick3(d); fadeAll(1); fade(d);});
		
		groupUpdateG
		  .append("path")
			.attr("opacity", 0)
			.attr("d", arc)
			.style("fill", function(d) { return color(d.index); })
			.style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
			.on("mousemove", showTooltip())
			.on("mouseout", hideTooltip())
			.transition()
			  .duration(duration)
			  .attr("opacity", 1)
	  
		groupUpdate
		  .exit()
			.transition()
			.duration(duration)
			.attr("opacity", 0)
			.remove(); 
	  
	  	// groupticks
		groupTickUpdate
		  .transition()
			.duration(duration)
			.attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",2)"; });

		groupTickUpdate
		  .enter()
			.append("g")
			.attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",2)"; })
		  .append("line")
			.attr("x2", 6)
		  .append("text")
			.attr("x", 8)
			.attr("dy", ".35em")
			.attr("transform", function(d) { return d.angle > Math.PI && d.angle < Math.PI*2 ? "rotate(180) translate(-16)" : null; })
			.style("text-anchor", function(d) { return d.angle > Math.PI && d.angle < Math.PI*2 ? "end" : null; })
			.text(function(d) { return names[d.index]; });
	  
		groupTickUpdate
		  .exit()
			.transition()
			  .duration(duration)
			  .attr("opacity", 0)
			  .remove();
	}
})
})