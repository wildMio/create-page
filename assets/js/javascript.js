$(document).ready(function(){
	$('.navicon').click(function() {
		navToggle();
	});
	$('body').height($(document).height());
});

const navToggle = () => {
	$('.navcontent').slideToggle("slow");
};

const loadContent = () => {
	if($(document).width() <= 600) {
		navToggle();
	}
};