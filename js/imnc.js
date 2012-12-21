var imnc_filecontent;
var imnc_xmlresponse;
var imnc_sendobjlist;
var addtitle, addmember, addmethod, addpercent, adddue, addlate, addsub, addcomment;

function NtuCeibaEvent(){
	this.title = "";
	this.member = "";
	this.method = "";
	this.percent = "";
	this.duedate = new Date();
	this.late = false;
	this.subdate = "";
	this.comment = "";
	this.red = false;
	this.enabled = true;
	this.key = null;
}

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
	addtitle = false;
	addmember = false;
	addmethod = false;
	addpercent = false;
	adddue = false;
	addlate = false;
   	addsub = false;
	addcomment = false;
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
				status_bar_clear();
				if(viewonly){
					imnc_xmlresponse = rq.responseXML;
					imnc_review();
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

function imnc_review(){
	var i;
	var ncevent;
	var calevtobj;
	var tableobj;
	var newrow;
	var newdata;
	var newinput1, newinput2, newinput3;
	var newtextnode;
	var univar;  /* 萬用暫存變數 */
	var defaultenabled; /* 預設情況下要不要插入這項目 */
	document.getElementById("imntuceibainfo").style.display = "none";
	document.getElementById("imntuceibacheck").style.display = "block";
	ncevent = imnc_xmlresponse.documentElement.getElementsByTagName("ncevent");
	if(ncevent.length == 0){
		document.getElementById("ncdatalisttitle").innerHTML = "沒有可匯入的資料";
		document.getElementById("ncdatalist").style.display = "none";
		return;
	}
	tableobj = document.getElementById("ncdatalist");
	imnc_sendobjlist = new Array();
	for(i=0; i<ncevent.length; i++){
		/* 新增一個 CalEvent 物件 */
		calevtobj = new CalEvent();
		calevtobj.datafrom = "ntuceiba";

		/* 先抓取 key 和 enabled 相關資料 */
		univar = ncevent[i].getElementsByTagName("key")[0].childNodes;
		if(univar.length > 0){
			calevtobj.key = univar[0].nodeValue;
		}
		univar = ncevent[i].getElementsByTagName("enabled")[0].childNodes[0].nodeValue;
		if(univar == "False"){
			defaultenabled = false;
		}else{
			defaultenabled = true;
		}

		/* 加入編號 */
		newrow = document.createElement("tr");
		newdata = document.createElement("td");
		newdata.innerHTML = (i+1).toString();
		newdata.style.textAlign = "right";
		newrow.appendChild(newdata);

		/* 加入動作 */
		newdata = document.createElement("td");
		newinput1 = document.createElement("input");
		newinput1.setAttribute("id", "imncradio" + i.toString() + "create");
		newinput1.setAttribute("name", "imncradio" + i.toString());
		newinput1.setAttribute("type", "radio");
		newdata.appendChild(newinput1);
		newtextnode = document.createTextNode("新增");
		newdata.appendChild(newtextnode);
		newinput2 = document.createElement("input");
		newinput2.setAttribute("id", "imncradio" + i.toString() + "ignore");
		newinput2.setAttribute("name", "imncradio" + i.toString());
		newinput2.setAttribute("type", "radio");
		newdata.appendChild(newinput2);
		newtextnode = document.createTextNode("忽略");
		newdata.appendChild(newtextnode);
		newinput3 = document.createElement("input");
		newinput3.setAttribute("id", "imncradio" + i.toString() + "update");
		newinput3.setAttribute("name", "imncradio" + i.toString());
		newinput3.setAttribute("type", "radio");
		newdata.appendChild(newinput3);
		newtextnode = document.createTextNode("取代");
		newdata.appendChild(newtextnode);
		newrow.appendChild(newdata);

		/* 設定 radio button 狀態 */
		if(calevtobj.key == null){
			newinput3.setAttribute("disabled", 'true');
			if(defaultenabled){
				newinput1.checked = true;
			}else{
				newinput2.checked = true;
			}
		}else{
			newinput3.checked = true;
		}

		/* 設定預設狀況 */
		
		tableobj.appendChild(newrow);
		imnc_sendobjlist.push(calevtobj);
	}
}

function imnc_login(){
	alert("Function not implemented");
}
