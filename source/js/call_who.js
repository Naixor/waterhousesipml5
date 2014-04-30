// JavaScript Document

var oDiv;
var oUl;
var aLi;
var i;
var iNow;
var ready;
var wait;
var currentName; // 当前选中的人物姓名
	
var prev;
var next;
var callShow = function ()
{
	oDiv=document.getElementById('call_Div');
	oUl=document.getElementById('ul1');
	aLi=oUl.getElementsByTagName('li');
	i=0;
	iNow=0;
	ready=true;
	wait=0;
	
	prev = document.getElementById("prev");
	next = document.getElementById("next");
	
	prev.onclick = function ()
	{
		tab((iNow-1+aLi.length)%aLi.length);
	};

	next.onclick = function ()
	{
		tab((iNow+1)%aLi.length);
	};
	next.onclick();
	
	var arr=[{b: 'webkit', e: 'webkitTransitionEnd'}, {b: 'firefox', e: 'transitionend'}];
	
	function tEnd(ev){
		var obj=ev.srcElement||ev.target;
		if(obj.tagName!='LI')return;
		wait--;
		if(wait<=0)ready=true;
	}
	
	for(var i=0;i<arr.length;i++)
	{
		if(navigator.userAgent.toLowerCase().search(arr[i].b)!=-1)
		{
			document.addEventListener(arr[i].e, tEnd, false);
			break;
		}
	}
	
	function m(n){
		return (n+aLi.length)%aLi.length;
	}
	
	function tab(now)
	{
		if(!ready)return;
		ready=false;
		
		iNow=now;
		
		wait=aLi.length;
		
		for(var i=0;i<aLi.length;i++)
		{
			aLi[i].className='';
			aLi[i].onclick=null;
		}
		aLi[m(iNow-2)].className='left2';
		aLi[m(iNow-1)].className='left';
		aLi[iNow].className='cur';
		aLi[m(iNow+1)].className='right';
		aLi[m(iNow+2)].className='right2';
		
		setEv();
	}
	
	setEv();
	
	function setEv()
	{
		aLi[m(iNow-1)].onclick=prev.onclick;
		
			var video = false;
			document.getElementById('button').onclick = function ()
			{
				video = true;
			};
		aLi[m(iNow+1)].onclick=next.onclick;
	}
	document.getElementById('call_Div').style.visibility = 'visible';
	document.getElementById("logout_Div").style.visibility = "visible"; // 显示注销按钮
};

function getCurrentName(){
	//currentName = aLi.item(iNow).innerHTML;
	currentName = aLi.item(iNow).getElementsByTagName("h1")[0].innerHTML;
	return currentName;
}

