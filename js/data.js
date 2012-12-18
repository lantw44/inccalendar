var caleventlist;
var caleventok;

function CalEvent(){
	this.key = null;
	this.title = "活動標題";
	this.content = "活動內容";
	this.icon = 0;
	this.remind = 30;
	this.datafrom = "native";
	this.datetime = new Date();
	this.equal = function(another){
		return this.key == another.key &&
			this.equalIgnoreKey(another);
	}
	this.equalIgnoreKey = function(another){
		return this.title == another.title && 
			this.content == another.content &&
			this.icon == another.icon &&
			this.remind == another.remind &&
			this.datafrom == another.datafrom &&
			this.datetime.toString() == another.datetime.toString();
	}
}

function create_xmlhttp_object(){
	var rq;
	rq = new XMLHttpRequest();
	return rq;
}

function inccal_fetch(year, month){
	status_bar_save();
	status_bar_set('載入中......');
	caleventok = false;
	caleventlist = new Array();
	var should_continue = true;
	var gqlcursor = null;
	var postdata;
	var retrdata;
	var calevent;
	var eventobj;
	var i;
	while(should_continue){
		rq = create_xmlhttp_object();
		rq.open('POST', '/access/fetch', false);
		rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		postdata = 'year=' + year.toString() + '&month=' + month.toString();
		if(gqlcursor != null){
			postdata = postdata + '&gqlcursor=' + encodeURIComponent(gqlcursor);
		}
		rq.send(postdata);
		retrdata = rq.responseXML.documentElement;
		calevent = retrdata.getElementsByTagName("calevent");
		if(calevent.length == 0){
			should_continue = false;
		}
		for(i=0; i<calevent.length; i++){
			eventobj = new CalEvent();
			eventobj.key = calevent[i].getElementsByTagName("key")[0].childNodes[0].nodeValue;
			eventobj.title = calevent[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
			eventobj.content = calevent[i].getElementsByTagName("content")[0].childNodes[0].nodeValue;
			eventobj.icon = parseInt(calevent[i].getElementsByTagName("icon")[0].childNodes[0].nodeValue);
			eventobj.remind = parseInt(calevent[i].getElementsByTagName("remind")[0].childNodes[0].nodeValue);
			eventobj.datafrom = calevent[i].getElementsByTagName("datafrom")[0].childNodes[0].nodeValue;
			eventobj.datetime = new Date();
			eventobj.datetime.setFullYear(
				parseInt(calevent[i].getElementsByTagName("year")[0].childNodes[0].nodeValue),
				parseInt(calevent[i].getElementsByTagName("month")[0].childNodes[0].nodeValue - 1),
				parseInt(calevent[i].getElementsByTagName("date")[0].childNodes[0].nodeValue)
			);
			eventobj.datetime.setHours(
				parseInt(calevent[i].getElementsByTagName("hour")[0].childNodes[0].nodeValue),
				parseInt(calevent[i].getElementsByTagName("month")[0].childNodes[0].nodeValue),
				0, 0);
			caleventlist.push(eventobj);
		}
		try{
			gqlcursor = retrdata.getElementsByTagName("gqlcursor")[0].childNodes[0].nodeValue;
		}catch(err){
			should_continue = false;
		}
	}
	caleventok = true;
	status_bar_restore();
}
