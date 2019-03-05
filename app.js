!function() {
	/********************** Model **********************/
	var model = {
		cats: [
			{
				name: 'Sweet',
				imgUrl: 'cat_picture1.jpg',
				clicks: 0
			}, {
				name: 'Tough',
				imgUrl: 'cat_picture2.jpeg',
				clicks: 0
			}, {
				name: 'Yummy',
				imgUrl: 'cat_picture3.jpeg',
				clicks: 0
			}, {
				name: 'Ghost',
				imgUrl: 'cat_picture4.jpeg',
				clicks: 0
			}, {
				name: 'Flora',
				imgUrl: 'cat_picture5.jpeg',
				clicks: 0
			}
		],
		catIndex: null,
		isAdminMode: false  // 当前是否处于 admin 模式
	};

	/********************** View **********************/
	// 列表视图
	var listView = {
		init: function() {
			var self = this;

			this.$list = $$('#catList');

			// 切换列表点击事件
			this.$list.onclick = function(e) {
				var that = e.target;

				if (that.nodeName.toLowerCase() === 'li') {
					if (that.classList.contains('active')) {
						return;
					}

					octopus.catIndex(that.index);  // 更新索引
					self.render();  // 重新渲染列表
					detailView.render();  // 渲染对应详情视图
					formView.render();  // 渲染对应表单视图
				}
			}

			this.render();
		},
		render: function() {
			var lists = [];

			octopus.getAll().forEach(function(cat, idx) {
				var btn = '<li>';

				// 当前选中
				if (idx === octopus.catIndex()) {
					btn = '<li class="active">';
				}

				btn += cat.name + '</li>';

				lists.push(btn);
			});

			this.$list.innerHTML = lists.join(' ');
		}
	};

	// 详情视图
	var detailView = {
		init: function() {
			this.$name = $$('#catName');
			this.$img = $$('#catImg');
			this.$clickCount = $$('#catClicks');

			// 点击计数
			$$('#catDetail').onclick = function(e) {
				if (e.target.nodeName.toLowerCase() === 'img') {
					octopus.increase();
				}
			}

			this.render();
		},
		render: function() {
			var data = octopus.getCurrent();

			this.$name.innerHTML = data.name;
			this.$img.src = 'images/' + data.imgUrl;
			this.$clickCount.innerHTML = data.clicks;
		}
	};

	// 表单视图
	var formView = {
		init: function() {
			var self = this;

			this.$form = $$('.form');
			this.$inputName = $$('#name');
			this.$inputImgUrl = $$('#imgUrl');
			this.$inputClicks = $$('#clicks');

			// 切换 form 可见性
			$$('.btn-admin').onclick = function() {
				var oldState = octopus.adminMode();

				octopus.adminMode(!oldState);  // 点击后状态取反
				self.render();
			}

			// 保存
			$$('.btn-save').onclick = function() {
				octopus.update({
					name: self.$inputName.value,
					imgUrl: self.$inputImgUrl.value,
					clicks: Number(self.$inputClicks.value)
				});

				listView.render();
				detailView.render();
			}

			// 取消
			$$('.btn-cancel').onclick = function() {
				self.render();
			}
		},
		render: function() {
			var data = octopus.getCurrent();
			var isAdminMode = octopus.adminMode();

			// admin 模式：显示表单并赋值表单元素
			if (isAdminMode) {
				this.$form.style.display = 'block';
				this.$inputName.value = data.name;
				this.$inputImgUrl.value = data.imgUrl;
				this.$inputClicks.value = data.clicks;
			} else {
				this.$form.style.display = 'none';
			}
		}
	};

	/********************** Presenter **********************/
	var octopus = {
		// 从 model 中获取所有 cat
		getAll: function() {
			return model.cats;
		},

		// 获取/设置当前索引
		catIndex: function(index) {
			if (typeof index === 'number') {
				model.catIndex = index;
			}

			return model.catIndex;
		},

		// 获取当前 cat 对象
		getCurrent: function() {
			var cats = this.getAll();
			var idx = this.catIndex();

			return cats[idx];
		},

		// 更新点击数
		increase: function() {
			this.getCurrent().clicks++;
			detailView.render();
		},

		// 获取/设置 admin 模式
		adminMode: function(modeState) {
			if (typeof modeState === 'boolean') {
				model.isAdminMode = modeState;
			}

			return model.isAdminMode;
		},

		// 更新 model 数据
		update: function(data) {
			model.cats[this.catIndex()] = data;
		},
		init: function() {
			model.catIndex = 0;  // 缺省显示列表中第一个
			model.isAdminMode = false;  // 缺省不启用 admin 模式

			listView.init();
			detailView.init();
			formView.init();
		}
	};

	octopus.init();
}();
