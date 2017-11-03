$(document).ready(function(){
	$('.navicon').click(function() {
		navToggle();
	});
});

const navToggle = () => {
	$('.navcontent').slideToggle("slow");
};

const loadContent = () => {
	if($(document).width() <= 600) {
		navToggle();
	}
	console.log($(document).width());
};