var stbobj;
var stbdic = {
	"loading": "載入中......",
	"completed": "完成"
};

function status_bar_init(){
	stbobj = document.getElementById("statusbar");
}

function status_bar_set(msgstr){
	stbobj.innerHTML = msgstr;
}

function status_bar_special(mgstr){
	for(spstr in stbdic){
		if(mgstr == spstr){
			stbobj.innerHTML = stbdic[spstr];
		}
	}
}
