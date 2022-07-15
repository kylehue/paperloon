let login = {
	data() {
    return {
      
    }
  },
	methods: {
		
	}
};

$.ajaxSetup({async: false});
$.get("../js/views/login.html", function(data) {
	login.template = data;
}, "html");