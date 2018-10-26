
var modal = {

	$html: $('html'),
	$body: $('body'),

	$container: $('.sc-modal__container'),
	$element: $('.sc-modal'),

	$trigger: $('[open-modal]'),
	$closeModal: $('[close-modal]'),

	init: function() {

		var self = this;

		self.$trigger.on('click', function (e) {
			e.preventDefault();
			self.show_modal($(this));
		});

		self.$closeModal.on('click', function (e) {
			e.preventDefault();
			self.hide_modal();
		});

		$(document).on('keydown', function (e) {
			if ( e.keyCode === 27 ) {
				self.hide_modal();
			}
		});

	},

	show_modal: function(sc_trigger) {

		var self = this,
			modal_id = $(sc_trigger).data('modal');

		$('#' + modal_id).addClass('open');
		$('.sc-modal__inner').animate({ scrollTop: 0 }, 0);
		$.merge(self.$html, self.$body).addClass('no-scroll');

	},

	hide_modal: function() {

		var self = this;

		self.$container.removeClass('open');
		$.merge(self.$html, self.$body).removeClass('no-scroll');

	}

};

if(modal.$element.length){
    modal.init();
}