var activecalevt;
var caledit_select_oldval;
var caledit_ismodified;
var caledit_loaded;
var current_form;
var saved_form;
var caledit_defmsg = "(Esc)返回 (Ctrl-M)切換編輯 (Ctrl-左)左側 (Ctrl-右)右側 (Alt-U)新增或儲存 (Alt-K)刪除 (Alt-R)復原";

function caledit(year, month, date){
	var allbrowseobj = document.getElementsByName("calbrowse");
	var alldetailobj = document.getElementsByName("caldetail");
	var i;
	$(document).unbind("keydown.main");
	$(document).bind("keydown.caledit", "ctrl+m", caledit_edit);
	$(document).bind("keydown.caledit", "ctrl+left", caledit_focus_left);
	$(document).bind("keydown.caledit", "ctrl+right", caledit_focus_right);
	$(document).bind("keydown.caledit", "esc", caledit_quit);
	$(document).bind("keydown.caledit", "alt+u", caledit_save_func);
	$(document).bind("keydown.caledit", "alt+r", caledit_discard_func);
	$(document).bind("keydown.caledit", "alt+k", caledit_delete_func);
	status_bar_save();
	status_bar_set(caledit_defmsg);
	caledit_switchedit_disable();
	for(i=0; i<allbrowseobj.length; i++){
		allbrowseobj[i].style.display = "none";
	}
	for(i=0; i<alldetailobj.length; i++){
		alldetailobj[i].style.display = "block";
	}
	document.getElementById("switchlist").style.display = "none";
	document.getElementById("googlelogout").style.display = "none";
	current_form = new CalEvent();
	saved_form = new CalEvent();
	activecalevt = new Array();
	caledit_createoption();
	caledit_ismodified = false;
	caledit_loaded = false;
	document.getElementById("caledit_select").value = "new";
	caledit_loader(document.getElementById("caledit_newentry"));
}

function caledit_quit(){
	var allbrowseobj = document.getElementsByName("calbrowse");
	var alldetailobj = document.getElementsByName("caldetail");
	var i;
	try{
		if(caledit_loaded){
			if(caledit_validate()){
				caledit_write_current();
			}else{
				throw null;
			}
		}
		if(!saved_form.equal(current_form)){
			throw "您有尚未儲存的資訊，無法離開！";
		}
	}catch(err){
		document.getElementById("caledit_select").value = caledit_select_oldval;
		if(err != null){
			status_bar_warning(err);
		}
		return;
	}
	$(document).unbind("keydown.main");
	$(document).unbind("keydown.caledit");
	for(i=0; i<allbrowseobj.length; i++){
		allbrowseobj[i].style.display = "block";
	}
	for(i=0; i<alldetailobj.length; i++){
		alldetailobj[i].style.display = "none";
	}
	shortcut_bind();
	status_bar_restore();
	document.getElementById("switchlist").style.display = "inline";
	document.getElementById("googlelogout").style.display = "inline";
	caledit_clearoption();
	caledit_clean();
	if(caledit_ismodified){
		setmonthcal();
		setfocusblock(value_date);
	}
}

function caledit_edit()
{   
	var buttonobj;
	buttonobj = document.getElementById("caledit_switchedit");
	document.getElementById("caledit_dyn_year").style.display = "inline";
	switch(buttonobj.value){
		case "編輯":
			caledit_switchedit_enable();
			break;
		case "唯讀":
			caledit_switchedit_disable();
			break;
	}
}

function caledit_switchedit_enable()
{
	var buttonobj;
	var msgobj;
	var roobj, rwobj, robobj, rwbobj;
	var i;
	buttonobj = document.getElementById("caledit_switchedit");
	msgobj = document.getElementById("caledit_enabled");
	roobj = document.getElementsByName("caledit_read");
	rwobj = document.getElementsByName("caledit_write");
	robobj = document.getElementsByName("caledit_read_block");
	rwbobj = document.getElementsByName("caledit_write_block");
	buttonobj.value = "唯讀";
	msgobj.innerHTML = "編輯模式";
	for(i=0; i<roobj.length; i++){
		roobj[i].style.display = "none";
	}
	for(i=0; i<rwobj.length; i++){
		rwobj[i].style.display = "inline";
	}
	for(i=0; i<robobj.length; i++){
		robobj[i].style.display = "none";
	}
	for(i=0; i<rwbobj.length; i++){
		rwbobj[i].style.display = "block";
	}
	document.getElementById("caledit_save").style.display = "inline";
	document.getElementById("caledit_discard").style.display = "inline";
}

function caledit_switchedit_disable()
{
	var buttonobj;
	var msgobj;
	var roobj, rwobj, robobj, rwbobj;
	buttonobj = document.getElementById("caledit_switchedit");
	msgobj = document.getElementById("caledit_enabled");
	roobj = document.getElementsByName("caledit_read");
	rwobj = document.getElementsByName("caledit_write");
	robobj = document.getElementsByName("caledit_read_block");
	rwbobj = document.getElementsByName("caledit_write_block");
	buttonobj.value = "編輯";
	msgobj.innerHTML = "檢視模式";
	for(i=0; i<roobj.length; i++){
		roobj[i].style.display = "inline-block";
	}
	for(i=0; i<rwobj.length; i++){
		rwobj[i].style.display = "none";
	}
	for(i=0; i<robobj.length; i++){
		robobj[i].style.display = "block";
	}
	for(i=0; i<rwbobj.length; i++){
		rwbobj[i].style.display = "none";
	}
	document.getElementById("caledit_save").style.display = "none";
	document.getElementById("caledit_discard").style.display = "none";
	caledit_copyback();
}

function caledit_focus_left(){
	$("#caledit_select").focus();
}

function caledit_focus_right(){
	$("#caledit_switchedit").focus();
}

function caledit_clean(){
	var i;
	var roobj, rwobj, robobj, rwbobj;
	roobj = document.getElementsByName("caledit_read");
	rwobj = document.getElementsByName("caledit_write");
	robobj = document.getElementsByName("caledit_read_block");
	rwbobj = document.getElementsByName("caledit_write_block");
	for(i=0; i<roobj.length; i++){
		roobj[i].innerHTML = "";
	}
	for(i=0; i<rwobj.length; i++){
		rwobj[i].value = "";
	}
	for(i=0; i<robobj.length; i++){
		robobj[i].innerHTML = "";
	}
	for(i=0; i<rwbobj.length; i++){
		rwbobj[i].value = "";
	}
}

function caledit_fill(calevt){
	var yearobj, monthobj, dateobj, hourobj, minuteobj;
	var titleobj, remindobj, contentobj;
	var datafromobj; /* 這項不能修改 */
	yearobj = document.getElementById("caledit_static_year");
	monthobj = document.getElementById("caledit_static_month");
	dateobj = document.getElementById("caledit_static_date");
	hourobj = document.getElementById("caledit_static_hour");
	minuteobj = document.getElementById("caledit_static_minute");
	titleobj = document.getElementById("caledit_static_title");
	remindobj = document.getElementById("caledit_static_remind");
	contentobj = document.getElementById("caledit_static_content");
	datafromobj = document.getElementById("caledit_datafrom");
	yearobj.innerHTML = calevt.datetime.getFullYear();
	monthobj.innerHTML = calevt.datetime.getMonth() + 1;
	dateobj.innerHTML = calevt.datetime.getDate();
	hourobj.innerHTML = calevt.datetime.getHours();
	minuteobj.innerHTML = calevt.datetime.getMinutes();
	titleobj.innerHTML = calevt.title;
	remindobj.innerHTML = calevt.remind;
	contentobj.innerHTML = calevt.content;
	switch(calevt.datafrom){
		case 'native':
			datafromobj.innerHTML = productname;
			break;
		case 'google':
			datafromobj.innerHTML = 'Google 行事曆';
			break;
		case 'ntuceiba':
			datafromobj.innerHTML = '臺大 CEIBA 網站';
			break;
		default:
			datafromobj.innerHTML = '來源不明';
	}

	yearobj = document.getElementById("caledit_dyn_year");
	monthobj = document.getElementById("caledit_dyn_month");
	dateobj = document.getElementById("caledit_dyn_date");
	hourobj = document.getElementById("caledit_dyn_hour");
	minuteobj = document.getElementById("caledit_dyn_minute");
	titleobj = document.getElementById("caledit_dyn_title");
	remindobj = document.getElementById("caledit_dyn_remind");
	contentobj = document.getElementById("caledit_dyn_content");
	yearobj.value = calevt.datetime.getFullYear();
	monthobj.value = calevt.datetime.getMonth() + 1;
	dateobj.value = calevt.datetime.getDate();
	hourobj.value = calevt.datetime.getHours();
	minuteobj.value = calevt.datetime.getMinutes();
	titleobj.value = calevt.title;
	remindobj.value = calevt.remind;
	contentobj.value = calevt.content;
}

function caledit_copyback(){
	var yearobj, monthobj, dateobj, hourobj, minuteobj;
	var titleobj, remindobj, contentobj;
	var yearobjw, monthobjw, dateobjw, hourobjw, minuteobjw;
	var titleobjw, remindobjw, contentobjw;

	yearobj = document.getElementById("caledit_static_year");
	monthobj = document.getElementById("caledit_static_month");
	dateobj = document.getElementById("caledit_static_date");
	hourobj = document.getElementById("caledit_static_hour");
	minuteobj = document.getElementById("caledit_static_minute");
	titleobj = document.getElementById("caledit_static_title");
	remindobj = document.getElementById("caledit_static_remind");
	contentobj = document.getElementById("caledit_static_content");

	yearobjw = document.getElementById("caledit_dyn_year");
	monthobjw = document.getElementById("caledit_dyn_month");
	dateobjw = document.getElementById("caledit_dyn_date");
	hourobjw = document.getElementById("caledit_dyn_hour");
	minuteobjw = document.getElementById("caledit_dyn_minute");
	titleobjw = document.getElementById("caledit_dyn_title");
	remindobjw = document.getElementById("caledit_dyn_remind");
	contentobjw = document.getElementById("caledit_dyn_content");

	yearobj.innerHTML = yearobjw.value;
	monthobj.innerHTML = monthobjw.value;
	dateobj.innerHTML = dateobjw.value;
	hourobj.innerHTML = hourobjw.value;
	minuteobj.innerHTML = minuteobjw.value;
	titleobj.innerHTML = titleobjw.value;
	remindobj.innerHTML = remindobjw.value;
	contentobj.innerHTML = contentobjw.value;
}

function caledit_validate(){
	var yearobjw, monthobjw, dateobjw, hourobjw, minuteobjw;
	var titleobjw, remindobjw, contentobjw;
	var yearvalue, monthvalue;
	var tmp;
	yearobjw = document.getElementById("caledit_dyn_year");
	monthobjw = document.getElementById("caledit_dyn_month");
	dateobjw = document.getElementById("caledit_dyn_date");
	hourobjw = document.getElementById("caledit_dyn_hour");
	minuteobjw = document.getElementById("caledit_dyn_minute");
	titleobjw = document.getElementById("caledit_dyn_title");
	remindobjw = document.getElementById("caledit_dyn_remind");
	contentobjw = document.getElementById("caledit_dyn_content");
	
	try{
		yearvalue = parseInt(yearobjw.value);
		if(!isFinite(yearvalue)){
			throw "請輸入正確的年份！";
		}
		if(yearvalue < 1970){
			throw "請輸入 1970 年以後的年份！";
		}
		monthvalue = parseInt(monthobjw.value);
		if(!isFinite(monthvalue) || monthvalue < 1 || monthvalue > 12){
			throw "請輸入正確的月份！";
		}
		tmp = parseInt(dateobjw.value);
		if(!isFinite(tmp) || tmp < 1 || 
			tmp > get_month_max_day(yearvalue, monthvalue - 1)){
			throw "請輸入正確的日期！";
		}
		tmp = parseInt(hourobjw.value);
		if(!isFinite(tmp) || tmp < 0 || tmp >= 24){
			throw "請輸入正確的時間（小時）！";
		}
		tmp = parseInt(minuteobjw.value);
		if(!isFinite(tmp) || tmp < 0 || tmp >= 60){
			throw "請輸入正確的時間（分鐘）！";
		}
		tmp = parseInt(remindobjw.value);
		if(!isFinite(tmp)){
			throw "請輸入正確的提醒時間！";
		}
	}catch(err){
		status_bar_warning(err);
		return false;
	}

	return true;
}

function caledit_write_current(){
	var yearobjw, monthobjw, dateobjw, hourobjw, minuteobjw;
	var titleobjw, remindobjw, contentobjw;
	var yearvalue, monthvalue;
	var tmp;
	yearobjw = document.getElementById("caledit_dyn_year");
	monthobjw = document.getElementById("caledit_dyn_month");
	dateobjw = document.getElementById("caledit_dyn_date");
	hourobjw = document.getElementById("caledit_dyn_hour");
	minuteobjw = document.getElementById("caledit_dyn_minute");
	titleobjw = document.getElementById("caledit_dyn_title");
	remindobjw = document.getElementById("caledit_dyn_remind");
	contentobjw = document.getElementById("caledit_dyn_content");
	
	current_form.datetime.setFullYear(
		parseInt(yearobjw.value),
		parseInt(monthobjw.value) - 1,
		parseInt(dateobjw.value));
	current_form.datetime.setHours(
		parseInt(hourobjw.value),
		parseInt(minuteobjw.value),
		0, 0);

	current_form.remind = parseInt(remindobjw.value);
	current_form.title = titleobjw.value;
	current_form.content = contentobjw.value;
}

function caledit_loader(myself){
	var newcalevent;
	var dataindex;

	try{
		if(caledit_loaded){
			if(caledit_validate()){
				caledit_write_current();
			}else{
				throw false;
			}
		}
	}catch(err){
		myself.value = caledit_select_oldval;
		return;
	}

	if(current_form.equal(saved_form)){
		if(myself.value == "new"){
			newcalevent = new CalEvent();
			newcalevent.datetime.setFullYear(
					value_year, value_month - 1, value_date);
			newcalevent.datetime.setHours(0, 0);
			caledit_fill(newcalevent);
			saved_form = newcalevent.clone();
			current_form = newcalevent.clone();
			status_bar_set("新增" + " " + caledit_defmsg);
			caledit_switchedit_enable();
			document.getElementById("caledit_save").value = "新增";
			document.getElementById("caledit_delete").style.display = "none";
		}else{
			dataindex = parseInt(myself.value);
			caledit_fill(activecalevt[dataindex]);
			saved_form = activecalevt[dataindex].clone();
			current_form = activecalevt[dataindex].clone();
			dataindex++;
			status_bar_set(dataindex.toString() + " " + caledit_defmsg);
			caledit_switchedit_disable();
			if(current_form.deleted){
				document.getElementById("caledit_save").value = "重新插入";
			}else{
				document.getElementById("caledit_save").value = "儲存";
			}
			document.getElementById("caledit_delete").style.display = "inline";
		}
		caledit_select_oldval = myself.value;
	}else{
		status_bar_warning("您有尚未儲存的資訊，無法切換活動！");
		myself.value = caledit_select_oldval;
	}

	caledit_loaded = true;
}

function caledit_discard_func(){
	caledit_fill(saved_form);
}

function caledit_delete_func(){
	caledit_write_current();
	if(current_form.key == null){
		return;
	}else{
		inccal_remove(current_form, function(){
			var selobj = document.getElementById("caledit_select");
			var oldval = parseInt(caledit_select_oldval);
			current_form.key = null;
			current_form.deleted = true;
			saved_form = current_form.clone();
			activecalevt[oldval] = current_form.clone();
			document.getElementById("calselopt" + 
				caledit_select_oldval.toString()).innerHTML = 
				'<刪>';
			caledit_ismodified = true;
			if(oldval < activecalevt.length - 1){
				selobj.value = (oldval + 1).toString();
				caledit_loader(selobj);
			}
		});
	}
}

function caledit_save_func(){
	var oldtree;
	var newnode;
	var newcount;
	if(caledit_validate()){
		caledit_write_current();
	}else{
		return false;
	}
	inccal_send(current_form, function(resp){
		if(current_form.key == null){
			current_form.key = resp;
			newcount = activecalevt.length;
			activecalevt[newcount] = current_form.clone();
			oldtree = document.getElementById("caledit_select");
			newnode = document.createElement("option");
			newnode.setAttribute("id", "calselopt" + newcount.toString());
			newnode.value = newcount;
			newnode.innerHTML = '<新> ' + 
				generate_display_string(current_form);
			oldtree.appendChild(newnode);
		}else{
			activecalevt[caledit_select_oldval] = current_form.clone();
			if(current_form.datetime.getFullYear() == value_year &&
				current_form.datetime.getMonth() == value_month - 1 &&
				current_form.datetime.getDate() == value_date){
				document.getElementById("calselopt" + 
					caledit_select_oldval.toString()).innerHTML = 
					'<改> ' + generate_display_string(current_form);
			}else{
				document.getElementById("calselopt" + 
					caledit_select_oldval.toString()).innerHTML = 
					'<改> 其他日期';
			}
		}
		saved_form = current_form.clone();
		caledit_ismodified = true;
	});
	return false; /* 這樣才不會真的 submit */
}

function caledit_createoption(){
	var calselect = document.getElementById("caledit_select");
	var addoption = alldata[value_date].data;
	var newoption;
	var i;
	newoption = document.createElement("option");
	newoption.setAttribute("id", "caledit_newentry");
	newoption.value = "new";
	newoption.innerHTML = "新增活動......";
	calselect.appendChild(newoption);
	for(i=0; i<addoption.length; i++){
		newoption = document.createElement("option");
		newoption.setAttribute("id", "calselopt" + i.toString());
		newoption.value = i;
		newoption.innerHTML = generate_display_string(addoption[i]);
		calselect.appendChild(newoption);
		activecalevt.push(addoption[i].clone());
	}
}

function caledit_clearoption(){
	var calselect = document.getElementById("caledit_select");
	calselect.innerHTML = "";
}
