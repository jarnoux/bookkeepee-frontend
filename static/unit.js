/*jslint node: true */
/*global $: true */
'use strict';

var form = $('form'),
	inputs = $('input, textarea, select', form),
	fileInput = $('input[type=file]'),
	toast = $('.toast');
inputs.blur(function (e) {
	var target = $(e.target),
		form = target.parents('form');
	$.post(form.attr('ajaxAction'), form.serialize(), function (data) {
		target.switchClass('error', 'highlight', 400).removeClass('highlight', 400);
		console.log('[unit.js:9] ajax:' + 'success');
	})
		.fail(function (e) {
			console.log('[unit.js:12] ajax:' + 'error');
			target.removeClass('highlight');
			target.toggleClass('error', false, 400).toggleClass('error', 400);
		});
});

fileInput.change(function (e) {
	console.log('[unit.js:20] file upload');
});