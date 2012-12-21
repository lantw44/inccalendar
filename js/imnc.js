var imnc_filecontent;

function imnc_init(){
	status_bar_clear();
	document.getElementById("imstepforminit").style.display = "none";
	document.getElementById("imntuceibainfo").style.display = "block";
}

function imnc_deinit(){
	document.getElementById("imstepforminit").style.display = "block";
	document.getElementById("imntuceibainfo").style.display = "none";
}

function imnc_argok(){
	status_bar_clear();
	if(document.getElementById("nclogin").checked){
		imnc_login();
	}else if(document.getElementById("ncupload").checked){
		imnc_upload();
	}else{
		status_bar_warning("請至少選取一種資料取得方式！");
	}
}

function imnc_upload(){
	var fileldobj;
	var filereader;
	fileldobj = document.getElementById("ncfile");
	if(window.FileReader){  /* 支援 HTML5 File API 的話 */
		if(fileldobj.files.length <= 0){
			status_bar_warning("請選擇檔案！");
			return;
		}
		filereader = new FileReader();
		filereader.onloadend = function(evt){
			imnc_filecontent = evt.target.result;
			imnc_upload_send();
		}
		filereader.readAsText(fileldobj.files[0], 'Big5');
	}else{ 
		status_bar_warning("抱歉，尚未支援您的瀏覽器");
		return;
	}
}

function imnc_upload_send(){
	var rq;
	rq = create_xmlhttp_object();

}
