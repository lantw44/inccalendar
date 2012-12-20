headdataclass = ["date", "week", "time", "title"];
Day = ["日", "一", "二", "三", "四", "五", "六"];
curpage = 1;

function escapestring (str) {//用出' ' && '\n'
	str = str.replace (/\n/g, "<br/>");
	str = str.replace (/ /g, "&nbsp;");
	return str;
}

function pushevent (start) {//將活動放入行事曆中
	var year = parseInt ($ ("#year").text ());
	var dataclass = ["date", "week", "time", "title", "content"];
	var dataid, eventid, dataid, datetime, calevent, maxevents;
	calevent = caleventlist;
	maxevents = Math.min (10, calevent.length - start);
	for (var i = start ; i < start + maxevents ; i++) {
		eventid = "event" + (i + 1);
		if ($ ("#" + eventid + "head").length == 0) {//這一行還沒有
			$ ("#eventbody").append ("<tr id = '" + eventid + "head'></tr>");
			$ ("#" + eventid + "head").addClass ("event");
			for (var j = 0 ; j < 4 ; j++) {
				dataid = eventid + dataclass[j];
				$ ("#" + eventid + "head").append ("<td id = '" + dataid + "'></td>");
				$ ("#" + dataid).addClass (dataclass[j]);
				$ ("#" + dataid).attr ({"onclick":"togglecontent (this.id);"});
			}
			$ ("#eventbody").append ("<tr id = '" + eventid + "body' class = 'event'><td id = '" + eventid + "content'></td></tr>");
			$ ("#" + eventid + "content").addClass ("content");
			$ ("#" + eventid + "content").attr ("colspan","4");
		}
		datetime = calevent[i]["datetime"];
		$ ("#" + eventid + "date").text (datetime.getFullYear () + "." + (datetime.getMonth () + 1) + "." + datetime.getDate ());
		$ ("#" + eventid + "week").text ("星期" + Day[datetime.getDay ()]);
		$ ("#" + eventid + "time").text (datetime.getHours () + ":" + datetime.getMinutes ());
		$ ("#" + eventid + "title").text (calevent[i]["title"]);
		$ ("#" + eventid + "content").html (escapestring (calevent[i]["content"]));
		$ ("#" + eventid + "content").css ("display", "none");
		$ ("#" + eventid + "title").append ("<input type = 'button' value = '編輯' class = 'editbutton' onclick = 'editevent (\"" + eventid + "\")'></input>");
		$ ("#" + eventid + "content").append ("<input type = 'button' value = '編輯' class = 'editbutton' onclick = 'editevent (\"" + eventid + "\")'></input>");
	}
	for (var i = maxevents ; $ ("#event" + (i + 1) + "head").length > 0 ; i++) {//刪除多餘的空行
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

function geteventid (dataid) {
	var i;
	for (i = 5 ; i < dataid.length ; i++) {
		if (!(dataid[i] >= '0' && dataid[i] <= '9')) {
			break;
		}
	}
	return dataid.substring (0, i);
}

function changeweek (inputid) {
	var eventid = geteventid (inputid.split ("input")[1]);
	var date = new Date ();
	date.setFullYear (parseInt ($ ("#input" + eventid + "year").val ()));
	date.setMonth (parseInt ($ ("#input" + eventid + "month").val ()) - 1);
	date.setDate (parseInt ($ ("#input" + eventid + "date").val ()));
	$ ("#" + eventid + "week").text ("星期" + Day[date.getDay ()]);
}

function switchbacktonormalmode (eventid) {
	var year, month, date, hour, minute, title, content;
	year = $ ("#input" + eventid + "year").val ();
	month = $ ("#input" + eventid + "month").val ();
	date = $ ("#input" + eventid + "date").val ();
	hour = $ ("#input" + eventid + "hour").val ();
	minute = $ ("#input" + eventid + "minute").val ();
	title = $ ("#input" + eventid + "title").val ();
	content = $ ("#input" + eventid + "content").val ();
	$ ("#" + eventid + "date").text (year + "." + month + "." + date);
	$ ("#" + eventid + "time").text (hour + ":" + minute);
	$ ("#" + eventid + "title").text (title);
	$ ("#" + eventid + "content").html (escapestring (content));
	$ ("#" + eventid + "title").append ("<input type = 'button' value = '編輯' class = 'editbutton' onclick = 'editevent (\"" + eventid + "\")'></input>");
	$ ("#" + eventid + "content").append ("<input type = 'button' value = '編輯' class = 'editbutton' onclick = 'editevent (\"" + eventid + "\")'></input>");
	for (var i = 0 ; i < headdataclass.length ; i++) {
		$ ("#" + eventid + headdataclass[i]).attr ("onclick", "togglecontent (this.id)");
	}
}

function checkinput (eventid) {
	
}

function updateevent (eventid) {
	var dataclass = ["title", "content", "icon", "remind", "datafrom"];
	var calevent = new CalEvent ();
	calevent.key = caleventlist[parseInt (eventid.split ("event")[1]) - 1].key;
	for (var i = 0 ; i < dataclass.length ; i++) {
		if ($ ("#input" + eventid + dataclass[i]).length > 0) {//存在這一個欄位
			calevent[dataclass[i]] = $ ("#input" + eventid + dataclass[i]).val ();
		}
	}
	calevent.datetime.setFullYear (parseInt ($ ("#input" + eventid + "year").val ()));
	calevent.datetime.setMonth (parseInt ($ ("#input" + eventid + "month").val ()) - 1);
	calevent.datetime.setDate (parseInt ($ ("#input" + eventid + "date").val ()));
	calevent.datetime.setHours (parseInt ($ ("#input" + eventid + "hour").val ()));
	calevent.datetime.setMinutes (parseInt ($ ("#input" + eventid + "month").val ()));
	inccal_send (calevent);
	switchbacktonormalmode (eventid);
}

function editevent (eventid) {
	var dataclass = ["title", "content", "remind"];
	var dateclass = ["year", "month", "date", "hour", "minute"];
	var timedata = new Array ();
	var data = new Array ();
	var thisevent = caleventlist[parseInt (eventid.split ("event")[1]) - 1];
	$ ("#" + eventid + "body").slideDown (250);
	//$ ("#" + eventid + "date").html ("<input type = 'date' id = 'input" + eventid + "date'></input>");	//firefox不支援
	$ ("#" + eventid + "date").html ("<input type = 'text' id = 'input" + eventid + "year' size = '2' maxlength = '4' onkeyup = 'changeweek (this.id);' /> 年");	//size = 2 因為size是算中文字
	$ ("#" + eventid + "date").append ("<input type = 'text' id = 'input" + eventid + "month' size = '1' maxlength = '2' onkeyup = 'changeweek (this.id);'/> 月");
	$ ("#" + eventid + "date").append ("<input type = 'text' id = 'input" + eventid + "date' size = '1' maxlength = '2' onkeyup = 'changeweek (this.id);'/> 日");
	$ ("#" + eventid + "time").html ("<input type = 'tetxt' id = 'input" + eventid + "hour' size = '1' maxlength = '2' /> 時 <br />");
	$ ("#" + eventid + "time").append ("<input type = 'tetxt' id = 'input" + eventid + "minute' size = '1' maxlength = '2' /> 分");
	$ ("#" + eventid + "title").html ("<input type = 'tetxt' id = 'input" + eventid + "title' size = '40' />");
	$ ("#" + eventid + "content").html ("<div> 活動內容： </div><textarea id = 'input" + eventid + "content" + "'></textarea><br />");
	$ ("#input" + eventid + "content").attr ({"rows":"5", "cols":"100"});
	$ ("#" + eventid + "content").append ("提醒：<input type = 'tetxt' id = 'input" + eventid + "remind' size = '1' maxlength = '4' /> 分鐘前&nbsp;&nbsp;&nbsp;&nbsp;");
	$ ("#" + eventid + "content").append ("資料來源： #include <行事曆.h>&nbsp;&nbsp;&nbsp;&nbsp;");
	$ ("#" + eventid + "content").append ("<input type = 'button' value = '確認' class = 'okbutton' onclick = 'updateevent (\"" + eventid + "\");' />");
	for (var i = 0 ; i < dataclass.length ; i++) {
		if (dataclass[i] == "content") {
			$ ("#input" + eventid + "content").text (thisevent[dataclass[i]]);//textarea
		}
		else {
			$ ("#input" + eventid + dataclass[i]).val (thisevent[dataclass[i]]);//input type=text
		}
	}
	timedata.push (thisevent.datetime.getFullYear ());
	timedata.push (thisevent.datetime.getMonth () + 1);
	timedata.push (thisevent.datetime.getDate ());
	timedata.push (thisevent.datetime.getHours ());
	timedata.push (thisevent.datetime.getMinutes ());
	for (var i = 0 ; i < timedata.length ; i++) {
		$ ("#input" + eventid + dateclass[i]).val (timedata[i]);
	}
	for (var i = 0 ; i < headdataclass.length ; i++) {
		$ ("#" + eventid + headdataclass[i]).removeAttr ("onclick");
	}
	if ($ ("#" + eventid + "content").css ("display") == "none") {
		$ ("#" + eventid + "content").slideDown (250);
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

function togglecontent (dataid) {
	$ ("#" + geteventid (dataid) + "content").toggle (250);
}

function setinitialcss () {
	$ (".event:even").css ("cursor", "pointer");
	$ ("#prevpagebutton").attr ("disabled", true);
	$ ("#nextpagebutton").attr ("disabled", (caleventlist.length <= 10));
	if (caleventlist.length == 0) {//沒有任何活動
		$ ("#noeventmessage").css ("display", "block");
	}
	else {
		$ ("#noeventmessage").css ("display", "none");
	}
}

function changeyear (delta) {
	var year = $ ("#year").text ();
	year = parseInt (year) + delta;
	$ ("#year").text (year.toString ());
	inccal_fetch (year);
	pushevent (0);
	setinitialcss ();
}

function setyear () {
	var today = new Date ();
	var year = today.getFullYear ();
	$ ("#year").text (year);
	inccal_fetch (year);
	pushevent (0);
	setinitialcss ();
}

function gopage (delta) {
	curpage += delta;
	pushevent ((curpage - 1) * 10);
	$ ("#prevpagebutton").attr ("disabled", (curpage == 1));
	$ ("#nextpagebutton").attr ("disabled", (curpage * 10 >= caleventlist.length));
}
	