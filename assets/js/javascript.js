const userStatus = {
	email: '',
	password: '',
	error: {
		message: ''
	},
	content: '',
	date: ''
}


firebaseApp.auth().onAuthStateChanged(user => {
	if(user) {
		console.log(user);
		const { email } = user;
		userStatus.email = email;
		$('#navSignIn').hide();
		$('#section-signInModal').hide();
		$('#signOut').show();

console.log(userStatus);
	} else {
		$('#signOut').hide();
		$('#navSignIn').show();
	}
})

$(document).ready(function(){
	$('.navicon').click(function() {
		navToggle();
	});
	$('body').height($(document).height());

	$('.img-ex').click(function() {
		if($(this).hasClass('img-ex-rot')){
			let src = event.path[2].children[0].src;
			src = src.slice(0, src.length-11) + ".png";
			event.path[2].children[0].src = src;
		} else {
			let src = event.path[2].children[0].src;
			src = src.slice(0, src.length-4) + "-mobile.png";
			event.path[2].children[0].src = src;
		}
		$(this).toggleClass('img-ex-rot');
	});

});

function navToggle() {
	$('.navcontent').slideToggle("slow");
};

const page = {
	now:'repoTable'
};


function loadContent(next, first=false) {
	if($(document).width() <= 600 && !first) {
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
	if($(document).width() <= 600) {
		navToggle();
	}
	closeSignInModal();
}

function closeSignInModal() {
	$('#section-signInModal').slideToggle(500, changeSignTxt());
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

function signIn() {
	getUser();
	const { email, password } = userStatus;
	if(!checkUser()){
		return;
	}
	userStatus.error.message = '';
	firebaseApp.auth().signInWithEmailAndPassword(email, password)
		.catch(error => {
			userStatus.error = error;
			haveErr();
		})
	if(userStatus.error.message)
		return;
	signInModal();
}

function signUp() {
	getUser();
	const { email, password } = userStatus;
	if(!checkUser()){
		return;
	}
	userStatus.error.message = '';
	firebaseApp.auth().createUserWithEmailAndPassword(email, password)
		.catch(error => {
			userStatus.error = error;
			haveErr();
		})
	if(userStatus.error.message)
		return;
	signInModal();
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
	let s = event.target.className;
	s.includes(checkIconClass)? notConfirm() : checkComfirm();
	function notConfirm() {
		$('#confirm-icon').animate({ opacity:"0" }, 200).queue(function () {$(this).removeClass(checkIconClass).addClass(circleIconClass).dequeue()}).animate({ opacity: "1" },200);
		$('#confirm-word').html('請');
	}
	function checkComfirm() {
		$('#confirm-icon').animate({ opacity:"0" }, 200).queue(function () {$(this).removeClass(circleIconClass).addClass(checkIconClass).dequeue()}).animate({ opacity: "1" },200)
		$('#confirm-word').html('已');
	}
}

function askSubmit() {
	userStatus.content = $('.ask-text textarea').val();
	const { email, content } = userStatus;
	advisedRef.push({email, content});
}
