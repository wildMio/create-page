// const data = [
// 	fetch('/a.html'),
// 	fetch('/b.html'),
// 	fetch('/c.html'),
// ];

// for await (const item of data) {
// 	console.log(item);
// }

// input[name=value]	Exact match
// input[name~=vlaue]	Contains word
// input[name*=vlaue]	Contains string
// input[name^=value]	Starts with
// input[name$=value]	Ends with

const userStatus = {
	uid: '',
	email: '',
	password: '',
	error: {
		message: ''
	},
	message: '',
	chattext: ''
}

function preventstr(preventstr) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
	return preventstr.replace(/[&<>"']/g, function(m) { return map[m]; });
}


firebaseApp.auth().onAuthStateChanged(user => {
	if(user) {
		console.log('user in uid: ', user.uid);
		userStatus.email = user.email;
		userStatus.uid = user.uid;
		$('#navSignIn').hide();
		$('#section-signInModal').hide();
		$('#signOut').show();

	} else {
		console.log('user out');
		userStatus.email = '';
		userStatus.uid = '';
		$('#signOut').hide();
		$('#navSignIn').show();
	}
});

$(document).ready(function(){
	$('.navicon').click(function() {
		navToggle();
	});

	$('.img-ex').click(function(event) {
		let src = event.currentTarget.parentElement.children[0].src;
		if($(this).hasClass('img-ex-rot')){
			src = src.slice(0, src.length-11) + ".png";
		} else {
			src = src.slice(0, src.length-4) + "-mobile.png";
		}
		event.currentTarget.parentElement.children[0].src = src;
		$(this).toggleClass('img-ex-rot');
	});
	// CLICK IT
	$('.menu-icon').bind('click', function() {
		$('.menu-icon').removeClass('paused').addClass('active');
		$('.menu').removeClass('paused').addClass('active');
	});

	$('.menu').bind('click', function() {
		$('.menu-icon').removeClass('active');
		$('.menu').removeClass('active');
	});
});

function navToggle(type = 'open') {
	if(type === 'open'){
		$('.navcontent').slideToggle("fast");
	} else {
		$('.navcontent').slideUp("fast");
	}
};

const page = {
	now:'about'
};

let adviseds = [];
let advisedshas = [];

function loadContent(next, first=false) {
	if($(document).width() <= 720 && !first) {
		navToggle();
	}
	if(page.now !== next){
		if(first) {
			navLight();
			$('.'+page.now).toggle(0);
			$('.'+next).toggle(0);
			page.now = next;
		} else {
			navLight();
			$('.'+page.now).slideToggle(200, function() {
				$('.'+next).slideToggle(400);
			});
			page.now = next;
		}
	}

	function navLight() {
		let nownav = document.querySelector('.navLight');
		let nextnav = document.querySelector('a[href="#section-'+next+'"]');
		nownav.className = '';
		nextnav.className = 'navLight';
	}

};

function firstload() {
	if(location.hash){
		let path = location.hash.slice(9);
		loadContent(path, true);
	}
};

firstload();

function signInModal() {
	if($(document).width() <= 720) {
		navToggle('close');
	}
	closeSignInModal();
}

function closeSignInModal() {
	$('#section-signInModal').slideToggle(500, function() {changeSignTxt()});
}

const navSignIn = document.querySelector('#navSignIn');
const signInIcon = '<i class="fa fa-user-o" aria-hidden="true"></i> 登入';
const closeIcon = '<i class="fa fa-times" aria-hidden="true"></i>';
const chooseIcon = '<i class="fa fa-superpowers" aria-hidden="true"></i>';

function changeSignTxt() {
	navSignIn.innerHTML = (navSignIn.innerHTML !== closeIcon) ? closeIcon : signInIcon;
}

const nowTab = {
	now: "in"
};

const tabin = document.querySelector('#tabin');
const tabup = document.querySelector('#tabup');

function showIn() {
	if(nowTab.now !== "in") {
		nowTab.now = "in";
		tabin.innerHTML = chooseIcon + " 登入";
		tabup.innerHTML = "註冊";
		$('#signUp').fadeOut(300, function() {$('#signIn').fadeIn(500)});
	}
}
function showUp() {
	if(nowTab.now !== "up") {
		nowTab.now = "up";
		tabin.innerHTML = "登入";
		tabup.innerHTML = chooseIcon + " 註冊";
		$('#signIn').fadeOut(300, function() {$('#signUp').fadeIn(500)});
	}
}

function getUser() {
	userStatus.email = $('input[name="email"]').val();
	userStatus.password = $('input[name="password"]').val();
}

const loadIcon = '<i class="fa fa-spinner fa-pulse fa-fw"></i><span class="sr-only">Loading...</span>';

function signIn() {
	getUser();
	const { email, password } = userStatus;
	if(!checkUser()){
		return false;
	}
	userStatus.error.message = '';
	$('#signIn').html(loadIcon);
	firebaseApp.auth().signInWithEmailAndPassword(email, password)
		.catch(error => {
			userStatus.error = error;
			haveErr();
			return error;
		}).then(function(value) {
			// signInModal();
			$('#signIn').html('登入');
			if(userStatus.error.message){
				return false;
			} else {
				$('#errtxt').html(userStatus.error.message).hide();
				closeSignInModal();
			}
		});
}

function signUp() {
	getUser();
	const { email, password } = userStatus;
	if(!checkUser()){
		return false;
	}
	userStatus.error.message = '';
	$('#signUp').html(loadIcon);
	firebaseApp.auth().createUserWithEmailAndPassword(email, password)
		.catch(error => {
			userStatus.error = error;
			haveErr();
			return error;
		}).then(function(value) {
			// signInModal();
			$('#signUp').html('註冊');
			if(userStatus.error.message){
				return false;
			} else {
				$('#errtxt').html(userStatus.error.message).hide();
				closeSignInModal();
			}
		});
}

function checkUser() {
	if(!userStatus.email) {
		userStatus.error.message = "尚未輸入信箱.";
		haveErr();
		return false;
	}
	if(!userStatus.password) {
		userStatus.error.message = "尚未輸入密碼.";
		haveErr();
		return false;
	}
	return true;
}

function haveErr(error) {
	$('#errtxt').html(userStatus.error.message).fadeIn(300);
}

function signOut() {
	firebaseApp.auth().signOut();
}

const circleIconClass = 'fa-circle-o';
const checkIconClass = 'fa-check-square-o txt-blue';

function askConfirm() {
	let s = $('#confirm-icon');
	s.hasClass(checkIconClass)? notConfirm() : checkComfirm();
	function notConfirm() {
		s.animate({ opacity:"0" }, 200).queue(function () {$(this).removeClass(checkIconClass).addClass(circleIconClass).dequeue()}).animate({ opacity: "1" },200);
		$('#confirm-word').html('請');
	}
	function checkComfirm() {
		s.animate({ opacity:"0" }, 200).queue(function () {$(this).removeClass(circleIconClass).addClass(checkIconClass).dequeue()}).animate({ opacity: "1" },200)
		$('#confirm-word').html('已');
	}
}

function askSubmit() {
	const exclamation = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
	if(!userStatus.email){
		showAskError(' 請登入會員 ');
		return;
	}
	if(!$('#confirm-icon').hasClass(checkIconClass)){
		showAskError(' 請點擊確認鈕 ');
		return;
	}

	function showAskError(message) {
		$('.askErrTxt').html(exclamation+message+exclamation);
		$('#askErr').show(600);
	}
	$('#askErr').hide();
	let submitbtn = $('.confirm-btn button');
	submitbtn.attr('onclick', 'return;');
	submitbtn.html(loadIcon);
	userStatus.message = $('.ask-text textarea').val();
	let { email, message } = userStatus;
	const fromid = userStatus.uid;
	const timestamp = firebase.firestore.FieldValue.serverTimestamp();
	messagesRef.add({fromid, email: preventstr(email), message: preventstr(message), timestamp}).then(function(ref) {
		submitbtn.html('送出');
		askConfirm();
		submitbtn.attr('onclick', 'askSubmit()');
		$('.ask-text textarea').val('');
		$('.ask-text textarea').attr('placeholder', '感謝你的留言!');
		ref.get().then(function(doc) {
			let onemessage = {};
			let { email, message } = doc.data();
			const id = doc.id;
			const date = doc.data().timestamp.toLocaleDateString();
			onemessage = {id, email, message, date};
			console.log(onemessage);
			appendMessage(onemessage, 'before')
		}).catch(function(error) {
			console.log(error);
		});
	}).catch(function(error) {
		console.log(error);
		submitbtn.html('送出');
		submitbtn.attr('onclick', 'askSubmit()');
		$('.ask-text textarea').val('');
		$('.ask-text textarea').attr('placeholder', '傳送失敗，請等待一段時間再次嘗試');
	});
}

var firstRef;
var nextRef;
var lastVisible;
var order = "timestamp";
var orderdir = "desc";
var limitcount = 1;

function loadData () {
	firstRef = messagesRef.orderBy(order, orderdir).limit(limitcount);
	firstRef.get().then(function(querySnapshot) {
		let messages = [];
		querySnapshot.forEach(function(doc) {
			const { email, message, timestamp } = doc.data();
			const id = doc.id;
			const date = timestamp.toLocaleDateString();
			messages.push({id, email, message, date});
		});
		// console.log(messages);
		// Get the last visible document
		lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
		// console.log("last", lastVisible);
		$('.message-board').html('');
		messages.forEach(item => {
			appendMessage(item);
		});
	}).catch(function(error) {
		console.log(error);
	});
}
loadData();
function loadMore() {
	// Construct a new query starting at this document,
	nextRef = messagesRef.orderBy(order, orderdir).startAfter(lastVisible).limit(limitcount);
	firstRef = nextRef;
	$('.message-board').append('<div style="margin:20px 10px;" id="message-loadicon"><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
	firstRef.get().then(function(querySnapshot) {
		let messages = [];
		querySnapshot.forEach(function(doc) {
			const { email, message, timestamp } = doc.data();
			const id = doc.id;
			const date = timestamp.toLocaleDateString();
			messages.push({id, email, message, date});
		});
		// console.log("loadmore", messages);
		// Get the last visible document
		lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
		// console.log("last", lastVisible);
		// Construct a new query starting at this document,
		// nextRef = messagesRef.orderBy(order, orderdir).startAfter(lastVisible).limit(limitcount);
		$('#message-loadicon').remove();
		mbbsnum = (mbbsnum+1)%mbbslen;
		messages.forEach(item => {
			appendMessage(item);
		});
		if(messages.length < limitcount) {
			nomorebtn();
		}
	}).catch(function(error) {
		console.log(error);
		nomorebtn();
	});
	function nomorebtn() {
		$('#showmorebtn').html('無更多留言 <i class="fa fa-minus-circle" aria-hidden="true"></i>');
		$('#showmorebtn').attr('onclick', 'return;');$('#showmorebtn').attr('style', 'cursor:not-allowed;');
	}
}

// mbbs === message-box box-shadow
const mbbs = ['mbbs1', 'mbbs2'];
const mbbslen = mbbs.length;
let mbbsnum = 0;

function appendMessage(item, action = 'after') {
	const { email, message, date, id} = item;
	console.log('key', id);
	const emailname = email.split('@')[0];
	const txt = `<div class="message-cell" key=${id}>
					<div class="message-box ${mbbs[mbbsnum]}" id="message-box">
						<div class="message-info">
							<div class="message-user"><i class="fa fa-id-badge" aria-hidden="true"></i> ${emailname}</div>
							<div class="message-time">${date}</div>
						</div>
						<div class="blur ct"><i class="fa fa-quote-left fa-border" style="font-size:12px;" aria-hidden="true"></i></div>
						<div class="message-content">${message}</div>
						<div class="blur ct"><i class="fa fa-quote-right fa-border" style="font-size:12px" aria-hidden="true"></i></div>
						<div class="message-room">
							<button class="orange-btn" onclick="enterchatroom('${id}')"><i class="fa fa-users" aria-hidden="true"></i> 聊天室</button>
						</div>
					</div>
					<div class="chat-box message-box" id="chat-box">
						<div class="chat-room">
							<div class="chat-setting">
								<div class="chat-icon hint--bottom-left hint--info hint--rounded hint--bounce" data-hint="至最新" onclick="toNewestChat('${id}', event)">
									<i class="fa fa-truck" aria-hidden="true"></i>
								</div>
								<div class="chat-icon hint--bottom-left hint--info hint--rounded hint--bounce" data-hint="離開" onclick="exitchatroom('${id}')">
									<i class="fa fa-window-close-o" aria-hidden="true"></i>
								</div>
							</div>
						</div>
						<div class="chat-bar">
							<div style="width: 75%;"><input type="text" name="chat-text" class="chat-text" placeholder="輸入訊息..." id="chat-subbmit"></div>
							<div style="width: 24%;" class="chat-subbtn"><button style="width: 100%;" class="orange-btn" onclick="addchat('${id}')">送出 <i class="fa fa-reply rotate90" aria-hidden="true"></i></button></div>
						</div>
					</div>
				</div>`;
	if(action === 'after') {
		$('.message-board').append(txt);
	} else {
		$('.message-board').prepend(txt);
	}
}

const eyeIcon = '<i class="fa fa-eye-slash" aria-hidden="true"></i>';
const chatroomRefs = {};

function enterchatroom(key) {
	if(!userStatus.uid) {
		$('#message-error').html('請先登入會員 '+eyeIcon);
		$('#message-error').fadeIn(500);
		return;
	}
	$('.message-cell[key="'+key+'"] #message-box').hide();
	$('.message-cell[key="'+key+'"] #chat-box').show();
	chatroomRefs[key] = db.collection("messages").doc(key).collection("chatroom").orderBy(order)
		.onSnapshot(function(snapshot) {
		let chattexts = [];
		snapshot.docChanges.forEach(function(change) {
			// let source = change.doc.metadata.hasPendingWrites ? "Local" : "Server";
			// console.log(source, " data: ", change && change.doc.data());
			// console.log(change.doc.data().timestamp);
			if(change.type === 'added') {
				chattexts.push(change.doc.data());
			}
		});
		chattexts.forEach(item => {
			appendChat(item, key);
		});
	}, function(error) {
		console.log('error', error);
	});
	$('.message-cell[key="'+key+'"] #message-box').removeClass('mbbs2');
}

const chatnames = {};
function appendChat(item, key) {
	const { fromid, email, chattext, timestamp } = item;
	const time = (timestamp) ? timestamp.toLocaleTimeString() : new Date().toLocaleTimeString();
	const date = (timestamp) ? timestamp.toLocaleDateString() : new Date().toLocaleDateString();
	const emailname = email.split('@')[0];
	if(fromid === chatnames[key]) {
		const txt = `<div><div class="chat-content hint--top-right hint--success hint--rounded" data-hint="${time} ${date}">${chattext}</div></div>`;
		$('.message-cell[key="'+key+'"] #chat-box .chat-room .chat-message:last-child .chat-main').append(txt);
	} else {
		chatnames[key] = fromid;
		const txt = `<div class="chat-message">
						<div class="chat-name">${emailname}</div>
						<div class="chat-main">
							<div><div class="chat-content hint--bottom-right hint--success hint--rounded" data-hint="${time} ${date}">${chattext}</div></div>
						</div>
					</div>`;
		$('.message-cell[key="'+key+'"] #chat-box .chat-room').append(txt);
	}
}

function exitchatroom(key) {
	$('.message-cell[key="'+key+'"] #chat-box').hide();
	$('.message-cell[key="'+key+'"] #message-box').show();
	// Stop listening to changes
	chatroomRefs[key]();
	chatnames[key] = '';
	$('.message-cell[key="'+key+'"] #chat-box .chat-room .chat-message').remove();
}

function addchat(key) {
	const chatsubmit = $('.message-cell[key="'+key+'"] #chat-box .chat-bar .chat-text');
	userStatus.chattext = chatsubmit.val();
	if(!userStatus.uid) {
		$('#message-error').html('請先登入會員 '+eyeIcon);
		$('#message-error').fadeIn(500);
		return;
	}
	if(!userStatus.chattext){
		console.log("請輸入訊息");
		return;
	}
	const chatbtn = $('.message-cell[key="'+key+'"] #chat-box .chat-bar .chat-subbtn button');
	chatbtn.attr('onclick', 'return;');
	chatbtn.html(loadIcon);

	let { email, chattext } = userStatus;
	const fromid = userStatus.uid;
	const timestamp = firebase.firestore.FieldValue.serverTimestamp();
	const chatroomRef = db.collection("messages").doc(key).collection("chatroom");

	chatroomRef.add({fromid, email: preventstr(email), chattext: preventstr(chattext), timestamp}).then(function() {
		chatbtn.attr('onclick', `addchat('${key}')`);
		chatbtn.html('送出 <i class="fa fa-reply rotate90" aria-hidden="true"></i>');
		chatsubmit.val('');
	}).catch(function(error) {
		console.log(error);
	}).then(function () {
		toNewestChat(key);
	});
}

function toNewestChat(key, e) {
	const room = $('.message-cell[key="'+key+'"] #chat-box .chat-room');
	room.animate({ scrollTop: document.querySelector('.message-cell[key="'+key+'"] #chat-box .chat-room').scrollHeight}, 'fast');
}

function loadcountChange() {
	console.log('countchange');
	let num = Number($('#loadcount').val());
	if(num < 1) {
		num = 1;
	} else if(num > 10) {
		num = 10;
	}
	limitcount = num;
	console.log(limitcount, typeof(limitcount));
}

var loadnum = $('#loadnum');

async function changeloadnum(n) {
	let num = Number(loadnum.html())+n;
	let leftpx;
	if(n===-1)
		leftpx = "-20px";
	else
		leftpx = "26.5px";
	if(num < 1) {
		num = 1;
	} else if(num > 9) {
		num = 9;
	}
	limitcount = num;
	loadnum.animate({opacity:0.3,left:leftpx},100).queue(function(){$(this).html(num).dequeue()}).animate({opacity:1,left:"6.5px"},100);
}

function errorClick() {
	if($('#section-signInModal').css('display') === 'none')
		signInModal();
	$('#message-error').fadeOut(500);
}

function logScroll(element) {
	const position = document.querySelector('#'+element).offsetTop;
	$("html, body").animate({ scrollTop: position}, 'slow');
}