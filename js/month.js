/* 這是和月曆相關的函式
 * 相依於：cookie.js */

var cookie_year = "inccal_year";    /* 存放目前選取年份的 cookie 名稱 */
var cookie_month = "inccal_month";  /* 存放目前選取月份的 cookie 名稱 */
var value_year;    /* 目前選取的年份（整數） */
var value_month;   /* 目前選取的月份（整數），注意與 javascript 中 Date() 表示的不同 */
var objyear;       /* 顯示年份的物件 */
var objmonth;      /* 顯示月份的物件 */
var row_count = 0; /* 月曆列數 */

function setyearmonth(){
	var useryear = parseInt(getcookievalue(cookie_year));
	var usermonth = parseInt(getcookievalue(cookie_month));
	/* 初始化 objyear 和 objmonth，其他函式中不用在做同樣的動作 */
	objyear = document.getElementById("timeselect_year");
	objmonth = document.getElementById("timeselect_month");
	if(useryear >= 1970 && usermonth >= 1 && usermonth <= 12){
		value_year = useryear;
		value_month = usermonth;
	}else{
		var today = new Date();
		value_year = today.getFullYear();
		value_month = today.getMonth() + 1;	
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
	setmonthcal();
}

function timeselect_fwd(){
	if(value_month >= 12){
		value_year++;
		value_month = 1;
	}else{
		value_month++;
	}
	setmonthcal();
}

function timeselect_direct(){
	document.getElementById("timeedit_year").style.display = "inline";
	document.getElementById("timeedit_month").style.display = "inline";
	document.getElementById("timeedit_apply").style.display = "inline";
	document.getElementById("timeedit_cancel").style.display = "inline";
	document.getElementById("timeselect_year").style.display = "none";
	document.getElementById("timeselect_month").style.display = "none";
	document.getElementById("timeselect_prev").style.display = "none";
	document.getElementById("timeselect_fwd").style.display = "none";
	
	document.getElementById("timeedit_year").value = value_year;
	document.getElementById("timeedit_month").value = value_month;
}

function timeedit_apply(){
	var newyear = parseInt(document.getElementById("timeedit_year").value);
	var newmonth = parseInt(document.getElementById("timeedit_month").value);
	try{
		if(!isFinite(newyear) || !isFinite(newmonth)){
			throw "請輸入正確的數字！";
		}else if(newyear < 1970){
			throw "請輸入 1970 年以後的年份！";
		}else if(newmonth < 1 || newmonth > 12){
			throw "請輸入正確的月份！";
		}
	}catch(err){
		alert(err);
		return;
	}
	value_year = newyear;
	value_month = newmonth;
	setmonthcal();
	timeedit_cancel();
}

function timeedit_cancel(){
	document.getElementById("timeedit_year").style.display = "none";
	document.getElementById("timeedit_month").style.display = "none";
	document.getElementById("timeedit_apply").style.display = "none";
	document.getElementById("timeedit_cancel").style.display = "none";
	document.getElementById("timeselect_year").style.display = "inline";
	document.getElementById("timeselect_month").style.display = "inline";
	document.getElementById("timeselect_prev").style.display = "inline";
	document.getElementById("timeselect_fwd").style.display = "inline";
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
	var toremove;
	var i, j;
	if(newcount < oldcount){
		for(i=newcount+1; i<=oldcount; i++){
			for(j=0; j<7; j++){
				toremove = document.getElementById("cal" + i.toString() + j.toString());
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
				node_td.setAttribute("id", "cal" + i.toString() + j.toString());
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
		objcal = document.getElementById("cal" + i.toString() + od_day.toString());
		if(od_month == tomonth){
			objcal.style.borderColor = "black";
			objcal.style.color = "black";
			objcal.innerHTML = todate;
		}else if(od_year < toyear || od_month < tomonth){
			objcal.style.borderColor = "lightgray";
			objcal.style.color = "gray";
			objcal.innerHTML = (od_month + 1).toString() + "/" + todate.toString();
		}else if(od_year > toyear || od_month > tomonth){
			objcal.style.borderColor = "lightgray";
			objcal.style.color = "gray";
			objcal.innerHTML = (od_month + 1).toString() + "/" + todate.toString();
		}else{
			alert("setmonthcal(): fatal error");
			return;
		}
		if(od_day >= 6){
			i++;
		}
	}
}

