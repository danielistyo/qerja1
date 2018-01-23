var Word = Backbone.Model.extend({
	move: function () {
		this.set({ y: this.get('y') + this.get('speed') });
	}
});

var Words = Backbone.Collection.extend({
	model: Word
});

var WordView = Backbone.View.extend({
	initialize: function () {
		$(this.el).css({ position: 'absolute' });
		var string = this.model.get('string');
		var letter_width = 25;
		var word_width = string.length * letter_width;
		if (this.model.get('x') + word_width > $(window).width()) {
			this.model.set({ x: $(window).width() - word_width });
		}
		for (var i = 0; i < string.length; i++) {
			$(this.el)
				.append($('<div>')
					.css({
						width: letter_width + 'px',
						padding: '5px 2px',
						'border-radius': '4px',
						'background-color': '#fff',
						border: '1px solid #ccc',
						'text-align': 'center',
						float: 'left',
					})
					.text(string.charAt(i).toUpperCase()));
		}

		this.listenTo(this.model, 'remove', this.remove);

		this.render();
	},

	render: function () {
		$(this.el).css({
			top: this.model.get('y') + 'px',
			left: this.model.get('x') + 'px',
			width: '100%'
		});
		var highlight = this.model.get('highlight');
		var self = this;
		$(this.el).find('div').each(function (index, element) {
			if (index < highlight) {
				$(element).css({ 'font-weight': 'bolder', 'background-color': '#aaa', color: '#fff' });
			} else {
				$(element).css({ 'font-weight': 'normal', 'background-color': '#fff', color: '#000' });


			}
		});
	}
});

var TyperView = Backbone.View.extend({
	initialize: function () {
		var wrapper = $('<div>')
			.css({
				position: 'fixed',
				top: '0',
				left: '0',
				width: '100%',
				'min-width': '320px',
				height: '100%'
			});
		this.wrapper = wrapper;
		// var initialWindowWidth = $( window ).width();
		// $( window ).resize(function() {
		// 	var words = self.model.get('words');
		// 		for (var i = 0; i < words.length; i++) {
		// 			var word = words.at(i);
		// 			word.set("x",word.get('x')-(initialWindowWidth-$( window ).width()));
		// 			console.log(word.get('string')+" : "+word.get('x')+" selisih: "+(initialWindowWidth-$( window ).width()));
		// 		}
		// });

		var self = this;
		var text_input = $('<input>')
			.addClass('form-control')
			.attr('disabled', true)
			.css({
				'border-radius': '4px',
				position: 'absolute',
				bottom: '0',
				'min-width': '80%',
				width: '80%',
				'margin-bottom': '10px',
				'z-index': '1000'
			}).keyup(function () {
				var words = self.model.get('words');
				var correctTypedCount = 0;
				for (var i = 0; i < words.length; i++) {
					var word = words.at(i);
					var typed_string = $(this).val();
					var string = word.get('string');
					if (string.toLowerCase().indexOf(typed_string.toLowerCase()) == 0) {
						word.set({ highlight: typed_string.length });
						correctTypedCount++;
						if (typed_string.length == string.length) {
							$(this).val('');

							// add point
							self.model.set('point', self.model.get('point') + 1);
						}
					} else {
						word.set({ highlight: 0 });
					}
				}
				if (correctTypedCount == 0 && self.model.get('loop') != null) {
					alert('wrong typed');
					// subtract point
					if (self.model.get('point') > 0) {
						self.model.set('point', self.model.get('point') - 1);
						$(this).val('');
					}
				}
			});

		var buttonGlobal = $('<input>')
			.addClass('form-control')
			.attr('type', 'button')
			.css({
				position: 'absolute',
				bottom: '0',
				width: '80px',
				'margin-bottom': '50px',
				'z-index': '1000'
			});


		var startButton = buttonGlobal.clone();
		startButton.addClass('btn-primary')
			.val('Start')
			.click(function () {
				self.model.start();
				$(this).val("Resume");
				$(this).attr('disabled', true);
				pauseButton.removeAttr('disabled');
				stopButton.removeAttr('disabled');
				text_input.removeAttr('disabled');
				text_input.focus();
			});

		// var resumeButton = buttonGlobal.clone();
		// resumeButton.addClass('btn-primary')
		// 	.val('Resume')
		// 	.click(function () {
		// 		self.model.start();
		// 	});

		var pauseButton = buttonGlobal.clone();
		pauseButton.addClass('btn-warning')
			.val('Pause')
			.attr('disabled', true)
			.click(function () {
				self.model.pause();
				startButton.removeAttr('disabled');
				text_input.attr('disabled', true);
			});

		var stopButton = buttonGlobal.clone();
		stopButton.addClass('btn-danger')
			.val('Stop')
			.attr('disabled', true)
			.click(function () {
				self.model.stop();
				startButton.val('Start');
				startButton.removeAttr('disabled');
				pauseButton.attr('disabled', true);
				$(this).attr('disabled', true);
				text_input.val('');
				text_input.attr('disabled', true);
			});

		this.pointLabel = $('<label>')
			.css({
				position: 'absolute',
				bottom: '0',
				width: '80px',
				'margin-bottom': '50px',
				'z-index': '1000',
				'font-size': '25px'
			})
			.text(this.model.get('point') + " Pts");

		$(this.el)
			.append(wrapper
				.append($('<form>')
					.attr({
						role: 'form'
					})
					.submit(function () {
						return false;
					})
					.append(text_input)
					.append(startButton)
					// .append(resumeButton)
					.append(pauseButton)
					.append(stopButton)
					.append(this.pointLabel)));

		var centerCss = function (widthEl) {
			widthEl = ((wrapper.width() - widthEl) / 2);
			return widthEl;
		};

		text_input.css({ left: centerCss(text_input.width()) + 'px' });
		startButton.css({ left: centerCss(text_input.width()) + 'px' });
		pauseButton.css({ left: (centerCss(text_input.width()) + 85) + 'px' });
		stopButton.css({ left: (centerCss(text_input.width()) + 170) + 'px' });
		this.pointLabel.css({ left: (centerCss(text_input.width()) + 265) + 'px' });
		// resumeButton.css({ left: (centerCss(text_input.width()) + 255) + 'px' });
		text_input.focus();

		this.listenTo(this.model, 'change', this.render);
	},

	render: function () {
		var model = this.model;
		var words = model.get('words');

		for (var i = 0; i < words.length; i++) {
			var word = words.at(i);
			if (!word.get('view')) {
				var word_view_wrapper = $('<div>');
				this.wrapper.append(word_view_wrapper);
				word.set({
					view: new WordView({
						model: word,
						el: word_view_wrapper
					})
				});
			} else {
				word.get('view').render();
			}
		}
		this.pointLabel.text(this.model.get('point') + " Pts")
	}
});

var Typer = Backbone.Model.extend({
	defaults: {
		max_num_words: 10,
		min_distance_between_words: 10,
		words: new Words(),
		min_speed: 1,
		max_speed: 5,
		animation_delay: 1,
		loop: null,
		point: 0
	},

	initialize: function () {
		new TyperView({
			model: this,
			el: $(document.body)
		});
		this.listenTo(this, 'pause', this.pause);
	},

	start: function () {
		var self = this;
		var interval = setInterval(function () {
			self.iterate();
		}, self.get('animation_delay'));
		self.set('loop', interval)

	},

	pause: function () {
		clearInterval(this.get('loop'));
	},

	stop: function () {
		clearInterval(this.get('loop'));
		var words = this.get('words');
		for (var i = words.length - 1; i >= 0; i--) {
			words.remove(words.at(i));
		}
		this.set('point', 0);
	},

	iterate: function () {
		var words = this.get('words');
		if (words.length == 5) {
			// console.log(words);
			// this.pause();
			// debugger;
		}
		if (words.length < this.get('max_num_words')) {
			var top_most_word = undefined;
			for (var i = 0; i < words.length; i++) {
				var word = words.at(i);
				if (!top_most_word) {
					top_most_word = word;
				} else if (word.get('y') < top_most_word.get('y')) {
					top_most_word = word;
				}
			}

			if (!top_most_word || top_most_word.get('y') > this.get('min_distance_between_words')) {
				var random_company_name_index = this.random_number_from_interval(0, company_names.length - 1);
				var string = company_names[random_company_name_index];
				var filtered_string = '';
				for (var j = 0; j < string.length; j++) {
					if (/^[a-zA-Z()]+$/.test(string.charAt(j))) {
						filtered_string += string.charAt(j);
					}
				}

				var word = new Word({
					x: this.random_number_from_interval(0, $(window).width()),
					y: 0,
					string: filtered_string,
					speed: (this.random_number_from_interval(this.get('min_speed'), this.get('max_speed'))) / 10
				});
				// console.log(word);
				words.add(word);
			}
		}

		var words_to_be_removed = [];
		for (var i = 0; i < words.length; i++) {
			var word = words.at(i);
			word.move();

			// 
			if (word.get('y') > $(window).height() || word.get('move_next_iteration')) {
				words_to_be_removed.push(word);
			}

			if (word.get('highlight') && word.get('string').length == word.get('highlight')) {
				word.set({ move_next_iteration: true });
			}
		}

		for (var i = 0; i < words_to_be_removed.length; i++) {
			words.remove(words_to_be_removed[i]);
		}

		this.trigger('change');
	},

	random_number_from_interval: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});