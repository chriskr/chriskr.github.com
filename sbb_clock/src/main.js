window.onload = function() {
	try {
		SBBClock.create(document.body);
	} catch(e) {
    if (location.pathname.indexOf('es2015') === -1) {
      location.href = '../es2015/index.html';
    }
	}
};