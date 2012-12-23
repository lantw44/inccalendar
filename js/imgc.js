function imgcal_init () {
	$.ajax ({
		type : "GET",
		url : "/gcal/fetchgooglecal",
		success : function (resurl) {
			window.location = resurl;
		}
	});
}
