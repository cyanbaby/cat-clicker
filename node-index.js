// 返回当前 HTML 元素在父级下的索引值
Object.defineProperty(HTMLElement.prototype, 'index', {
	get: function() {
		var self = this;
		var siblings = [];

		[].forEach.call(self.parentNode.children, function(el) {
			siblings.push(el);
		});

		return siblings.indexOf(self);
	}
});

