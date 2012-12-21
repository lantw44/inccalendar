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
		filereader.readAsText(fileldobj.files[0], 
			document.getElementById("ncfileenc").value);
	}else{ 
		status_bar_warning("抱歉，尚未支援您的瀏覽器");
		return;
	}
}

function imnc_upload_send(){
	var rq;
	var sendmsg;
	var viewonly = false;
	var addtitle = false, addmember = false, addmethod = false;
	var addpercent = false, adddue = false, addlate = false;
   	var addsub = false, addcomment = false;
	rq = create_xmlhttp_object();
	rq.open('POST', '/access/imnc');
	rq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	sendmsg = "file=" + encodeURIComponent(imnc_filecontent);
	if(document.getElementById("ncviewagain").checked){
		viewonly = true;
		sendmsg += "&viewonly=1";
	}
	if(document.getElementById("ncmerge").checked){
		sendmsg += "&merge=1";
		if(document.getElementById("ncdupupdate").checked){
			sendmsg += "&overwrite=1";
		}
	}
	if(document.getElementById("ncaddtitle").checked){
		addtitle = true;
		sendmsg += "&addtitle=1";
	}
	if(document.getElementById("ncaddmember").checked){
		addmember = true;
		sendmsg += "&addmember=1";
	}
	if(document.getElementById("ncaddmethod").checked){
		addmethod = true;
		sendmsg += "&addmethod=1";
	}
	if(document.getElementById("ncaddpercent").checked){
		addpercent = true;
		sendmsg += "&addpercent=1";
	}
	if(document.getElementById("ncadddue").checked){
		adddue = true;
		sendmsg += "&adddue=1";
	}
	if(document.getElementById("ncaddlate").checked){
		addlate = true;
		sendmsg += "&addlate=1";
	}
	if(document.getElementById("ncaddsub").checked){
		addsub = true;
		sendmsg += "&addsub=1";
	}
	if(document.getElementById("ncaddcomment").checked){
		addcomment = true;
		sendmsg += "&addcomment=1";
	}

	rq.send(sendmsg);
	rq.onreadystatechange = function(){
		var completemsg;
		var textmsgtuple;
		if(rq.readyState == 4){
			if(rq.status == 200){
				status_bar_clear("資料已接收");
				if(viewonly){
					abc = rq.responseXML;
				}else{
					completemsg = rq.responseText;
					textmsgtuple = completemsg.split(" ");
					document.getElementById("imntuceibainfo").style.display = "none";
					document.getElementById("imntuceibacomplete").style.display = "block";
					document.getElementById("ncimportresult").innerHTML = 
						"臺大 CEIBA 資料總數：" + textmsgtuple[0] + "<br>" + 
						"新增的資料數量：" + textmsgtuple[1] + "<br>" + 
						"取代的資料數量：" + textmsgtuple[2] + "<br>"
				}
			}else{
				status_bar_warning("伺服器回傳 " + rq.status.toString() + " 錯誤");
			}
		}
	}
}
