function pushevent () {//將活動放入行事曆中
	var eventbody = document.getElementById ("eventbody");
	var dataclass = ["date", "week", "time", "content"];
	var Event, data;
	for (var i = 0 ; i < 10 ; i++) {
		Event = document.createElement ("tr");
		Event.id = "event" + (i + 1);//建立每一個活動的id
		Event.className = "event";
		for (var j = 0 ; j < 4 ; j++) {
			data = document.createElement ("td");
			data.id = Event.id + dataclass[j];//建立每一個欄位的id	format = event<i><className>
			data.className = dataclass[j];
			Event.appendChild (data);
		}
		eventbody.appendChild (Event);
	}
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