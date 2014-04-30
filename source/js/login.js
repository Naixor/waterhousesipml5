// JavaScript Document
//sendVariable这个变量便是使用方法，为一个数组类型，格式为{friend_Name, img_src, friend_Name, img_src.....}
window.onload = function() {
	
	var windowWidth = window.screen.availWidth;
	var windowHeight = window.screen.availHeight;
	document.getElementById("backgroud_Div").style.width = window.screen.availWidth+'px';
	document.getElementById("backgroud_Div").style.height = window.screen.availHeight+'px';
	document.getElementById("backgroud_Div").style.display="none";

	$("#register").click(function(e) {
		loginInitialize();
	});

	$("#unregister").click(function(e) {
    logout();
});

	$("#button").click(function(e) {
		var callList_length = document.getElementById("ul1").getElementsByTagName("li").length; 		
		var currentName = getCurrentName();

		makeCall(currentName);
		setTimeout(display_backgroudDiv,2000); // 显示变暗效果
		document.getElementById("videoBackGround").style.visibility = "visible";
	});

	VCode.init();
	$("#main").click(function() {
		VCode.init();
	});

	$("#OK").click(function() {
		VCode.check($("#checkInput").val());
	});

};

function display_backgroudDiv(){
	document.getElementById("backgroud_Div").style.display="block";
}
