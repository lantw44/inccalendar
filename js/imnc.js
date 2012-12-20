function imnc_init(){
	status_bar_clear();
	document.getElementById("imstepforminit").style.display = "none";
	document.getElementById("imntuceibainfo").style.display = "block";
}

function imnc_deinit(){
	document.getElementById("imstepforminit").style.display = "block";
	document.getElementById("imntuceibainfo").style.display = "none";
}
