var stbobj;
var stbdic = {
	"loading": "載入中......",
	"completed": "完成"
};
var stbstack;
var stbstr = "";
var stbwarned = 0;

function status_bar_init(){
	stbobj = document.getElementById("statusbar");
	stbstack = new Array();
}

function status_bar_set(msgstr){
	stbstr = msgstr;
	stbwarned = false;
	stbobj.style.color = "white";
	stbobj.innerHTML = msgstr;
}

function status_bar_warning(msgstr){
	stbstr = msgstr;
	stbwarned = true;
	stbobj.style.color = "red";
	stbobj.innerHTML = msgstr;
}

function status_bar_append(msgstr){
	stbstr = stbstr + " " + msgstr;
	stbobj.innerHTML = stbstr;
}

function status_bar_clear(){
	stbstr = ""
	stbobj.innerHTML = stbstr;
}

function status_bar_save(){
	var stbnewnode = new Object();
	stbnewnode.str = stbstr;
	stbnewnode.warn = stbwarned;
	stbstack.push(stbnewnode);
}

function status_bar_restore(){
	var stbgetnode = stbstack.pop();
	if(stbgetnode){
		if(stbgetnode.warn){
			status_bar_warning(stbgetnode.str);
		}else{
			status_bar_set(stbgetnode.str);
		}
	}
}

function status_bar_special(mgstr){
	for(spstr in stbdic){
		if(mgstr == spstr){
			stbstr = stbdic[spstr];
			stbobj.innerHTML = stbstr;
		}
	}
}
