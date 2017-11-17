firebaseApp.auth().onAuthStateChanged(user => {
	if(user) {
		// console.log('user has signed in or up', user);
		$('#navSignIn').hide();
		$('#section-signInModal').hide();
		$('#signOut').show();
	} else {
		// console.log('user has signed out or still needs to signin.');
		$('#signOut').hide();
		$('#navSignIn').show();
	}
})

$(document).ready(function(){
	$('.navicon').click(function() {
		navToggle();
	});
	$('body').height($(document).height());
});

function navToggle() {
	$('.navcontent').slideToggle("slow");
};

const page = {
	now:'repoTable'
};


function loadContent(next, first=false) {
	if($(document).width() <= 600) {
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

function showMobilePage() {
	let src = event.target.src;
	src = src.slice(0, src.length-4) + "-mobile.png";
	event.target.src = src;
}

function showWebPage() {
	let src = event.target.src;
	src = src.slice(0, src.length-11) + ".png";
	event.target.src = src;
}

function signInModal() {
	if($(document).width() <= 600) {
		navToggle();
	}
	$('#section-signInModal').slideToggle(500, changeSignTxt());
}

const navSignIn = document.querySelector('#navSignIn');

function changeSignTxt() {
	navSignIn.innerHTML = (navSignIn.innerHTML !== '×') ? '&times;' : '登入';
}

const nowTab = {
	now: "in"
};

const tabin = document.querySelector('#tabin');
const tabup = document.querySelector('#tabup');

function showIn() {
	if(nowTab.now !== "in") {
		nowTab.now = "in";
		tabin.innerHTML = "&rsaquo;登入";
		tabup.innerHTML = "註冊";
		$('#signUp').fadeOut(300, function() {$('#signIn').fadeIn(500)});
	}
}
function showUp() {
	if(nowTab.now !== "up") {
		nowTab.now = "up";
		tabin.innerHTML = "登入";
		tabup.innerHTML = "&rsaquo;註冊";
		$('#signIn').fadeOut(300, function() {$('#signUp').fadeIn(500)});
	}
}

const user = {
	email: '',
	password: '',
	error: {
		message: ''
	}
}
function getUser() {
	user.email = $('input[name="email"]').val();
	user.password = $('input[name="password"]').val();
}

function signIn() {
	getUser();
	const { email, password } = user;
	if(!checkUser()){
		return;
	}
	firebaseApp.auth().signInWithEmailAndPassword(email, password)
		.catch(error => {
			user.error = error;
			haveErr();
		})
	if(!user.error.message)
		return;
	signInModal();
}

function signUp() {
	getUser();
	const { email, password } = user;
	firebaseApp.auth().createUserWithEmailAndPassword(email, password)
		.catch(error => {
			user.error = error;
			haveErr();
		})
	if(!user.error.message)
		return;
	signInModal();
}

function checkUser() {
	if(!user.email) {
		user.error.message = "尚未輸入信箱.";
		haveErr();
		return false;
	}
	if(!user.password) {
		user.error.message = "尚未輸入密碼.";
		haveErr();
		return false;
	}
	return true;
}

function haveErr(error) {
	$('#errtxt').html(user.error.message).fadeIn(300);
}

function signOut() {
	firebaseApp.auth().signOut();
}