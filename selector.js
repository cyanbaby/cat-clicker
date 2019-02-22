!function(win) {
	var selector = function(str) {
		var node = null;

		if (/^#\w+/.test(str)) {
			node = document.getElementById(str.substr(1));
		} else {
			node = document.querySelectorAll(str);
		}

		if (node.length === 1) {
			return node[0];
		}

		return node;
	};

	win.$$ = selector;
}(window);
