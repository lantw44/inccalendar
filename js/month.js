var cookie_year = "inccal_year";
var cookie_month = "inccal_month";
var value_year;
var value_month;
var objyear;
var objmonth;

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
	if(!isFinite(newyear) || !isFinite(newmonth)){
		alert("請輸入正確的數字！");
		return;
	}else if(newyear < 1970){
		alert("請輸入 1970 年以後的年份！");
		return;
	}else if(newmonth < 1 || newmonth > 12){
		alert("請輸入正確的月份！");
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

function createcaltable(){
	objbd = document.getElementById("calbody");
	var i, j;
	var node_tr;
	var node_td;
	for(i=1; i<=5; i++){
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

function setmonthcal(){
	objyear.innerHTML = value_year;
	objmonth.innerHTML = value_month;
	setcookievalue(cookie_year, value_year);
	setcookievalue(cookie_month, value_month);
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
	for(i=1 ;i<=5 ;objdate.setDate(++todate)){
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
			objcal.style.color = "lightgray";
			objcal.innerHTML = (od_month + 1).toString() + "/" + todate.toString();
		}else if(od_year > toyear || od_month > tomonth){
			objcal.style.borderColor = "lightgray";
			objcal.style.color = "lightgray";
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

