/*jslint node: true */
/*global $: true */
'use strict';

var form = $('#unit form'),
    inputs = $('input, textarea, select', form),
    fileInput = $('input[type=file]', form),
    toast = $('.toast');
inputs.change(function (e) {
 var target = $(e.target),
     form = target.parents('form');

 target.switchClass('error', 'highlight', 400);

 $.post(form.attr('action'), form.serialize(), function (data) {
     target.removeClass('highlight', 400);
 }).fail(function (e) {
     target.removeClass('highlight');
     target.toggleClass('error', false, 400).toggleClass('error', 400);
 });
});

fileInput.change(function (e) {
	var target = $(e.target),
		form = target.parents('form'),
		submit = $('input[type=submit]', form);
	submit.removeAttr('disabled')
		.removeAttr('title')
		.click(function () {
			submit.attr('value', 'Uploading...');
			return true;
		});

});

