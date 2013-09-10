/*jslint node: true */
/*global $: true */
'use strict';

var ajaxForm = $('form.ajaxInputs'),
    ajaxInputs = $('input, textarea, select', ajaxForm),
    fileForm = $('form.fileInputs'),
    fileInput = $('input[type=file]', fileForm),
    toast = $('.toast'),
    visitForm = $('#visitForm'),
    newVisitActionIcon = $('#newVisit');

ajaxInputs.change(function (e) {
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
			submit.attr('value', 'Uploading...').addClass('pure-button-disabled');
			return true;
		});
});

$('#visitDate').datepicker({
	prevText: '<i class="icon-chevron-left"></i>',
	nextText: '<i class="icon-chevron-right"></i>',
	minDate: new Date(),
	onSelect: function (dateText, datePicker) {
		newVisitActionIcon.show();
	}
}).click(function () {
	$('.ui-datepicker-next, .ui-datepicker-prev').attr('title', '');
});
