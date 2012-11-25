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
	if(useryear > 0 && usermonth >= 1 && usermonth <= 12){
		value_year = useryear;
		value_month = usermonth;
	}else{
		var today = new Date();
		value_year = today.getFullYear();
		value_month = today.getMonth();	
	} 
}

function timeselect_prev(){
	if(value_month <= 1){
		if(value_year > 1){
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
	if(newyear <= 0 || newmonth < 1 || newmonth > 12){
		alert("請輸入正確的年份和月份！");
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
	
}

function setmonthcal(){
	objyear.innerHTML = value_year;
	objmonth.innerHTML = value_month;
	setcookievalue(cookie_year, value_year);
	setcookievalue(cookie_month, value_month);
}

