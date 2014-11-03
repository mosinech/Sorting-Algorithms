/**
 This is a project to display a tree of navigator from 
 a given navagation variable as show below
	var navigation = {
		source: "/home",
		text: "root",
		children: [
			{
				source: "/example1",
				text: "example1",
				children: []
			},
			{
				source: "/example2",
				text: "example2",
				children: [
					{
						source: "/example2/1",
						text: "example2/1",
						children: [{
							source: "/example2/1/1",
							text: "example2/1/1",
							children: []
						},
						{
							source: "/example2/1/2",
							text: "example2/1/2",
							children: []
						},
						{
							source: "/example2/1/3",
							text: "example2/1/3",
							children: []
						}]
					},
					{
						source: "/example2/2",
						text: "example2/2",
						children: []
					}
				]
			},
			{
				source: "/example3",
				text: "example3",
				children: []
			},
		]
	};

 The following tree must be displayed in a fashion that
 the parent and child element relationship is visible 
 from the html page.


*/

var navManager = (function(){
	var defaultNav = {
		source: "/home",
		text: "root",
		children: [
			{
				source: "/child1",
				text: "child1",
				children: []
			},
			{
				source: "/child2",
				text: "example2",
				children: [
					{
						source: "/example2/1",
						text: "example2/1",
						children: [{
							source: "/example2/1/1",
							text: "example2/1/1",
							children: []
						},
						{
							source: "/example2/1/2",
							text: "example2/1/2",
							children: []
						},
						{
							source: "/example2/1/3",
							text: "example2/1/3",
							children: []
						}]
					},
					{
						source: "/example2/2",
						text: "example2/2",
						children: []
					}
				]
			},
			{
				source: "/example3",
				text: "example3",
				children: []
			},
		]
	};

	var nav = function (navigation, html){
		navigation = navigation || defaultNav; // Either takes a navigation object or use the default nav
		html = html || ""; // Set html default to empty string

		// If the navigator has not children
		// add its source to html and return the html to the parent 
		if(navigation['children'].length === 0){
			html+='<ul><a href="'+navigation['source']+'">'+navigation['text']+'</a></ul>';
			return html;
		}

		// Add opening tag
		html += "<ul>";
		html += '<a href="'+navigation['source']+'">'+navigation['text']+'</a>';
		
		// underscore forEach is faster than native and 
		// browser compatible for IE8
		_.forEach(navigation['children'], function(child){
			// reassign the html after it's been passed back
			// to its parent because it contains all the 
			// children information
			html = nav(child, html); 
		})
		html += "</ul>"; // Add closing tag
		return html;
	};
	return {
		config: function(navigation){
			defaultNav = navigation || defaultNav;
		},
		generate: nav
	}
}) ();

$(document).ready(function(){
	QUnit.test("Navigator Test", function(assert){
		var result1 = '<ul><a href="/home">root</a><ul><a href="/example1">example1</a></ul><ul><a href="/example2">example2</a><ul><a href="/example2/1">example2/1</a><ul><a href="/example2/1/1">example2/1/1</a></ul><ul><a href="/example2/1/2">example2/1/2</a></ul><ul><a href="/example2/1/3">example2/1/3</a></ul></ul><ul><a href="/example2/2">example2/2</a></ul></ul><ul><a href="/example3">example3</a></ul></ul>'; //true
		
		var test2 = {
			source: "/home",
			text: "root",
			children: [
				{
					source: "/example1",
					text: "example1",
					children: []
				},
			]
		};
		var result2 = '<ul><a href=\"/home\">root</a><ul><a href=\"/example1\">example1</a></ul></ul>';
		

		assert.equal(navManager.generate(), result1);
		navManager.config(test2); // assign test2 element as defaultNav
		assert.equal(navManager.generate(), result2);
	});

	$("#navigation").html(navManager.generate());
});
