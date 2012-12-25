var headdataclass = ["date", "week", "time", "title"];
var Day = ["日", "一", "二", "三", "四", "五", "六"];
var curpage;
var originevent = new Array (5);
var findcondition = new Array ();	//stack for find condition
var caleventstack = new Array ();	//stack for calevent
var calevent, curevent;			//calevent = current searched event		curevent.length <= 10
var absoluteid = new Array ();	//stack    caleventlist id     size = calevent.length    range [1, n]

function escapestring (str) {//用出' ' && '\n'
	str = str.replace (/\n/g, "<br/>");
	str = str.replace (/ /g, "&nbsp;");
	return str;
}

function lastelement (arr) {
	return arr[arr.length - 1];
}

function setneweventform () {
	var dataclass = ["title", "content", "remind", "year", "month", "date", "hour", "minute"];
	$ ("#" + "newevent" + "date").html ("<input type = 'text' id = 'input" + "newevent" + "year' size = '2' maxlength = '4' onkeyup = 'inputkeyup (this.id);' /> 年");	//size = 2 因為size是算中文字
	$ ("#" + "newevent" + "date").append ("<input type = 'text' id = 'input" + "newevent" + "month' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 月");
	$ ("#" + "newevent" + "date").append ("<input type = 'text' id = 'input" + "newevent" + "date' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 日");
	$ ("#" + "newevent" + "time").html ("<input type = 'text' id = 'input" + "newevent" + "hour' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 時 <br />");
	$ ("#" + "newevent" + "time").append ("<input type = 'text' id = 'input" + "newevent" + "minute' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 分");
	$ ("#" + "newevent" + "title").html ("<input type = 'text' id = 'input" + "newevent" + "title' size = '40' />");
	$ ("#" + "newevent" + "content").html ("<div> 活動內容： </div><textarea id = 'input" + "newevent" + "content" + "'></textarea><br />");
	$ ("#input" + "newevent" + "content").attr ({"rows":"5", "cols":"100"});
	$ ("#" + "newevent" + "content").append ("提醒：<input type = 'text' id = 'input" + "newevent" + "remind' size = '1' maxlength = '4' /> 分鐘前&nbsp;&nbsp;&nbsp;&nbsp;");
	$ ("#" + "newevent" + "content").append ("資料來源： " + "include <行事曆.h>" + "&nbsp;&nbsp;&nbsp;&nbsp;");
	$ ("#" + "newevent" + "content").append ("<input type = 'button' value = '確認' class = 'okbutton' onclick = 'updateevent (\"" + "newevent" + "\"); resumeeditbutton ();' />");
	$ ("#" + "newevent" + "content").append ("<input type = 'button' value = '取消' class = 'okbutton' onclick = 'cancelupdateevent (\"" + "newevent" + "\"); resumeeditbutton ();' />");
}

function pushneweventdata () {
	var dataclass = ["title", "content", "remind", "year", "month", "date", "hour", "minute"];
	var today = new Date ();	//today = today
	var data = ["新活動", "關於此活動的描述", 30, today.getFullYear (), today.getMonth () + 1, today.getDate (), 0, 0];
	for (var i = 0 ; i < dataclass.length ; i++) {
		$ ("#input" + "newevent" + dataclass[i]).val (data[i]);
	}
	$ ("#" + "newevent" + "week").text ("星期" + Day [today.getDay ()]);
}

function geteventidnumber (dataid) {
	var str = dataid.split ("event")[1];
	var i;
	for (i = 0 ; i < str.length ; i++) {
		if (!(str[i] >= '0' && str[i] <= '9')) {
			break;
		}
	}
	return parseInt (str.substring (0, i));
}

function sethovercss (dataid) {
	$ ("#" + dataid).hover (function () {
		$ ("#" + "event" + geteventidnumber (this.id) + "editbutton").css ("display", "inline-block");
		$ ("#" + "event" + geteventidnumber (this.id) + "deletebutton").css ("display", "inline-block");
		}, function () {
		$ ("#" + "event" + geteventidnumber (this.id) + "editbutton").css ("display", "none");
		$ ("#" + "event" + geteventidnumber (this.id) + "deletebutton").css ("display", "none");
	});
}

function setinitialform () {//event1 ~ event10
	var dataclass = ["date", "week", "time", "title", "content"];
	var id, dataid, eventid;
	for (id = 1 ; id <= 10 ; id++) {
		eventid = "event" + id;
		$ ("#eventbody").append ("<tr id = '" + eventid + "head'></tr>");
		$ ("#" + eventid + "head").addClass ("event");
		for (var j = 0 ; j < 4 ; j++) {
			dataid = eventid + dataclass[j];
			$ ("#" + eventid + "head").append ("<td id = '" + dataid + "'></td>");
			$ ("#" + dataid).addClass (dataclass[j]);
			$ ("#" + dataid).attr ({"onclick":"togglecontent (this.id);"});
			sethovercss (dataid);
		}
		$ ("#" + eventid + "head").append ("<td id = '" + eventid + "editdeleteblock' class = 'editdeleteblock'></td>");
		$ ("#" + eventid + "editdeleteblock").html ("<input id = '" + eventid + "editbutton' type = 'button' value = '編輯' class = 'editbutton' onclick = 'editevent (\"" + eventid + "\")' />");
		$ ("#" + eventid + "editdeleteblock").append ("<input id = '" + eventid + "deletebutton' type = 'button' value = '刪除' class = 'editbutton' onclick = 'deleteevent (\"" + eventid + "\")' />");
		$ ("#eventbody").append ("<tr id = '" + eventid + "body' class = 'event'><td id = '" + eventid + "content'><pre id = '" + eventid + "contentpre'></pre></td></tr>");
		$ ("#" + eventid + "content").addClass ("content");
		$ ("#" + eventid + "content").attr ("colspan","5");
		sethovercss (eventid + "content");
		sethovercss (eventid + "editdeleteblock");
	}
	setneweventform ();
}

function pushevent () {//將curevent活動放入行事曆中
	var dataclass = ["date", "week", "time", "title", "content"];
	var datetime, maxevents, i;
	maxevents = Math.min (10, curevent.length);
	for (i = 0 ; i < maxevents ; i++) {
		eventid = "event" + (i + 1);
		for (var j = 0 ; j < 4 ; j++) {
			$ ("#" + eventid + dataclass[j]).attr ({"onclick":"togglecontent (this.id);"});
		}
		datetime = curevent[i]["datetime"];
		$ ("#" + eventid + "date").text (datetime.getFullYear () + "." + (datetime.getMonth () + 1) + "." + datetime.getDate ());
		$ ("#" + eventid + "week").text ("星期" + Day[datetime.getDay ()]);
		$ ("#" + eventid + "time").text (timetostring (datetime.getHours (), datetime.getMinutes ()));
		$ ("#" + eventid + "title").text (curevent[i]["title"]);
		$ ("#" + eventid + "contentpre").text (curevent[i]["content"]);
		$ ("#" + eventid + "content").css ("display", "none");
		$ ("#event" + (i + 1) + "head").css ("display", "table-row");
		$ ("#event" + (i + 1) + "content").css ("display", "none");
	}
	for (; i < 11 ; i++) {//隱藏多餘的空行
		$ ("#event" + (i + 1) + "head").css ("display", "none");
		$ ("#event" + (i + 1) + "content").css ("display", "none");
	}
}

function clearformerinput () {
	$ ("#searchinginput").val ("");
	$ ("#searchingdatemonth").val ("");
	$ ("#searchingdateday").val ("");
}

function checksearchinput () {
	var option = $ ("#searchingoption").val ();
	if (option == "title" || option == "content") {
	var string = $ ("#searchinginput").val ();
		if (string == "") {
			status_bar_warning ("請輸入搜尋資料");
			$ ("#searchinginput").css ("background-color", "red");
			return false;
		}
		$ ("#searchinginput").css ("background-color", "white");
	}
	else if (option == "date") {
		var month = $ ("#searchingdatemonth").val ();
		var date = $ ("#searchingdateday").val ();
		if (month == "" && date == "") {
			status_bar_warning ("不可同時為空白");
			$ ("#searchingdatemonth").css ("background-color", "red");
			$ ("#searchingdateday").css ("background-color", "red");
			return false;
		}
		if (month != "") {
			if (isNaN (month)) {
				status_bar_warning ("請輸入數字");
				$ ("#searchingdatemonth").css ("background-color", "red");
				return false;
			}
			month = parseInt (month);
			if (month <= 0 || month > 12) {
				status_bar_warning ("請輸入正確的月份");
				$ ("#searchingdatemonth").css ("background-color", "red");
				return false;
			}
		}
		$ ("#searchingdatemonth").css ("background-color", "white");
		if (date != "") {
			if (isNaN (date)) {
				status_bar_warning ("請輸入數字");
				$ ("#searchingdateday").css ("background-color", "red");
				return false;
			}
			date = parseInt (date);
			if (!checkdate (parseInt ($ ("#year").text ()), month, date)) {
				status_bar_warning ("請輸入正確的日期");
				$ ("#searchingdateday").css ("background-color", "red");
				return false;
			}
		}
		$ ("#searchingdateday").css ("background-color", "white");
	}
	status_bar_set ("");
	return true;
}

function sameaslastsearch () {
	if (findcondition.length == 0) {
		return false;
	}
	var lastcondition = lastelement (findcondition);
	if (lastcondition[0] != $ ("#searchingoption").val ()) {
		return false;
	}
	if (lastcondition[0] == "title" || lastcondition[0] == "content") {
		return lastcondition[1] == $ ("#searchinginput").val ();
	}
	else if (lastcondition[0] == "date") {
		return lastcondition[1] == $ ("#searchingdatemonth").val () && lastcondition[2] == $ ("#searchingdateday").val ();
	}
}

function searchevent () {//搜尋符合的活動
	if (!checksearchinput ()) {//輸入錯誤
		return ;
	}
	if (sameaslastsearch ()) {//與上次搜尋一模一樣
		return ;
	}
	caleventstack.push (calevent);	//save current calevent
	var option = $ ("#searchingoption").val ();
	var events = $ (".event");
	var matchedNum = 0;
	var arr = new Array ();
	var currentabsid = lastelement (absoluteid);
	var newcalevent = new Array ();
	arr.push (option);
	if (option == "title") {
		var string = $ ("#searchinginput").val ();
		arr.push (string);
		findcondition.push (arr);
		arr = new Array ();	//clear
		for (var i = 0 ; i < calevent.length ; i++) {
			if (calevent[i].title.search (string) != -1) {//match
				arr.push (currentabsid[i]);
				newcalevent.push (calevent[i]);
				matchedNum++;
			}
		}
		absoluteid.push (arr);
	}
	else if (option == "date") {
		var month = $ ("#searchingdatemonth").val ();
		var date = $ ("#searchingdateday").val ();
		arr.push (month);
		arr.push (date);
		findcondition.push (arr);
		arr = new Array ();	//clear
		for (var i = 0 ; i < calevent.length ; i++) {
			if ((month == "" || calevent[i].datetime.getMonth () + 1 == parseInt (month)) && (date == "" || calevent[i].datetime.getDate () == parseInt (date))) {//match
				arr.push (currentabsid[i]);
				newcalevent.push (calevent[i]);
				matchedNum++;
			}
		}
		absoluteid.push (arr);
	}
	else if (option == "content") {
		var string = $ ("#searchinginput").val ();
		arr.push (string);
		findcondition.push (arr);
		arr = new Array ();	//clear
		for (var i = 0 ; i < calevent.length ; i++) {
			if (calevent[i].content.search (string) != -1) {//match
				arr.push (currentabsid[i]);
				newcalevent.push (calevent[i]);
				matchedNum++;
			}
		}
		absoluteid.push (arr);
	}
	calevent = newcalevent;
	curevent = calevent.slice (0, 10);
	pushevent ();
	curpage = 1;
	setnonchangingyearcss ();
	$ ("#prevsearchbutton").css ("display", "inline-block");
	$ ("#nosearchbutton").css ("display", "inline-block");
	if (matchedNum == 0) {
		$ ("#unmatchedmessage").css ("display", "block");
	}
	else {
		$ ("#unmatchedmessage").css ("display", "none");
	}
}

function backtoprevsearch (status) {
	clearformerinput ();
	if (status == "nosearch") {
		findcondition = findcondition.slice (0, 1);		//保留陣列型態
		caleventstack = caleventstack.slice (0, 1);
		absoluteid = absoluteid.slice (0, 2);
	}
	findcondition.pop ();
	if (findcondition.length == 0) {//back to no search
		$ ("#searchingoption").children ().each (function () {
			if ($ (this).val () == "title") {
				$ (this).attr ("selected", true);
			}
		});
		$ ("#prevsearchbutton").css ("display", "none");
		$ ("#nosearchbutton").css ("display", "none");
	}
	else {
		var lastcondition = lastelement (findcondition);
		$ ("#searchingoption").children ().each (function () {
			if ($ (this).val () == lastcondition[0]) {
				$ (this).attr ("selected", true);
			}
		});
		if (lastcondition[0] == "title" || lastcondition[0] == "content") {
			$ ("#searchinginput").val (lastcondition[1]);
		}
		else if (lastcondition[0] == "date") {
			$ ("#searchingdatemonth").val (lastcondition[1]);
			$ ("#searchingdateday").val (lastcondition[2]);
		}
	}
	changesearchingbar ();
	calevent = lastelement (caleventstack);
	caleventstack.pop ();
	curevent = calevent.slice (0, 10);
	curpage = 1;
	absoluteid.pop ();
	pushevent ();
	setnonchangingyearcss ();
	$ ("#searchinginput").css ("background-color", "white");
	$ ("#searchingdatemonth").css ("background-color", "white");
	$ ("#searchingdateday").css ("background-color", "white");
	status_bar_set ("");
	if (curevent.length == 0) {
		$ ("#unmatchedmessage").css ("display", "block");
	}
	else {
		$ ("#unmatchedmessage").css ("display", "none");
	}
}

function stringstartswith (str, str2) {
	if (str.length < str2.length) {
		return false;
	}
	return str.substring (0, str2.length) == str2;
}

function getcaleventid (dataid) {
	if (stringstartswith (dataid, "newevent")) {
		return "newevent";
	}
	var i;
	for (i = 5 ; i < dataid.length ; i++) {
		if (!(dataid[i] >= '0' && dataid[i] <= '9')) {
			break;
		}
	}
	return dataid.substring (0, i);
}

function changeweek (eventid) {
	var date = new Date ();
	date.setFullYear (parseInt ($ ("#input" + eventid + "year").val ()));
	date.setMonth (parseInt ($ ("#input" + eventid + "month").val ()) - 1);
	date.setDate (parseInt ($ ("#input" + eventid + "date").val ()));
	$ ("#" + eventid + "week").text ("星期" + Day[date.getDay ()]);
}

function switchbacktonormalmode (eventid) {
	if (eventid == "newevent") {
		var checkclass = ["content", "remind", "year", "month", "date", "hour", "minute"];
		$ ("#" + "newevent" + "head").css ("display", "none");
		$ ("#" + "newevent" + "content").css ("display", "none");
		for (var i = 0 ; i < checkclass.length ; i++) {
			$ ("#input" + "newevent" + checkclass[i]).css ("background-color", "white");
		}
	}
	else {
		var year, month, date, hour, minute, title, content;
		year = $ ("#input" + eventid + "year").val ();
		month = $ ("#input" + eventid + "month").val ();
		date = $ ("#input" + eventid + "date").val ();
		hour = $ ("#input" + eventid + "hour").val ();
		minute = $ ("#input" + eventid + "minute").val ();
		title = $ ("#input" + eventid + "title").val ();
		content = $ ("#input" + eventid + "content").val ();
		$ ("#" + eventid + "date").text (year + "." + month + "." + date);
		$ ("#" + eventid + "time").text (timetostring (hour, minute));
		$ ("#" + eventid + "title").text (title);
		$ ("#" + eventid + "content").html ("<pre id = '" + eventid + "contentpre'></pre>");
		$ ("#" + eventid + "contentpre").text (content);
		for (var i = 0 ; i < headdataclass.length ; i++) {
			$ ("#" + eventid + headdataclass[i]).attr ("onclick", "togglecontent (this.id)");
		}
	}
	status_bar_set ("");
}

function checkdate (year, month, date) {
	var dates = [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
		dates[2] = 29;
	}
	if (month == "") {
		return date > 0 && date < 32;
	}
	else {
		return date <= dates[month] && date > 0;
	}
}

function checkinput (eventid, checkdatetimeonly) {
	var title, year, month, date, hour, minute, remind;
	if (!checkdatetimeonly) {
		title = $ ("#input" + eventid + "title").val ();
		if (title == "") {
			status_bar_warning ("標題不可空白");
			$ ("#input" + eventid + "title").css ("background-color", "red");
			return false;
		}
		$ ("#input" + eventid + "title").css ("background-color", "white");
	}
	year = $ ("#input" + eventid + "year").val ();
	if (year == "" || isNaN (year)) {
		status_bar_warning ("請輸入數字");
		$ ("#input" + eventid + "year").css ("background-color", "red");
		return false;
	}
	year = parseInt (year);
	if (year < 1970) {
		status_bar_warning ("請輸入大於1970的年份");
		$ ("#input" + eventid + "year").css ("background-color", "red");
		return false;
	}
	$ ("#input" + eventid + "year").css ("background-color", "white");
	month = $ ("#input" + eventid + "month").val ();
	if (month == "" || isNaN (month)) {
		status_bar_warning ("請輸入數字");
		$ ("#input" + eventid + "month").css ("background-color", "red");
		return false;
	}
	month = parseInt (month);
	if (month < 0 || month > 12) {
		status_bar_warning ("請輸入正確的月份");
		$ ("#input" + eventid + "month").css ("background-color", "red");
		return false;
	}
	$ ("#input" + eventid + "month").css ("background-color", "white");
	date = $ ("#input" + eventid + "date").val ();
	if (date == "" || isNaN (date)) {
		status_bar_warning ("請輸入數字");
		$ ("#input" + eventid + "date").css ("background-color", "red");
		return false;
	}
	date = parseInt (date);
	if (!checkdate (year, month, date)) {
		status_bar_warning ("請輸入正確的日期");
		$ ("#input" + eventid + "date").css ("background-color", "red");
		return false;
	}
	$ ("#input" + eventid + "date").css ("background-color", "white");
	hour = $ ("#input" + eventid + "hour").val ();
	if (hour == "" || isNaN (hour)) {
		status_bar_warning ("請輸入數字");
		$ ("#input" + eventid + "hour").css ("background-color", "red");
		return false;
	}
	hour = parseInt (hour);
	if (hour < 0 || hour > 24) {
		status_bar_warning ("請輸入正確的時間");
		$ ("#input" + eventid + "hour").css ("background-color", "red");
		return false;
	}
	$ ("#input" + eventid + "hour").css ("background-color", "white");
	minute = $ ("#input" + eventid + "minute").val ();
	if (minute == "" || isNaN (minute)) {
		status_bar_warning ("請輸入數字");
		$ ("#input" + eventid + "minute").css ("background-color", "red");
		return false;
	}
	minute = parseInt (minute);
	if (minute < 0 || minute > 59) {
		status_bar_warning ("請輸入正確的時間");
		$ ("#input" + eventid + "minute").css ("background-color", "red");
		return false;
	}
	$ ("#input" + eventid + "minute").css ("background-color", "white");
	if (!checkdatetimeonly) {
		remind = $ ("#input" + eventid + "remind").val ();
		if (remind != "") {
			if (isNaN (remind)) {
				status_bar_warning ("請輸入數字");
				$ ("#input" + eventid + "remind").css ("background-color", "red");
				return false;
			}
		}
		$ ("#input" + eventid + "remind").css ("background-color", "white");
	}
	status_bar_set ("");
	return true;
}

function datecompare (date1, date2) {	//return date1 <= date2
	if (date1.getFullYear () != date2.getFullYear ()) {
		return date1.getFullYear () < date2.getFullYear ();
	}
	else if (date1.getMonth () != date2.getMonth ()) {
		return date1.getMonth () < date2.getMonth ();
	}
	else if (date1.getDate () != date2.getDate ()) {
		return date1.getDate () < date2.getDate ();
	}
	else if (date1.getHours () != date2.getHours ()) {
		return date1.getHours () < date2.getHours ();
	}
	else if (date1.getMinutes () != date2.getMinutes ()) {
		return date1.getMinutes () < date2.getMinutes ();
	}
	else {//date1 = date2
		return true;
	}
}

function matchfindcondition (thisevent, condition) {
	if (condition[0] == "title") {
		return thisevent.title.search (condition[1]) != -1;
	}
	else if (condition[0] == "date") {
		return (condition[1] == "" || thisevent.datetime.getMonth () + 1 == parseInt (condition[1])) && (condition[2] == "" || thisevent.datetime.getDate () == parseInt (condition[2]));
	}
	else if (condition[0] == "content") {	//true
		return thisevent.content.search (condition[1]) != -1;
	}
}

function updateeventinsearching (newevent, absid) {//將新活動放入已搜尋活動
	var update;
	for (var i = 0 ; i < absoluteid.length ; i++) {		//更新活動id
		for (var j = 0 ; j < absoluteid[i].length ; j++) {
			if (absoluteid[i][j] >= absid) {
				absoluteid[i][j]++;
			}
		}
	}
	if (caleventstack.length != 0) {//有搜尋過任何活動
		var stackevent = caleventstack[0];	//沒有任何搜尋的活動陣列
		var matchallcondition;
		update = false;
		for (var i = 0 ; i < stackevent.length ; i++) {
			if (datecompare (newevent.datetime, stackevent[i].datetime)) {
				caleventstack[0].splice (i, 0, newevent);
				absoluteid[0].splice (i, 0, absid);
				update = true;
				break;
			}
		}
		if (!update) {
			caleventstack[0].push (newevent);
			absoluteid[0].push (absid);
		}
		matchallcondition = true;
		for (var i = 1 ; i < caleventstack.length ; i++) {
			if (matchfindcondition (newevent, findcondition[i - 1])) {
				stackevent = caleventstack[i];//array of CalEvent
				update = false;
				for (var j = 0 ; j < stackevent.length ; j++) {
					if (datecompare (newevent.datetime, stackevent[j].datetime)) {
						caleventstack[i].splice (j, 0, newevent);
						absoluteid[i].splice (j, 0, absid);
						update = true;
						break;
					}
				}
				if (!update) {
					caleventstack[i].push (newevent);
					absoluteid[i].push (absid);
				}
			}
			else {
				matchallcondition = false;
				break;
			}
		}
		if (matchallcondition && matchfindcondition (newevent, lastelement (findcondition))) {
			var curabsid = lastelement (absoluteid);
			update = false;
			for (var i = 0 ; i < calevent.length ; i++) {//將新活動放入目前的活動陣列
				if (datecompare (newevent.datetime, calevent[i].datetime)) {
					calevent.splice (i, 0, newevent);
					curabsid.splice (i, 0, absid);
					update = true;
					break;
				}
			}
			if (!update) {
				calevent.push (newevent);
				curabsid.push (absid);
			}
		}
	}
	else {	//沒有搜尋過任何活動
		update = false;
		for (var i = 0 ; i < calevent.length ; i++) {//將新活動放入目前的活動陣列
			if (datecompare (newevent.datetime, calevent[i].datetime)) {
				calevent.splice (i, 0, newevent);
				absoluteid[0].splice (i, 0, absid);
				update = true;
				break;
			}
		}
		if (!update) {
			calevent.push (newevent);
			absoluteid[0].push (absid);
		}
	}
}

function updateevent (eventid) {
	if (!checkinput (eventid)) {
		return;
	}
	var dataclass = ["title", "content", "icon", "remind", "datafrom"];
	var newevent = new CalEvent ();
	var update;
	for (var i = 0 ; i < dataclass.length ; i++) {
		if ($ ("#input" + eventid + dataclass[i]).length > 0) {//存在這一個欄位
			newevent[dataclass[i]] = $ ("#input" + eventid + dataclass[i]).val ();
		}
	}
	newevent.datetime.setFullYear (parseInt ($ ("#input" + eventid + "year").val ()));
	newevent.datetime.setMonth (parseInt ($ ("#input" + eventid + "month").val ()) - 1);
	newevent.datetime.setDate (parseInt ($ ("#input" + eventid + "date").val ()));
	newevent.datetime.setHours (parseInt ($ ("#input" + eventid + "hour").val ()));
	newevent.datetime.setMinutes (parseInt ($ ("#input" + eventid + "minute").val ()));
	if (eventid == "newevent") {		//新增活動
		inccal_send (newevent, function (key) {
			newevent.key = key;
		});
		if (newevent.datetime.getFullYear () == parseInt ($ ("#year").text ())) {//新活動是目前這年的活動
			var newabsid;
			update = false;
			for (var i = 0 ; i < caleventlist.length ; i++) {	//更新caleventlist
				if (datecompare (newevent.datetime, caleventlist[i].datetime)) {
					caleventlist.splice (i, 0, newevent);
					newabsid = i + 1;
					update = true;
					break;
				}
			}
			if (!update) {
				caleventlist.push (newevent);
				newabsid = caleventlist.length;
			}
			updateeventinsearching (newevent, newabsid);
			curevent = calevent.slice ((curpage - 1) * 10, curpage * 10);	//refresh page
			pushevent ();
			if (curevent.length != 0) {	//curevent.length有可能變多  不可能變少
				$ ("#unmatchedmessage").css ("display", "none");
				$ ("#noeventmessage").css ("display", "none");
			}
			setnonchangingyearcss ();
		}
	}
	else {							//編輯活動
		var calevid = (curpage - 1) * 10 + parseInt (eventid.split ("event")[1]);
		var absid = lastelement (absoluteid)[calevid - 1];
		newevent.key = caleventlist[absid - 1].key;
		caleventlist[absid - 1] = newevent;
		calevent[calevid - 1] = newevent;
		curevent[parseInt (eventid.split ("event")[1]) - 1] = newevent;
		for (var i = 0 ; i < caleventstack.length ; i++) {
			for (var j = 0 ; j < caleventstack[i].length ; j++) {
				if (absoluteid[i][j] == absid) {
					caleventstack[i][j] = newevent;
				}
			}
		}
		inccal_send (newevent);
	}
	switchbacktonormalmode (eventid);
}

function cancelupdateevent (eventid) {
	if (eventid == "newevent") {	//新活動
		switchbacktonormalmode (eventid);
	}
	else {
		for (var i = 0 ; i < headdataclass.length ; i++) {
			$ ("#" + eventid + headdataclass[i]).text (originevent[i]);
		}
		$ ("#" + eventid + "content").html ("<pre id = '" + eventid + "contentpre'></pre>");
		$ ("#" + eventid + "contentpre").text (originevent[4]);
		for (var i = 0 ; i < headdataclass.length ; i++) {
			$ ("#" + eventid + headdataclass[i]).attr ("onclick", "togglecontent (this.id)");
		}
	}
	status_bar_set ("");
}

function resumeeditbutton () {		//恢復其他活動的編輯  恢復新增活動
	$ (".editbutton").attr ("disabled", false);
}

function disableeditbutton () {		//停用其他活動的編輯  停用新增活動
	$ (".editbutton").attr ("disabled", true);
}

function inputkeyup (dataid) {		//dataid starts with 'input'
	var eventid = getcaleventid (dataid.split ("input")[1]);
	var datatype = dataid.split ("input" + eventid)[1];		//year, month, date, hour, minute
	var inputcorrect;
	if (datatype == "year" || datatype == "month" || datatype == "date") {
		if (checkinput (eventid, true)) {
			changeweek (eventid);
			// changefocus (dataid);
		}
	}
	else {
		if (checkinput (eventid)) {
			// changefocus (dataid);
		}
	}
}

function editevent (eventid) {
	var dataclass = ["title", "content", "remind"];
	var dateclass = ["year", "month", "date", "hour", "minute"];
	var datafrom;
	var timedata = new Array ();
	var data = new Array ();
	var thisevent = curevent[parseInt (eventid.split ("event")[1]) - 1];
	for (var i = 0 ; i < headdataclass.length ; i++) {
		originevent[i] = $ ("#" + eventid + headdataclass[i]).text ();
	}
	originevent[4] = $ ("#" + eventid + "contentpre").text ();
	disableeditbutton ();
	$ ("#" + eventid + "body").slideDown (250);
	//$ ("#" + eventid + "date").html ("<input type = 'date' id = 'input" + eventid + "date'></input>");	//firefox不支援
	$ ("#" + eventid + "date").html ("<input type = 'text' id = 'input" + eventid + "year' size = '2' maxlength = '4' onkeyup = 'inputkeyup (this.id);' /> 年");	//size = 2 因為size是算中文字
	$ ("#" + eventid + "date").append ("<input type = 'text' id = 'input" + eventid + "month' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 月");
	$ ("#" + eventid + "date").append ("<input type = 'text' id = 'input" + eventid + "date' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 日");
	$ ("#" + eventid + "time").html ("<input type = 'text' id = 'input" + eventid + "hour' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 時 <br />");
	$ ("#" + eventid + "time").append ("<input type = 'text' id = 'input" + eventid + "minute' size = '1' maxlength = '2' onkeyup = 'inputkeyup (this.id);' /> 分");
	$ ("#" + eventid + "title").html ("<input type = 'text' id = 'input" + eventid + "title' size = '40' />");
	$ ("#" + eventid + "content").html ("<div> 活動內容： </div><textarea id = 'input" + eventid + "content" + "'></textarea><br />");
	$ ("#input" + eventid + "content").attr ({"rows":"5", "cols":"100"});
	$ ("#" + eventid + "content").append ("提醒：<input type = 'text' id = 'input" + eventid + "remind' size = '1' maxlength = '4' /> 分鐘前&nbsp;&nbsp;&nbsp;&nbsp;");
	if (thisevent["datafrom"] == "native") {
		datafrom = "include <行事曆.h>";
	}
	else if (thisevent["datafrom"] == "google") {
		datafrom = "Google 行事曆"
	}
	else if (thisevent["datafrom"] == "ntuceiba") {
		datafrom = "臺大 CEIBA 網站"
	}
	else {
		datafrom = thisevent["datafrom"];
	}
	$ ("#" + eventid + "content").append ("資料來源： " + datafrom + "&nbsp;&nbsp;&nbsp;&nbsp;");
	$ ("#" + eventid + "content").append ("<input type = 'button' value = '確認' class = 'okbutton' onclick = 'updateevent (\"" + eventid + "\"); resumeeditbutton ();' />");
	$ ("#" + eventid + "content").append ("<input type = 'button' value = '取消' class = 'okbutton' onclick = 'cancelupdateevent (\"" + eventid + "\"); resumeeditbutton ();' />");
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

function changesearchingbar () {
	if ($ ("#searchingoption").val () == "date") {
		$ ("#searchingdate").css ("display", "inline");
		$ ("#searchinginput").css ("display", "none");
	}
	else {
		$ ("#searchingdate").css ("display", "none");
		$ ("#searchinginput").css ("display", "inline");
	}
}

function togglecontent (dataid) {
	$ ("#" + getcaleventid (dataid) + "content").toggle (250);
}

function setinitialcss () {
	$ (".event:even").css ("cursor", "pointer");
	$ (".event:even").css ("background-color", "#CCFFFF");
	$ (".event:odd").css ("background-color", "#33FFFF");
	$ ("#prevpagebutton").attr ("disabled", true);
	$ ("#nextpagebutton").attr ("disabled", (calevent.length <= 10));
	if (curevent.length == 0) {//沒有任何活動
		$ ("#noeventmessage").css ("display", "block");
	}
	else {
		$ ("#noeventmessage").css ("display", "none");
	}
	$ ("#" + "newevent" + "head").css ("display", "none");
	$ ("#" + "newevent" + "content").css ("display", "none");
}

function changeyear (delta) {
	var year = $ ("#year").text ();
	var arr = new Array ();
	year = parseInt (year) + delta;
	$ ("#year").text (year.toString ());
	inccal_fetch (year);
	calevent = new Array ();
	for (var i = 0 ; i < caleventlist.length ; i++) {
		calevent.push (caleventlist[i]);
	}
	curevent = calevent.slice (0, 10);
	caleventstack.length = 0;
	findcondition.length = 0;
	absoluteid.length = 0;
	for (var i = 1 ; i <= calevent.length ; i++) {
		arr.push (i);
	}
	absoluteid.push (arr);
	pushevent ();
	setinitialcss ();
}

function setyear () {		//initialize year
	var today = new Date ();
	var year = today.getFullYear ();
	var arr = new Array ();
	$ ("#year").text (year);
	inccal_fetch (year);
	calevent = new Array ();
	for (var i = 0 ; i < caleventlist.length ; i++) {
		calevent.push (caleventlist[i]);
	}
	curevent = calevent.slice (0, 10);
	curpage = 1;
	caleventstack.length = 0;
	findcondition.length = 0;
	absoluteid.length = 0;
	for (var i = 1 ; i <= calevent.length ; i++) {
		arr.push (i);
	}
	absoluteid.push (arr);
	pushevent ();
}

function setnonchangingyearcss () {//set cursor, even,odd color, next,prev page button, neweventblock
	$ (".event:even").css ("cursor", "pointer");
	$ (".event:even").css ("background-color", "#CCFFFF");
	$ (".event:odd").css ("background-color", "#33FFFF");
	$ ("#prevpagebutton").attr ("disabled", (curpage == 1));
	$ ("#nextpagebutton").attr ("disabled", (curpage * 10 >= calevent.length));
	$ ("#" + "newevent" + "head").css ("display", "none");
	$ ("#" + "newevent" + "content").css ("display", "none");
	resumeeditbutton ();
}

function gopage (delta) {
	curpage += delta;
	curevent = calevent.slice ((curpage - 1) * 10, curpage * 10);
	pushevent ();
	setnonchangingyearcss ();
	status_bar_set ("");
}

function timetostring (hour, minute) {//12:0 => 12:00
	if (typeof minute == "string") {
		minute = parseInt (minute);
	}
	if (minute < 10) {
		minute = "0" + minute;
	}
	return hour + ":" + minute;
}

function displayneweventinput () {
	$ ("#neweventhead").css ("display", "table-row");
	$ ("#neweventcontent").slideDown (250);
	pushneweventdata ();
	disableeditbutton ();
}

function deleteevent (eventid) {
	var del = confirm ("確定要刪除此活動嗎?");
	if (del) {
		var id = parseInt (eventid.split ("event")[1]);
		id += (curpage - 1) * 10;	//calevent id
		id = lastelement (absoluteid)[id - 1];	//absid
		inccal_remove (caleventlist[id - 1]);
		caleventlist.splice (id - 1, 1);
		for (var i = 0 ; i < caleventstack.length ; i++) {
			for (var j = 0 ; j < caleventstack[i].length ; j++) {
				if (absoluteid[i][j] == id) {
					absoluteid[i].splice (j, 1);
					caleventstack[i].splice (j, 1);
					break;
				}
			}
		}
		for (var i = 0 ; i < calevent.length ; i++) {
			if (lastelement (absoluteid)[i] == id) {
				lastelement (absoluteid).splice (i, 1);
				calevent.splice (i, 1);
				break;
			}
		}
		for (var i = 0 ; i < absoluteid.length ; i++) {
			for (var j = 0 ; j < absoluteid[i].length ; j++) {
				if (absoluteid[i][j] > id) {
					absoluteid[i][j]--;
				}
			}
		}
		curevent = calevent.slice ((curpage - 1) * 10, curpage * 10);
		if (curevent.length == 0) {
			if (curpage != 1) {
				curpage--;
				curevent = calevent.slice ((curpage - 1) * 10, curpage * 10);
			}
			else {
				if (findcondition.length != 0) {//有搜尋過任何活動
					$ ("#unmatchedmessage").css ("display", "block");
				}
				else {
					$ ("#noeventmessage").css ("display", "block");
				}
			}
		}
		pushevent ();
		setnonchangingyearcss ();
	}
}

function changefocus (dataid) {		//dataid starts with 'input'
	var eventid = getcaleventid (dataid.split ("input")[1]);
	var datatype = dataid.split ("input" + eventid)[1];		//year, month, date, hour, minute
	var currentinput = ["year", "month", "date", "hour", "minute"];
	var correctlength = [4, 2, 2, 2, 2];
	var nextinput = ["month", "date", "hour", "minute", "title"];
	for (var i = 0 ; i < currentinput.length ; i++) {
		if (datatype == currentinput[i]) {
			if ($ ("#" + dataid).val ().length == correctlength[i]) {
				$ ("#input" + eventid + nextinput[i]).select ();
			}
			break;
		}
	}
}

function checkifsearchevent (e) {
	if (window.event) {
		key = e.keyCode;
	}
	else if (e.which) {
		key = e.which;
	}
	if (key == 13) {
		searchevent ();
	}
}