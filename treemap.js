var file = "GOT_deaths.csv"
data = d3.csv(file, function(d) {
  	return {
    	method : d['Method']
  	};
}).then(function(data) {
  
	var method = [];
	data.map(function(d) {
		method.push(d.method);
	})

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
	var margin = {top: 10, right: 10, bottom: 10, left: 10},
		width = 600 - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#tree_map")
				.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");

	function createTreemap(){
		var result = rollup(method);

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
		obj["Method"] = "Origin";
		obj["parent"] = "";
		obj["value"] = "";
		listTree.push(obj);
		for (var i=0; i<objs.length; i++){
			obj = [];
			obj["Method"] = objs[i][0];
			obj["parent"] = "Origin";
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

		//add rectangles
		svg
			.selectAll("rect")
			.data(rootLeaves)
			.enter()
			.append("rect")
			.attr('x', function (d) { return d.x0; })
			.attr('y', function (d) { return d.y0; })
			.attr('width', function (d) { return d.x1 - d.x0; })
			.attr('height', function (d) { return d.y1 - d.y0; })
			.style("stroke", "black")
			.style("fill", "#69b3a2");
	
		//add text labels
		svg
			.selectAll("text")
			.data(rootLeaves)
			.enter()
			.append("text")
			.attr("x", function(d){ return d.x0+10})    // +10 to adjust position (right)
			.attr("y", function(d){ return d.y0+20})    // +20 to adjust position (down)
			.text(function(d){ return d.data.Method})
			.attr("font-family", "Roboto")
			.attr("font-size", "15px")
			.attr("fill", "white");
		return rootLeaves;
	}
  
  	rootLeaves = createTreemap();

	function updateTreemap() {

		method = method.filter(function(str) { return str.indexOf('Dragonfire (Dragon)') === -1; });

		var root = createTreemap();
		//console.log(root.leaves())

		squares = svg.selectAll("rect")
			.data(rootLeaves)
			.join("rect")
		squares.transition()
			.duration(1000)
			.attr('x', function (d) { return d.x0; })
			.attr('y', function (d) { return d.y0; })
			.attr('width', function (d) { return d.x1 - d.x0; })
			.attr('height', function (d) { return d.y1 - d.y0; })
		squares.style("stroke", "black")
			.style("fill", "#69b3a2");

		text = svg.selectAll("text")
			.data(rootLeaves)
			.join("text")
		text.transition()
			.duration(1000)
			.attr("x", function(d){ return d.x0+10})    // +10 to adjust position (right)
			.attr("y", function(d){ return d.y0+20})    // +20 to adjust position (down)
			.text(function(d){ return d.data.Method})
			.attr("font-family", "Roboto")
			.attr("font-size", "15px")
			.attr("fill", "white");
	
			//.on("mouseover",mouseover)
			//.on("mousemove", mousemove)
			//.on("mouseleave", mouseleave)
	}
	var waited = 0;
	var check = function(){
		if(waited){
			updateTreemap();
		}
		else {
			setTimeout(check, 2000); // check again in a second
			waited = 1;
		}
	}	
	check();
})