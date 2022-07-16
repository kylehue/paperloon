let home = {
	
};

$.ajaxSetup({async: false});
$.get("../js/views/home.html", function(data) {
	home.template = data;
}, "html");