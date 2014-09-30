/*
Author: George Zhao

Create an html page with an input field and a button to determine if the input field
contains a palindrome. A palindrome is a word or phrase that is spelled exactly the 
same forwards or backwards, like "pop" or "Ah, Satan sees Natasha".

The goal of this project is not only detect the entire string is a palindrome,
but also the string contains a palindrom, which is more complicated than the piror
e.g. both "aPop" and "pop" will return true because "aPop" contains "Pop", which is
a palindrome, assuming a letter itself cannot be a palindrome.

For the solution, I am going to use Manacher’s Algorithm, which has O(n)
performance. I used a little tweak on algorithm. Although Manacher's Algorithm
is used to find the longest Palindrom in a string, we only need to look for
same left and right element at any point of the string to confirm if it contains
a palindrome.
*/
var app = angular.module("palindromeApp", []); // Start palindromeApp

// Create keyCountCtrl
app.controller("palindromeCtrl", ['$scope', function($scope){
	$scope.input = {};
	$scope.input.text = "";
	$scope.results = {};
	$scope.results.show = false;
	$scope.results.palindrome = false;
	$scope.error = false;

	// create an event to count the keys
	$scope.palindrome = function(){
		$scope.results.show = true;
		$scope.results.text = $scope.input.text;
		$scope.results.palindrome = palindromeModule.containsPalindrome($scope.input.text);
	}

	QUnit.test("Palindrom Detection Test", function(assert){
		var test1 = "abcdabcdabcd"; //false
		var test2 = "aPop"; //true
		var test3 = "Ah, Satan sees Natasha"; //true
		var test4 = "a"; //false
		var test5 = "akcab#$ ad, abc"; //true
		var test6 = "t00k." //true
		assert.equal(palindromeModule.containsPalindrome(test1), false);
		assert.equal(palindromeModule.containsPalindrome(test2), true);
		assert.equal(palindromeModule.containsPalindrome(test3), true);
		assert.equal(palindromeModule.containsPalindrome(test4), false);
		assert.equal(palindromeModule.containsPalindrome(test5), true);
		assert.equal(palindromeModule.containsPalindrome(test6), true);
		
	});


}]);


// Using module to create closure
// In addition, any variables created in module will live in memory
// which saves additional calculation to create the object later 
// although in this case it's not very useful.
// Module is used here more to show a proof of concept
var palindromeModule = (function(){
	// a tweak of Manacher's Algorithm
	var containsPalindrome =  function(text){
		// Remove all non alphebatical characters in the string
		// and convert all characters to lower cases
		var cleanLine = text.replace(/[^a-z0-9]/gi, "").toLowerCase();
		var testArray = cleanLine.split("");

		// one letter is not a palindrome
		if (testArray.length == 1)
			return false;

		// Iterate through the whole string
		// if the left and right element are the same,
		// then it contains a palindrome
		for(var ii = 1; ii < testArray.length-1;ii++){
			if (testArray[ii-1] == testArray[ii+1] ||
				testArray[ii]   == testArray[ii+1] ||
				testArray[ii]   == testArray[ii-1] )
				return true;
		}
		return false;
	};

	//	Manacher’s Algorithm, which has O(n) performance.
	var longestPalindrome = function(cleanLine) {
		// Adding # between all characters and $ before the string
		var testString = "$#"+cleanLine.split("").join("#")+"#"
		  , mx = 0
		  ,	id = 0
		  , testArray = testString.split("")
		  , pointerArray  = Array.apply(null, new Array(testArray.length)).map(Number.prototype.valueOf,0);


		for(var ii = 1; ii < p.length; ii++){
			pointerArray[ii] = (mx - ii) ? Math.min(pointerArray[mx*2-1] ,mx-1) : 1;
			while( testArray[ii+pointerArray[ii]] == testArray[ii-pointerArray[ii]])
				pointerArray[ii] ++;

			if(ii + pointerArray[ii] > mx){
				mx = ii + pointerArray[ii];
				id = ii;
			}
		}
	};

	return {
		containsPalindrome: containsPalindrome,
		longestPalindrome: longestPalindrome
	}


})();