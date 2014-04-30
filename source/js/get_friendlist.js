// JavaScript Document
function get_Friendlist(friendArray) {
	var len = friendArray.length/2;
	var show = new Array(len);
	if (len == 1) {
		show[0] = "<li class=''><h1 class='label'>" + friendArray[0] + "</h1><img src=" + friendArray[1] + "></li>";
		document.getElementById('ul1').innerHTML = show[0];
	}
	else if (len == 2) {
		show[0] = "<li class=''><h1 class='label'>" + friendArray[0] + "</h1><img src=" + friendArray[1] + "></li>";
		show[1] = "<li class=''><h1 class='label'>" + friendArray[2] + "</h1><img src=" + friendArray[3] + "></li>";

		document.getElementById('ul1').innerHTML = show[0] + show[1] + show[0] + show[1] + show[0] + show[1];
	}
	else if (len == 3) {
		for (var i = 0;i < 6;i = i+2) {
			var index = i/2;
			show[index] = "<li class=''><h1 class='label'>" + friendArray[i] + "</h1><img src=" + friendArray[i+1] + "></li>";
		}
		document.getElementById('ul1').innerHTML = show[0] + show[1] + show[2] + show[0] + show[1] + show[2];
	}
	else if (len == 4) {
		for (var i = 0;i < 8;i = i+2) {
			var index = i/2;
			show[index] = "<li class=><h1 class='label'>" + friendArray[i] + "</h1><img src=" + friendArray[i+1] + "></li>";
		}
		document.getElementById('ul1').innerHTML = show[0] + show[1] + show[2] + show[3] + show[0] + show[1] + show[2] + show[3];
	}
	else if (len==5 || len>5) {
		for(var i = 0;i < len*2;i = i+2) {
			var index = i/2;
			show[index] = "<li class=''><h1 class='label'>" + friendArray[i] + "</h1><img src=" + friendArray[i+1] + "></li>";
		}

		for (var i = 0;i < len;i++) {
			document.getElementById('ul1').innerHTML += show[i]; 
		}
	}
	else {
		alert("get bad array");
	}
}