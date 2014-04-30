
var impu, impi, password, realm, display_name, websocket_proxy_url, outbound_proxy_url;
var textPhoneNumber;

var isWaiting = false;		//用来判断是否正处于呼叫状态
var url = "";				//url用来储存对方的DdisplayName
var waitingTimer;		
var isCaller = false;		//isCaller用来判断是否为呼叫方
var waitingTime = 30000;	//记录呼叫等待时间
var padHangUpTime = 0;	
var isTrueTerminate=true;		//判断是真正挂断（true）还是反呼叫机制（false）

var readyCallback = function(e){
	createSipStack();
};
var errorCallback = function(e){
	//Print Error
};

var registrationSession;
function login(){
	registrationSession = sipStack.newSession('register', {
		events_listener: {events: '*', listener: function(e){
			$("#session_status").html(e.type);
			if(e.type == 'connected' && e.session == registrationSession){
				//makeCall();
				//sendMessage();
				//publishPresence();
				//subscribePresence('');
				var sendVariable = ["web-nihao","source/images/1.jpg","pad-qr","source/images/2.jpg","pad-nihao","source/images/3.jpg","web-qr","source/images/4.jpg"];
				var loginDiv = document.getElementById('login_Div');
				loginDiv.className = 'moveTo';
				loginDiv.style.visibility = 'hidden';
				get_Friendlist(sendVariable);
				window.setTimeout(callShow,1000);
			} 
			else if(e.type == 'terminated' && e.type == 'stopped'){
				window.location.reload();
			}
			else if(e.type == 'terminated' && e.session == registrationSession){
				alert("用户名或密码错误，请重新输入！");
				window.location.reload();
			}
			
				
		}}
	});
	registrationSession.register();
}

function logout(){
	//registrationSession.unregister();
	sipStack.stop();
	document.getElementById("logout_Div").style.visibility = "hidden";	
	location.reload([true]);
}


function loginInitialize(){
	realm = "bupt315.sse";
	impi = "web-" + $("#name").val() + "@" + realm;
	impu = "sip:" + impi;
	password = $("#password").val();
	display_name = "web-" + $("#name").val();
	websocket_proxy_url = "ws://192.168.16.125:4062" ;
	outbound_proxy_url = "udp://192.168.16.173:4060";
	
	textPhoneNumber = "web-nihao";
	SIPml.init(readyCallback, errorCallback);
}

var sipStack;
function createSipStack(){ 
	sipStack = new SIPml.Stack({
		realm: realm,
		impi: impi,
		impu: impu,
		password: password,
		display_name: display_name,
		websocket_proxy_url: websocket_proxy_url,
		outbound_proxy_url: outbound_proxy_url,
		enable_rtcweb_breaker: false,
		events_listener: {events: '*', listener: function(e){
			$("#stack_status").html(e.type);
			if(e.type == 'started'){
				login();
			}
			else if(e.type == 'i_new_message'){
				acceptMessage(e);
			}
			else if(e.type == 'i_new_call'){
				if(isCaller&&isTrueTerminate)
				{
					isTrueTerminate = false;
				}
				oCallSession = e.newSession;
				var sRemoteNumber = (oCallSession.getRemoteFriendlyName() || 'unknown');

				if(isWaiting){
					if(sRemoteNumber == url){
						//url = "";
						isWaiting = false;
						acceptCall(e);
					}
				}
				else{
					$("#whoCall").html("<i>Incoming call from [<b>" + sRemoteNumber + "</b>]</i>");
					$("#newCall").animate({top:'10px'}, 1000);
					$("#accept_button").click(function () {
						acceptCall(e);
						$("#newCall").animate({top:'-100px'}, 1000);
					});
					$("#reject_button").click(function () {
						rejectCall(e);
					});
				}
			}
		}},
		sip_headers: [{name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.0.0.0'}]
	});
	sipStack.start();
}


var callSession;						//callSession是主叫方的session
/*发出视频对话请求*/
function makeCall(calledName){
	callSession = sipStack.newSession('call-audiovideo', {
		video_local: document.getElementById('video-local'),
		video_remote: document.getElementById('video-remote'),
		events_listener: {
			events: '*',
			listener: onSipSessionEvent
		},
		sip_caps: [
			{ name: '+g.oma.sip-im' },
			{ name: '+sip.ice' },
			{ name: 'language', value: '\"en,fr\"' }
		]
	});
	url = calledName;			//此处url用来储存被呼叫者的url
	isCaller = true;
	//document.getElementById("divVideo").style.visibility="visible";
	document.getElementById("videoStream").style.visibility="visible";

	if(url.substring(0,3) == "pad"){
		isWaiting = true;
		callSession.call(url);
		setTimeout(function () {
			if(isWaiting == true){
				url = "";
				isWaiting = false;
			}
		}, waitingTime);
		
		$("#hangup_cross").click(function(){
			sendMessage();
			HangUp();
		});
	}
	else{
		callSession.call(url);
		$("#hangup_cross").click(function(){
			sendMessage();
			HangUp();
		});
	}
}


var calledSession;					//calledSession是被叫方的session
/*接受呼入的视频通话请求*/
function acceptCall(e){
	var sConf = {
		video_local: document.getElementById('video-local'),
		video_remote: document.getElementById('video-remote'),
		events_listener: {events: '*', listener: onSipSessionEvent},
		sip_caps: [
			{ name: '+g.oma.sip-im' },
			{ name: '+sip.ice' },
			{ name: 'language', value: '\"en,fr\"' }
		]
	};
	calledSession = e.newSession;
	url = calledSession.getRemoteFriendlyName();		//此处url用来储存呼叫方的url
	document.getElementById("videoStream").style.visibility="visible";    //使videoStream这个层可见
	document.getElementById("backgroud_Div").style.display="block";      // 使背景变暗
	calledSession.accept(sConf);
	$("#hangup_cross").click(function (e) {
		sendMessage();
		HangUp();
	});
}

/*onSipSessionEvent*/
function onSipSessionEvent (e /*SIPml.Session.Event*/) {
	tsk_utils_log_info("==session event" + e.type);
	
	switch (e.type) {
		case 'connecting': case 'connected': {
			break;	
		}
		case 'terminating': case 'terminated': {
			alert("isCaller=" + isCaller + " isTrueTerminate=" + isTrueTerminate);
			if(isCaller)
			{
				isTrueTerminate = true;
				var interval = setInterval(function()
				{
					alert("isTrueTerminate=" + isTrueTerminate);
					if(isTrueTerminate)
					{
						if(url.substring(0,3) == "pad")
						{
							document.getElementById("videoStream").style.visibility="hidden";
							document.getElementById("backgroud_Div").style.display="none";
						}
					}
					clearTimeout(interval);
				}, 3000);
			}
			alert(url);
			/*alert(padHangUpTime);
			if(padHangUpTime%2 == 1){
				if(url.substring(0,3) == "pad"){
					document.getElementById("videoStream").style.visibility="hidden";
					document.getElementById("backgroud_Div").style.display="none";
				}
			}
			padHangUpTime++;
			break;*/
		}
	}
}

/*拒绝呼叫方发出的视频呼叫请求*/
function rejectCall(e){
	var rejectSession = sipStack.newSession('message', {
		events_listener: {events: '*', listener: function(e){
		}}
	});

	rejectMessageSession = e.newSession;
	var rejectMessageTo = rejectMessageSession.getRemoteFriendlyName();
	rejectSession.send(rejectMessageTo, "BYE" + display_name, 'text/plain;charset=utf-8');
	$("#newCall").animate({top:'-100px'}, 1000);
}

/*发送挂断消息*/
function sendMessage(e){
	var messagingSession = sipStack.newSession('message', {
		events_listener: {events: '*', listener: function(e){
		}}
	});
	//alert("send");
	messagingSession.send(url, "BYE" + display_name, 'text/plain;charset=utf-8');
}

/*接收挂断消息并进行响应*/
function acceptMessage(e){
	mCallSession = e.newSession;
	var mRemoteNumber = (mCallSession.getRemoteFriendlyName()|| 'unknown');
	mCallSession.accept();
	alert("message accepted: " + e.getContentString())
	var bye = e.getContentString().substring(0,3);
	var sendByeMessageName = e.getContentString().substring(3);

	if(bye == "BYE" && sendByeMessageName == url){
		HangUp();
	}
	else if(bye == "BYE" && url == ""){
		non_accept_hangup();
	}
}

/*呼叫方在呼叫时直接挂断被叫方处理函数*/
function non_accept_hangup(){
	callSession = null;
	isWaiting = false;
	url = "";
	$("#newCall").animate({top:'-100px'}, 1000);
	document.getElementById("videoStream").style.visibility="hidden";
	document.getElementById("backgroud_Div").style.display="none";
}

/*挂断函数*/
function HangUp(){
	if(isCaller == true)
		callSession.hangup();
	if(isCaller == false)
		calledSession.hangup();
	calledSession = null;
	isWaiting = false;
	isCaller = false;
	url = "";
	document.getElementById("videoStream").style.visibility="hidden";
	document.getElementById("backgroud_Div").style.display="none";
}