Requirements:
	- node.js to run the application
	- port 5888 must be available to start the localhost

Start:
	run the following command on commandline:
		node app.js
	open up a browser to visit:
		localhost:5888/keycount
		localhost:5888/palindrome

Test Examples:
	please see file: test.txt for some testing examples

Keys Count:
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

Palindrome Detection:
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

