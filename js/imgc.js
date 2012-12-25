function imgcal_init () {
	alert ("function not implemented");
	$.ajax ({
		type : "GET",
		url : "/gcal/fetchgooglecal",
		success : function (resurl) {
			window.location = resurl;
		}
	});
}
