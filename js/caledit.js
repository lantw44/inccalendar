function caledit(year, month, date){
	var allbrowseobj = document.getElementsByName("calbrowse");
	var alldetailobj = document.getElementsByName("caldetail");
	var i;
	$(document).unbind("keydown.main");
	$(document).bind("keydown.caledit", "ctrl+e", caledit_edit);
	$(document).bind("keydown.caledit", "ctrl+1", caledit_focus_left);
	$(document).bind("keydown.caledit", "ctrl+2", caledit_focus_right);
	$(document).bind("keydown.caledit", "alt+q", caledit_quit);
	status_bar_save();
	status_bar_set("(Alt-Q)返回 (Ctrl-E)切換編輯 (Ctrl-1)左側 (Ctrl-2)右側 ");
	caledit_switchedit_disable();
	for(i=0; i<allbrowseobj.length; i++){
		allbrowseobj[i].style.display = "none";
	}
	for(i=0; i<alldetailobj.length; i++){
		alldetailobj[i].style.display = "block";
	}
	document.getElementById("switchlist").style.display = "none";
	document.getElementById("googlelogout").style.display = "none";
}

function caledit_quit(){
	var allbrowseobj = document.getElementsByName("calbrowse");
	var alldetailobj = document.getElementsByName("caldetail");
	var i;
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
}

function caledit_focus_left(){
	$("#caledit_select").focus();
}

function caledit_focus_right(){
	$("#caledit_switchedit").focus();
}
