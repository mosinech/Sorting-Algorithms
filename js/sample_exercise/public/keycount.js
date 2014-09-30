/*
Author: George Zhao

Create an html page with a text-area and a button to sum up key counts in the text 
area. Each line of the text area is expected to contain data in the format of 'key, 
count' where the count is parse-able into an integer. 

Here are some use cases that how I would parse the string below
Strings         -> Converted associative array

Jane**, $$89$$	-> {'Jane**': 89}
_Jane, 89.99	-> {'_Jane' : 89}
Ja32ne, $312	-> {'Ja32ne': 312}
  Jane  , 12	-> {'Jane': 12} //notice the space before and after Jane is trimmed
Jane Mayer , 12 -> {'Jane Mayer', 12} //space between the string is not trimmed
jane, 12e+3     -> {'jane': 12000} // key is case sensitive and we take exp number

Assumption made:
- key is case sensitive
- all characters before comma is the key, except the leading and ending spaces
- the first occuring number after the comma is the count, anything else will be discarded
- the integer addition will be reasonably small otherwise the precision
  will be rounded off to 16 digits.
*/

var app = angular.module("keyCountApp", []); // Start keyCountApp

// Create keyCountCtrl
app.controller("keyCountCtrl", ['$scope', function($scope){
	$scope.input = {};
	$scope.input.textarea = "";
	$scope.results = {};
	$scope.error = false;

	// create an event to count the keys
	$scope.countKeys = function(){
		
		$scope.results = keyCountModule.countKeys($scope.input.textarea);
		// If the input is valid, reset the textarea
		if($scope.results) {
			$scope.input.textarea = "";
			$scope.error = false;
		}
		else
			$scope.error = true;
	}

	QUnit.test("Keys Count Test", function(assert){
		var test1 = "'Jane,2\njohn,5'"
		  , test2 = "'Ja32ne,sf5\njane,5\nJohn@@,3\njane,2\n jane ,20  '"
		  , test3 = "'Jane,\n\n\nJane,3\nJohn Jane, 4,\n john Jane  ,,5,,,,\nJane,5.98'"
		  , test4 = "'Jane\nJohnSSS, 4e20\n JohnSSS, 5\n Jane, 4e5\nJane,5\nPeter, 400e-1'";
		// assert.deepEqual is used to test for objects
		// whereas assert.equal is used to test for
		// primative variables
		assert.deepEqual(keyCountModule.countKeys(test1), 
						 {'Jane': 2, 
						  'john': 5});
		assert.deepEqual(keyCountModule.countKeys(test2), 
		 				{'Ja32ne': 5, //numbers can be between alphabets
						 'jane': 27,  //spaces before and after the key is trimmed
						 'John@@': 3}); // special characters are allowed in key
		assert.deepEqual(keyCountModule.countKeys(test3), 
						 {'Jane': 8, // 5.98 is not rounded off, it's taken as 5
						  'John Jane': 4, //space between characters are allowed in the key
						  'john Jane': 5}); //the key is case-sensitive
		assert.deepEqual(keyCountModule.countKeys(test4), 
						{'Jane': 400005, // 4e5 is converted to 400000
						 'JohnSSS': 4e+20,
						 'Peter': 40}); //4e20 + 5 is rounded off to 4e+20


	});
	
}]);

// Using module to create closure
// In addition any variables created in module will live in memory
// which saves additional calculation to create the object later 
// although in this case it's not very useful.
// Module is used here more to show a proof of concept
var keyCountModule = (function(){
	var finalResult = {}; // stays on stack

	var countKeys = function(textarea){
		finalResult = {};

		// Remove all the whitespaces, carriage returns and tabs
		var text = textarea.trim();
		
		// If it doesn't match ' in beginning of input
		// and ' at the end of input. Ask user to 
		// re-enter
		if(!(text.match(/'$/gm) && text.match(/^'/gm))){
			return false;
		}
		else{
			text = text.replace(/^'/g, "").replace(/'$/g, "");

		}
		var inputLines = text.split("\n");

		// angular.forEach is different from Array.forEach
		angular.forEach(inputLines, function(line){

			// Create regex to match key and count
			// Assuming all keys are characters before comma
			// Assuming all count matches [0-9]+
			// It even handle integer like 8e+10 nut not decimal 
			// numbers
			var regex = /([^,]+),[^0-9]*([0-9]+e[+|-]?[0-9]+|[0-9]+)/g;
			
			// This regex match removes all the unqualified strings
			var matches = regex.exec(line);
			if(matches){
				var key = matches[1].trim()  // key is case-sensitive
				  , expNumberRegex = /([0-9]+)e([+|-]?[0-9]+)/g
				  , count
				  , expNumMatches = expNumberRegex.exec(matches[2]);

				if(expNumMatches){
					count = expNumMatches[1] * Math.pow(10, expNumMatches[2]);
					if(count < 1) // handles number like 2e-2
						count = 0;
				}
				else{
					count = parseInt(matches[2]);
				}

				// Because of javascript integer digit limit is 16
				// Any number added beyong 16 digits is rounded off
				if(key in finalResult){
					finalResult[key] += count;
				}
				else{
					finalResult[key] = count;
				}
			}
		});	
		return finalResult;
	}

	return {
		countKeys: countKeys
	}
})();