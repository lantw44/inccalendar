function pushevent () {//將活動放入行事曆中
	var year = parseInt ($ ("#year").text ());
	var dataclass = ["date", "week", "time", "title", "content"];
	var Day = ["日", "一", "二", "三", "四", "五", "六"];
	var eventid, dataid, datetime;
	var calevent = new Array ();
	for (var month = 1 ; month <= 12 ; month++) {
		inccal_fetch (year, month);
		for (var i = 0 ; i < caleventlist.length ; i++) {
			calevent.push (caleventlist[i]);
		}
	}
	for (var i = 0 ; i < calevent.length ; i++) {
		eventid = "event" + (i + 1);
		if ($ ("#" + eventid + "head").length == 0) {//這一行還沒有
			$ ("#eventbody").append ("<tr id = \"" + eventid + "head\"></tr>");
			$ ("#" + eventid + "head").addClass ("event");
			for (var j = 0 ; j < 4 ; j++) {
				dataid = eventid + dataclass[j];
				$ ("#" + eventid + "head").append ("<td id = \"" + dataid + "\"></td>");
				$ ("#" + dataid).addClass (dataclass[j]);
				$ ("#" + dataid).attr ({"onclick":"togglecontent (this.id);"});
			}
			$ ("#eventbody").append ("<tr id = \"" + eventid + "body\" class = \"event\"><td id = \"" + eventid + "content\"></td></tr>");
			$ ("#" + eventid + "content").addClass ("content");
			$ ("#" + eventid + "content").attr ({"colspan":"4"});
		}
		datetime = calevent[i]["datetime"];
		$ ("#" + eventid + "date").text (datetime.getFullYear () + "." + (datetime.getMonth () + 1) + "." + datetime.getDate ());
		$ ("#" + eventid + "week").text ("星期" + Day[datetime.getDay ()]);
		$ ("#" + eventid + "time").text (datetime.getHours () + ":" + datetime.getMinutes ());
		for (var j = 3 ; j < 5 ; j++) {
			$ ("#" + eventid + dataclass[j]).text (calevent[i][dataclass[j]]);
		}
		$ ("#" + eventid + "content").css ("display", "none");
	}
	for (var i = calevent.length ; $ ("#event" + (i + 1) + "head").length > 0 ; i++) {//刪除多餘的空行
		$ ("#event" + (i + 1) + "head").remove ();
		$ ("#event" + (i + 1) + "body").remove ();
	}
}

function searchevent () {//搜尋符合的活動
	var option = $ ("#searchingoption").val ();
	var events = $ (".event");
	var matchedNum = 0;
	if (option == "title") {
		var string = $ ("#searchinginput").val ();
		var titles = $ (".title");
		for (var i = 0 ; i < titles.length ; i++) {
			if (titles[i].innerHTML.search (string) != -1) {
				$ ("#event" + (i + 1) + "head").css ("display", "table-row");
				$ ("#event" + (i + 1) + "content").css ("display", "none");
				matchedNum++;
			}
			else {//Not Match
				$ ("#event" + (i + 1) + "head").css ("display", "none");
				$ ("#event" + (i + 1) + "content").css ("display", "none");
			}
		}
	}
	else if (option == "date") {
		var month = $ ("#searchingdatemonth").val ();
		var day = $ ("#searchingdateday").val ();
		var eventsdate = $ (".date");
		var dateinfo = new Array ();
		for (var i = 0 ; i < eventsdate.length ; i++) {
			dateinfo = eventsdate[i].innerHTML.split (".");
			if ((month == "" || dateinfo[1] == month) && (day == "" || dateinfo[2] == day)) {
				$ ("#event" + (i + 1) + "head").css ("display", "table-row");
				$ ("#event" + (i + 1) + "content").css ("display", "none");
				matchedNum++;
			}
			else {//Not Match
				$ ("#event" + (i + 1) + "head").css ("display", "none");
				$ ("#event" + (i + 1) + "content").css ("display", "none");
			}
		}
	}
	else if (option == "content") {
		var contents = $ (".content");
		var string = $ ("#searchinginput").val ();
		for (var i = 0 ; i < contents.length ; i++) {
			if (contents[i].innerHTML.search (string) != -1) {
				$ ("#event" + (i + 1) + "head").css ("display", "table-row");
				$ ("#event" + (i + 1) + "content").css ("display", "none");
				matchedNum++;
			}
			else {//Not Match
				$ ("#event" + (i + 1) + "head").css ("display", "none");
				$ ("#event" + (i + 1) + "content").css ("display", "none");
			}
		}
	}
	if (matchedNum == 0) {
		$ ("#unmatchedmessage").css ("display", "block");
	}
	else {
		$ ("#unmatchedmessage").css ("display", "none");
	}
}

function changesearchingbar (obj) {
	if (obj.value == "date") {
		$ ("#searchingdate").css ("display", "inline");
		$ ("#searchingcontent").css ("display", "none");
	}
	else {
		$ ("#searchingdate").css ("display", "none");
		$ ("#searchingcontent").css ("display", "inline");
	}
}

function togglecontent (eventid) {
	var i;
	for (i = 5 ; i < eventid.length ; i++) {
		if (!(eventid[i] >= '0' && eventid[i] <= '9')) {
			break;
		}
	}
	eventid = eventid.substring (0, i);
	$ ("#" + eventid + "content").toggle (250);
}

function changeyear (delta) {
	var year = $ ("#year").text ();
	year = parseInt (year) + delta;
	$ ("#year").text (year.toString ());
}

function setyear () {
	var today = new Date ();
	var year = today.getFullYear ();
	$ ("#year").text (year);
}