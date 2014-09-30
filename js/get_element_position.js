
var module= (function(){
	var ele = document.getElementById("test");
	ele.addEventListener("click", function(){
	    var button = this.getBoundingClientRect();
	    alert(button.top + "," +button.bottom);
	});
});