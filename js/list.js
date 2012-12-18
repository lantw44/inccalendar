function pushevent () {//將活動放入行事曆中
	var calevent;
	var dataclass = ["date", "week", "time", "title"];
	var eventid, dataid;
	// for (var month = 1 ; month <= 12 ; month++) {
		// calevent = inccal_fetch (2012, month);
		for (var i = 0 ; i < 10 ; i++) {
			eventid = "event" + (i + 1);
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
			$ ("#" + eventid + "content").css ("display", "none");
		}
	// }
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