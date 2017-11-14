$(document).ready(function(){
	$('.navicon').click(function() {
		navToggle();
	});
	$('body').height($(document).height());
});

const navToggle = () => {
	$('.navcontent').slideToggle("slow");
};

const page = {
	now:'repoTable'
}

const loadContent = (next) => {
	if($(document).width() <= 600) {
		navToggle();
	}
	if(page.now !== next){
		navLight(event);
		$('.'+page.now).slideToggle(200, function() {
			$('.'+next).fadeToggle(400);
		});
		page.now = next;
	}



	function navLight(e) {
		let a = document.querySelector('.navLight');
		a.className = '';
		e.target.className = 'navLight';
	}
};
