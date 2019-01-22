$(function() {
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

			this.$list = $('#catList');

			// 切换列表点击事件
			this.$list.on('click', 'li', function() {
				if ($(this).hasClass('active')) {
					return;
				}

				octopus.catIndex($(this).index());  // 更新索引
				self.render();  // 重新渲染列表
				detailView.render();  // 渲染对应详情视图
				formView.render();  // 渲染对应表单视图
			});

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

			this.$list.html(lists.join(' '));
		}
	};

	// 详情视图
	var detailView = {
		init: function() {
			this.$name = $('#catName');
			this.$img = $('#catImg');
			this.$clickCount = $('#catClicks');

			// 点击计数
			$('#catDetail').on('click', 'img', function() {
				octopus.increase();
			});

			this.render();
		},
		render: function() {
			var data = octopus.getCurrent();

			this.$name.html(data.name);
			this.$img.attr('src', 'images/' + data.imgUrl);
			this.$clickCount.html(data.clicks);
		}
	};

	// 表单视图
	var formView = {
		init: function() {
			var self = this;

			this.$form = $('.form');
			this.$inputName = $('#name');
			this.$inputImgUrl = $('#imgUrl');
			this.$inputClicks = $('#clicks');

			// 切换 form 可见性
			$('.btn-admin').click(function() {
				var oldState = octopus.adminMode();

				octopus.adminMode(!oldState);  // 点击后状态取反
				self.render();
			});

			// 保存
			$('.btn-save').click(function() {
				octopus.update({
					name: self.$inputName.val(),
					imgUrl: self.$inputImgUrl.val(),
					clicks: Number(self.$inputClicks.val())
				});

				detailView.render();
			});

			// 取消
			$('.btn-cancel').click(function() {
				self.render();
			});
		},
		render: function() {
			var data = octopus.getCurrent();
			var isAdminMode = octopus.adminMode();

			// admin 模式：显示表单并赋值表单元素
			if (isAdminMode) {
				this.$form.show();
				this.$inputName.val(data.name);
				this.$inputImgUrl.val(data.imgUrl);
				this.$inputClicks.val(data.clicks);
			} else {
				this.$form.hide();
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
});
