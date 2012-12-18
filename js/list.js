function pushevent () {//將活動放入行事曆中
	var calevent;
	var dataclass = ["date", "week", "time", "title"];
	var eventid, dataid;
	// for (var month = 1 ; month <= 12 ; month++) {
		// calevent = inccal_fetch (year, month);
		for (var i = 0 ; i < 10 ; i++) {
			eventid = "event" + (i + 1);
			$ ("#eventbody").append ("<tr id = \"" + eventid + "\"></tr>");
			$ ("#" + eventid).addClass ("event");
			for (var j = 0 ; j < 4 ; j++) {
				dataid = eventid + dataclass[j];
				$ ("#" + eventid).append ("<td id = \"" + dataid + "\"></td>");
				$ ("#" + dataid).addClass (dataclass[j]);
				$ ("#" + dataid).attr ({"onclick":"togglecontent (this.id);"});
			}
			$ ("#eventbody").append ("<tr class = \"event\"><td id = \"" + eventid + "content\"></td></tr>");
			$ ("#" + eventid + "content").addClass ("content");
			$ ("#" + eventid + "content").attr ({"colspan":"4"});
			$ ("#" + eventid + "content").css ("display", "none");
		}
	// }
}

function searchevent () {//搜尋符合的活動
	var obj = document.getElementById ("searchingoption");//obj = <select>
	var option = obj[obj.selectedIndex].value;//option = date or content
	var events = document.getElementById ("eventbody").getElementsByClassName ("event");
	var matchedNum = 0;
	if (option == "content") {
		var string = document.getElementById ("searchingcontent").value;
		var eventscontent = document.getElementById ("eventbody").getElementsByClassName ("content");
		for (var i = 0 ; i < eventscontent.length ; i++) {
			if (eventscontent[i].innerHTML.search (string) != -1) {
				events[i].style.display = "table-row";
				matchedNum++;
			}
			else {//Not Match
				events[i].style.display = "none";
			}
		}
	}
	else if (option == "date") {
		var month = document.getElementById ("searchingdatemonth").value;
		var day = document.getElementById ("searchingdateday").value;
		var eventsdate = document.getElementById ("eventbody").getElementsByClassName ("date");
		var dateinfo = new Array ();
		for (var i = 0 ; i < eventsdate.length ; i++) {
			dateinfo = eventsdate[i].innerHTML.split (".");
			if ((month == "" || dateinfo[1] == month) && (day == "" || dateinfo[2] == day)) {
				events[i].style.display = "table-row";
				matchedNum++;
			}
			else {//Not Match
				events[i].style.display = "none";
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
	var contentid, i;
	for (i = 5 ; i < eventid.length ; i++) {
		if (!(eventid[i] >= '0' && eventid[i] <= '9')) {
			break;
		}
	}
	contentid = eventid.substring (0, i) + "content";
	$ ("#" + contentid).toggle (250);
}