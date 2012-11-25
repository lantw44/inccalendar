function getcookievalue(vname){
	var cookiearr = document.cookie.split(";");
	var rval = "";
	var i;
	for(i=0;i<cookiearr.length;i++){
		if((cookiearr[i].substr(0, cookiearr[i].indexOf("="))).replace(" ", "") == vname){
			rval = unescape(cookiearr[i].substr(cookiearr[i].indexOf("=") + 1));
		}
	}
	return rval;
}

function setcookievalue(vname, val){
	document.cookie = vname + "=" + escape(val);
}

function cookie_exists(vname){
	var cookiearr = document.cookie.split(";");
	var yes = 0;
	var i;
	for(i=0;i<cookiearr.length;i++){
		if((cookiearr[i].substr(0, cookiearr[i].indexOf("="))).replace(" ", "") == vname){
			yes = 1;
			break;
		}
	}
	return yes;
}
