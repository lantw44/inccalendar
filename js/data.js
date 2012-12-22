var caleventlist;
var caleventok;

function CalEvent(){
	this.key = null;
	this.title = "新活動";
	this.content = "關於此活動的描述";
	this.icon = 0;
	this.remind = 30;
	this.datafrom = "native";
	this.datetime = new Date();
	this.deleted = false;
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
	this.clone = function(){
		var newobj = new CalEvent();
		newobj.key = this.key;
		newobj.title = this.title;
		newobj.content = this.content;
		newobj.icon = this.icon;
		newobj.remind = this.remind;
		newobj.datafrom = this.datafrom;
		newobj.deleted = this.deleted;
		newobj.datetime.setFullYear(
			this.datetime.getFullYear(),
			this.datetime.getMonth(),
			this.datetime.getDate());
		newobj.datetime.setHours(
			this.datetime.getHours(),
			this.datetime.getMinutes(), 0, 0);
		return newobj;
	}
}

function create_xmlhttp_object(){
	var rq;
	try{
		rq = new XMLHttpRequest();
	}catch(err){
		try{
			rq = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(err){
			try{
				rq = new ActiveXObject("Microsoft.XMLHTTP");
			}catch(err){
				rq = null;
			}
		}
	}
	return rq;
}

function inccal_fetch(year, month){
	status_bar_save();
	caleventok = false;
	caleventlist = new Array();
	var should_continue = true;
	var gqlcursor = null;
	var postdata;
	var retrdata;
	var calevent;
	var eventobj;
	var progcounter = 0;
	var timecounter = 0;
	var loadingstr = '載入中......';
	var rq;
	var i;
	while(should_continue){
	  	status_bar_set(loadingstr + ' 已下載 ' + timecounter.toString() + 
				' 次，共取得 ' + progcounter.toString() + ' 項資料');
		rq = create_xmlhttp_object();
		rq.open('POST', '/access/fetch', false);
		rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if(month == null){
			postdata = 'year=' + year.toString();
		}else{
			postdata = 'year=' + year.toString() + '&month=' + month.toString();
		}
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
				parseInt(calevent[i].getElementsByTagName("minute")[0].childNodes[0].nodeValue),
				0, 0);
			caleventlist.push(eventobj);
		}
		timecounter++;
		progcounter += calevent.length;
		try{
			gqlcursor = retrdata.getElementsByTagName("gqlcursor")[0].childNodes[0].nodeValue;
		}catch(err){
			should_continue = false;
		}
	}
	caleventok = true;
	status_bar_restore();
}

function inccal_send(calevt, do_func, funcseconddata){
	var rq = create_xmlhttp_object();
	var str = "";
	str = 'icon=' + encodeURIComponent(calevt.icon.toString()) + '&' +
		'title=' + encodeURIComponent(calevt.title) + '&' +
		'content=' + encodeURIComponent(calevt.content) + '&' + 
		'remind=' + encodeURIComponent(calevt.remind.toString()) + '&' + 
		'datafrom=' + encodeURIComponent(calevt.datafrom) + '&' +
		'year=' + encodeURIComponent(calevt.datetime.getFullYear()) + '&' +
		'month=' + encodeURIComponent(calevt.datetime.getMonth() + 1) + '&' +
		'date=' + encodeURIComponent(calevt.datetime.getDate()) + '&' +
		'hour=' + encodeURIComponent(calevt.datetime.getHours()) + '&' + 
		'minute=' + encodeURIComponent(calevt.datetime.getMinutes());
	if(calevt.key == null){
		rq.open('POST', '/access/insert');
		rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		rq.send(str);
	}else{
		rq.open('POST', '/access/update');
		rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		rq.send(str + '&key=' + encodeURIComponent(calevt.key));
	}
	rq.onreadystatechange = function(){
		if(rq.readyState == 4){
			if(rq.status == 200){
				if(do_func != null){
					do_func(rq.responseText, funcseconddata);
				}
			}else{
				status_bar_warning("伺服器回傳 " + rq.status.toString() + " 錯誤");
			}
		}
	}
}

function inccal_remove(calevt, do_func){
	var rq = create_xmlhttp_object();
	var str = "";
	str = 'key=' + encodeURIComponent(calevt.key);
	rq.open('POST', '/access/remove');
	rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	rq.send(str);
	rq.onreadystatechange = function(){
		if(rq.readyState == 4){
			if(rq.status == 200){
				status_bar_set("資料已刪除");
				if(do_func != null){
					do_func();
				}
			}else{
				status_bar_warning("伺服器回傳 " + rq.status.toString() + " 錯誤");
			}
		}
	}

}
