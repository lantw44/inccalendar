/* 這是和月曆相關的函式
 * 相依於：cookie.js */

var cookie_year = "inccal_year";    /* 存放目前選取年份的 cookie 名稱 */
var cookie_month = "inccal_month";  /* 存放目前選取月份的 cookie 名稱 */
var cookie_date = "inccal_date";    /* 存放目前選取日期的 cookie 名稱 */
var value_year;    /* 目前選取的年份（整數） */
var value_month;   /* 目前選取的月份（整數），注意與 javascript 中的相差 1 */
var value_date;    /* 目前選取的日期（整數） */
var objyear;       /* 顯示年份的物件 */
var objmonth;      /* 顯示月份的物件 */
var row_count = 0; /* 月曆列數 */

var timeedit_year_backgroundcolor;
var timeedit_month_backgroundcolor;

var calfocus_bdc_org = "black";

var alldata;	/* 存放整個月資料的陣列 */

function setyearmonth(){
	var useryear = parseInt(getcookievalue(cookie_year));
	var usermonth = parseInt(getcookievalue(cookie_month));
	var userdate = parseInt(getcookievalue(cookie_date));
	/* 初始化 objyear 和 objmonth，其他函式中不用在做同樣的動作 */
	objyear = document.getElementById("timeselect_year");
	objmonth = document.getElementById("timeselect_month");
	if(useryear >= 1970 && usermonth >= 1 && usermonth <= 12 &&
		userdate >= 1 && userdate <= 31){
		value_year = useryear;
		value_month = usermonth;
		value_date = userdate;
	}else{
		var today = new Date();
		value_year = today.getFullYear();
		value_month = today.getMonth() + 1;	
		value_date = today.getDate();
	} 
}

function timeselect_prev(){
	if(value_month <= 1){
		if(value_year > 1970){
			value_year--;
			value_month = 12;
		}
	}else{
		value_month--;
	}
	var maxdate = get_month_max_day(value_year, value_month - 1);
	value_date = value_date > maxdate ? maxdate : value_date;
	setmonthcal();
}

function timeselect_fwd(){
	if(value_month >= 12){
		value_year++;
		value_month = 1;
	}else{
		value_month++;
	}
	var maxdate = get_month_max_day(value_year, value_month - 1);
	value_date = value_date > maxdate ? maxdate : value_date;
	setmonthcal();
}

function timeselect_prev_kbd(evt){
	timeselect_prev();
	evt.preventDefault();
}

function timeselect_fwd_kbd(evt){
	timeselect_fwd();
	evt.preventDefault();
}

function timeedit_year_kbd(evt){
	evt.preventDefault();
	timeselect_direct();
	$("#timeedit_year").focus();
}

function timeedit_month_kbd(evt){
	evt.preventDefault();
	timeselect_direct();
	$("#timeedit_month").focus();
}

function timeselect_direct(){
	document.getElementById("timeedit_year").style.display = "inline";
	document.getElementById("timeedit_month").style.display = "inline";
	document.getElementById("timeedit_apply").style.display = "inline";
	document.getElementById("timeedit_cancel").style.display = "inline";
	document.getElementById("timeedit_button").style.display = "none";
	document.getElementById("timeselect_year").style.display = "none";
	document.getElementById("timeselect_month").style.display = "none";
	document.getElementById("timeselect_prev").style.display = "none";
	document.getElementById("timeselect_fwd").style.display = "none";
	
	document.getElementById("timeedit_year").value = value_year;
	document.getElementById("timeedit_month").value = value_month;
	
	$(document).unbind("keydown.main");
	$(document).bind("keydown.timeedit", "esc", timeedit_cancel_kbd);
	$(document).bind("keydown.timeedit", "return", timeedit_apply_kbd);
	
	timeedit_year_backgroundcolor = 
		document.getElementById("timeedit_year").style.backgroundColor;
	timeedit_month_backgroundcolor = 
		document.getElementById("timeedit_month").style.backgroundColor;
	
	status_bar_save();
	status_bar_set("(Esc)取消 (Enter)確定");
}

function timeedit_apply(){
	var edityearobj = document.getElementById("timeedit_year");
	var editmonthobj = document.getElementById("timeedit_month");
	var newyear = parseInt(edityearobj.value);
	var newmonth = parseInt(editmonthobj.value);
	try{
		if(!isFinite(newyear)){
			status_bar_warning("請輸入正確的年份！");
			edityearobj.style.backgroundColor = "red";
			throw false;
		}else if(!isFinite(newmonth)){
			status_bar_warning("請輸入正確的月份！");
			editmonthobj.style.backgroundColor = "red";
			throw false;
		}else if(newyear < 1970){
			status_bar_warning("請輸入 1970 年以後的年份！");
			edityearobj.style.backgroundColor = "red";
			throw false;
		}else if(newmonth < 1 || newmonth > 12){
			status_bar_warning("請輸入正確的月份！");
			editmonthobj.style.backgroundColor = "red";
			throw false;
		}
	}catch(err){
		return err;
	}
	value_year = newyear;
	value_month = newmonth;
	setmonthcal();
	timeedit_cancel();
}

function timeedit_apply_kbd(evt){
	evt.preventDefault();
	timeedit_apply();
}

function timeedit_cancel(){
	document.getElementById("timeedit_year").style.display = "none";
	document.getElementById("timeedit_month").style.display = "none";
	document.getElementById("timeedit_apply").style.display = "none";
	document.getElementById("timeedit_cancel").style.display = "none";
	document.getElementById("timeedit_button").style.display = "inline";
	document.getElementById("timeselect_year").style.display = "inline";
	document.getElementById("timeselect_month").style.display = "inline";
	document.getElementById("timeselect_prev").style.display = "inline";
	document.getElementById("timeselect_fwd").style.display = "inline";
	
	$(document).unbind("keydown.timeedit");
	shortcut_bind();
	
	document.getElementById("timeedit_year").style.backgroundColor = 
		timeedit_year_backgroundcolor;
	document.getElementById("timeedit_month").style.backgroundColor = 
		timeedit_month_backgroundcolor;

	status_bar_restore();
}

function timeedit_cancel_kbd(){
	timeedit_cancel();
	return false;
}

function get_month_max_day(year, month){
	var nextmonth = new Date();
	if(month >= 12){
		year++;
		month = 1;
	}else{
		month++;
	}
	nextmonth.setFullYear(year, month, 0);
	return nextmonth.getDate();
}

function get_appr_row_count(year, month){
	var remainder;
	var jsyear, jsmonth;
	var monthfirstday, monthlastday, monthdaycount;
	var arcount;
	
	jsyear = value_year;
	jsmonth = value_month - 1;
	
	monthdaycount = get_month_max_day(jsyear, jsmonth);
	arcount = Math.floor(monthdaycount / 7);
	remainder = monthdaycount % 7;
	if(remainder != 0){
		arcount++;
	}
	
	monthfirstday = new Date();
	monthfirstday.setFullYear(jsyear, jsmonth, 1);
	monthfirstday = monthfirstday.getDay();
	
	monthlastday = new Date();
	monthlastday.setFullYear(jsyear, jsmonth, monthdaycount);
	monthlastday = monthlastday.getDay();
	
	/* 最多只有 31 天，簡單寫個規則來判斷就好 */
	if(monthlastday < monthfirstday){
		arcount++;
	}
	
	return arcount;
}

function updatecaltable(){
	var objbd = document.getElementById("calbody");
	var oldcount = row_count;
	var newcount = get_appr_row_count(value_year, value_month);
	var node_tr;
	var node_td;
	var node_datediv;
	var node_datalist;
	var toremove;
	var toremoveiter;
	var i, j, k;
	if(newcount < oldcount){
		for(i=newcount+1; i<=oldcount; i++){
			for(j=0; j<7; j++){
				toremove = document.getElementById("caldate" + i.toString() + 
						j.toString());
				toremove.parentNode.removeChild(toremove);
				toremove = document.getElementById("caldatalist" + 
						i.toString() + j.toString());
				for(k=0; k<toremove.childNodes.length; k++){
					toremoveiter = toremove.childNodes[i];
					toremoveiter.parentNode.removeChild(toremoveiter);
				}
				toremove.parentNode.removeChild(toremove);
				toremove = document.getElementById("cal" + i.toString() + 
						j.toString());
				toremove.parentNode.removeChild(toremove);
			}
			toremove = document.getElementById("calrow" + i.toString());
			toremove.parentNode.removeChild(toremove);
		}
	}else{
		for(i=oldcount+1; i<=newcount; i++){
			node_tr = document.createElement("tr");
			node_tr.setAttribute("id", "calrow" + i.toString());
			for(j=0; j<7; j++){
				node_td = document.createElement("td");
				node_td.setAttribute("id", "cal" + i.toString() + 
						j.toString());
				node_datediv = document.createElement("div");
				node_datediv.setAttribute("id", "caldate" + i.toString() +
						j.toString());
				node_datalist = document.createElement("ul");
				node_datalist.setAttribute("id", "caldatalist" +
						i.toString() + j.toString());
				node_td.appendChild(node_datediv);
				node_td.appendChild(node_datalist);
				node_tr.appendChild(node_td);
			}
			objbd.appendChild(node_tr);
		}
	}
	row_count = newcount;
}

function setmonthcal(){
	objyear.innerHTML = value_year;
	objmonth.innerHTML = value_month;
	alldata = new Array();
	setcookievalue(cookie_year, value_year);
	setcookievalue(cookie_month, value_month);
	updatecaltable();
	var toyear = value_year;
	var tomonth = value_month - 1;
	var todate = 1;
	var od_day;
	var od_month;
	var od_year;
	var objdate = new Date();
	var objcal;
	var newbutton;
	var i;
	objdate.setFullYear(toyear, tomonth, todate);
	while((od_day = objdate.getDay()) != 0){
		todate = objdate.getDate();
		objdate.setDate(--todate);
	}
	for(i=1 ;i<=row_count ;objdate.setDate(++todate)){
		todate = objdate.getDate();
		od_day = objdate.getDay();
		od_month = objdate.getMonth();
		od_year = objdate.getYear();
		objcal = document.getElementById("cal" + i.toString() + 
				od_day.toString());
		objcaldate = document.getElementById("caldate" + i.toString() + 
				od_day.toString());
		objcaldatalist = document.getElementById("caldatalist" + i.toString() +
				od_day.toString());
		if(od_month == tomonth){
			objcal.style.borderColor = "black";
			objcal.style.color = "black";
			objcal.setAttribute("name", "date" + todate);
			objcal.setAttribute("onclick", 
				"setfocusblock(" + todate + ", true)");
			objcal.setAttribute("ondblclick",
				"caledit(" + value_year + ", " + value_month + ", " +
				todate + ")");
			objcaldate.innerHTML = todate;
			newbutton = document.createElement("input");
			newbutton.setAttribute("id", "calbutton" + i.toString() + 
				od_day.toString());
			newbutton.setAttribute("type", "button");
			newbutton.setAttribute("value", "進入");
			newbutton.setAttribute("onclick",
				"caledit(" + value_year + ", " + value_month + ", " +
				todate + ")");
			newbutton.style.display = "none";
			objcaldate.appendChild(newbutton);
			objcaldatalist.setAttribute("name", "datalist" + todate);
			objcaldatalist.innerHTML = "";
			alldata[todate] = new Object();
			alldata[todate].row = i;
			alldata[todate].col = od_day;
			if(value_date == todate){
				setfocusblock(todate, true);
			}else{
				resetblock(todate);
			}
		}else if(od_year < toyear || od_month < tomonth){
			objcal.style.borderColor = "lightgray";
			objcal.style.color = "gray";
			objcaldate.innerHTML = (od_month + 1).toString() + "/" + 
				todate.toString();
			objcal.removeAttribute("name");
			objcal.removeAttribute("onclick");
			objcal.removeAttribute("ondblclick");
			objcaldatalist.removeAttribute("name");
			objcaldatalist.innerHTML = "";
		}else if(od_year > toyear || od_month > tomonth){
			objcal.style.borderColor = "lightgray";
			objcal.style.color = "gray";
			objcaldate.innerHTML = (od_month + 1).toString() + "/" + 
				todate.toString();
			objcal.removeAttribute("name");
			objcal.removeAttribute("onclick");
			objcal.removeAttribute("ondblclick");
			objcaldatalist.removeAttribute("name");
			objcaldatalist.innerHTML = "";
		}else{
			alert("setmonthcal(): fatal error");
			return;
		}
		if(od_day >= 6){
			i++;
		}
	}
	calload();
}

function resetblock(thisdt){
	var oldobj = document.getElementById(
		"cal" + alldata[thisdt].row + alldata[thisdt].col);
	var oldobjtext = document.getElementById(
		"caldate" + alldata[thisdt].row + alldata[thisdt].col);
	var buttonobj = document.getElementById(
		"calbutton" + alldata[thisdt].row + alldata[thisdt].col);
	oldobj.style.borderColor = calfocus_bdc_org;
	oldobj.style.borderWidth = "1px";
	oldobjtext.style.color = "black";
	oldobjtext.style.fontWeight = "normal";
	buttonobj.style.display = "none";
}

function setfocusblock(thisdt, reset){
	if(reset){
		resetblock(value_date);
	}
	var thisobj, thatobj, buttonobj;
	try{
		thisobj = document.getElementById(
			"cal" + alldata[thisdt].row + alldata[thisdt].col);
		thatobj = document.getElementById(
			"caldate" + alldata[thisdt].row + alldata[thisdt].col);
		buttonobj = document.getElementById(
			"calbutton" + alldata[thisdt].row + alldata[thisdt].col);
	}catch(err){
		return;
	}
	calfocus_bdc_org = thisobj.style.borderColor;
	thisobj.style.borderColor = "blue";
	thisobj.style.borderWidth = "3px";
	thatobj.style.color = "green";
	thatobj.style.fontWeight = "bold";
	buttonobj.style.display = "inline";
	setcookievalue(cookie_date, thisdt);
	value_date = thisdt;
	status_bar_set(value_year + "年" + value_month + "月" + thisdt + "日");
	try{
		if(alldata[thisdt].data.length <= 0){
			throw false;
		}
		status_bar_append("(" + alldata[thisdt].data.length + "個活動)");
	}catch(err){
		status_bar_append("(沒有活動)");
	}
	status_bar_append(shortcut_mainmsg);
}

function movefocus_up(){
	var newdate = value_date - 7;
	setfocusblock(newdate <= 0 ? 1 : newdate, true);
}

function movefocus_down(){
	var newdate = value_date + 7;
	var maxdate = get_month_max_day(value_year, value_month - 1);
	setfocusblock(newdate >= maxdate ? maxdate : newdate, true);
}

function movefocus_left(){
	var newdate = value_date - 1;
	setfocusblock(newdate <= 0 ? 1 : newdate, true);
}

function movefocus_right(){
	var newdate = value_date + 1;
	var maxdate = get_month_max_day(value_year, value_month - 1);
	setfocusblock(newdate >= maxdate ? maxdate : newdate, true);
}

function direct0(evt){setfocusbykbdinput(evt,0);}
function direct1(evt){setfocusbykbdinput(evt,1);}
function direct2(evt){setfocusbykbdinput(evt,2);}
function direct3(evt){setfocusbykbdinput(evt,3);}
function direct4(evt){setfocusbykbdinput(evt,4);}
function direct5(evt){setfocusbykbdinput(evt,5);}
function direct6(evt){setfocusbykbdinput(evt,6);}
function direct7(evt){setfocusbykbdinput(evt,7);}
function direct8(evt){setfocusbykbdinput(evt,8);}
function direct9(evt){setfocusbykbdinput(evt,9);}

function setfocusbykbdinput(evt, defval){
	evt.preventDefault();
	$(document).unbind("keydown.main");
	var fcjobj = document.getElementById("focusjumper");
	fcjobj.value = defval;
	fcjobj.style.display = "inline";
	fcjobj.focus();
	fcjobj.setSelectionRange(1, 1);
	$(document).bind("keydown.sfk", "esc", setfocusbykbdinput_terminate);
	$(document).bind("keydown.sfk", "return", setfocusbykbdinput_apply);
	status_bar_save();
	status_bar_set("移至特定日期：(Esc)取消 (Enter)確定");
}

function setfocusbykbdinput_terminate(){
	var fcjobj = document.getElementById("focusjumper");
	fcjobj.value = "";
	fcjobj.style.display = "none";
	$(document).unbind("keydown.sfk");
	status_bar_restore();
	shortcut_bind();
}

function setfocusbykbdinput_apply(){
	var fcjobj = document.getElementById("focusjumper");
	var newvalue = parseInt(fcjobj.value);
	if(isFinite(newvalue) && newvalue >= 1 && 
		newvalue <= get_month_max_day(value_year, value_month - 1) ){
		setfocusblock(newvalue, true);
	}
	setfocusbykbdinput_terminate();
}

function call_caledit_kbd(evt){
	evt.preventDefault();
	caledit(value_year, value_month, value_date);
}

function shortcut_bind(){
	$(document).bind("keydown.main", "m", timeedit_month_kbd);
	$(document).bind("keydown.main", "y", timeedit_year_kbd);
	$(document).bind("keydown.main", "z", timeselect_prev_kbd);
	$(document).bind("keydown.main", "x", timeselect_fwd_kbd);
	$(document).bind("keydown.main", "ctrl+left", timeselect_prev_kbd);
	$(document).bind("keydown.main", "ctrl+right", timeselect_fwd_kbd);
	$(document).bind("keydown.main", "up", movefocus_up);
	$(document).bind("keydown.main", "down", movefocus_down);
	$(document).bind("keydown.main", "left", movefocus_left);
	$(document).bind("keydown.main", "right", movefocus_right);
	$(document).bind("keydown.main", "return", call_caledit_kbd);
	$(document).bind("keydown.main", "0", direct0);
	$(document).bind("keydown.main", "1", direct1);
	$(document).bind("keydown.main", "2", direct2);
	$(document).bind("keydown.main", "3", direct3);
	$(document).bind("keydown.main", "4", direct4);
	$(document).bind("keydown.main", "5", direct5);
	$(document).bind("keydown.main", "6", direct6);
	$(document).bind("keydown.main", "7", direct7);
	$(document).bind("keydown.main", "8", direct8);
	$(document).bind("keydown.main", "9", direct9);
	$(document).bind("keydown.main", "ctrl+l", switch_list);
}

function generate_display_string(calevt){
	return add_zero_padding(calevt.datetime.getHours().toString(), 2) + ':' +
		add_zero_padding(calevt.datetime.getMinutes().toString(), 2) + ' ' +
		calevt.title;
}

function calload(){
	var i;
	var thisdate;
	var ulobj, liobj;
	inccal_fetch(value_year, value_month);
	for(i=1; i<alldata.length; i++){
		alldata[i].data = new Array();
	}
	for(i=0; i<caleventlist.length; i++){
		thisdate = caleventlist[i].datetime.getDate();
		alldata[thisdate].data.push(caleventlist[i]);
		ulobj = document.getElementsByName("datalist" + thisdate)[0];
		liobj = document.createElement("li");
		liobj.innerHTML = generate_display_string(caleventlist[i]);
		ulobj.appendChild(liobj);
	}
	
}
