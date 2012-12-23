function imgcal_init () {
	$.ajax ({
		type : "GET",
		url : "/google/fetchgooglecal",
		success : function (resurl) {
			window.location = resurl;
		}
	});
}