
function toggleBackground(x, y) {
	var element = document.getElementById(x + ',' + y);
	if (element.style.backgroundColor === 'blue') {
		element.style.backgroundColor = 'white';
	} else {
		element.style.backgroundColor = 'blue';
	}
}