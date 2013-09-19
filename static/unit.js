/*jslint node: true */
/*global $: true, confirm: true, ajaxify: true */
'use strict';

var ajaxForm = $('form.ajaxInputs'),
	ajaxInputs = $('input, textarea, select', ajaxForm),
	fileForm = $('form.fileInputs'),
	fileInput = $('input[type=file]', fileForm),
	toast = $('.toast'),
	visitForm = $('#visitForm'),
	visitsAccordion = $('#visitsAccordion'),
	saveVisitActionIcons = $('.saveVisit'),
	cancelVisitActionIcons = $('.cancelVisit'),
	makePrettyDatepickers = function (elements) {
		elements.datepicker({
			prevText: '<i class="icon-chevron-left"></i>',
			nextText: '<i class="icon-chevron-right"></i>',
			minDate: new Date()
		}).click(function () {
			$('.ui-datepicker-next, .ui-datepicker-prev').attr('title', '');
		});
	};

ajaxInputs.change(function (e) {
	var target = $(e.target),
		form = target.parents('form');

	target.switchClass('error', 'highlight', 200);

	$.post(form.attr('action'), form.serialize(), function (data) {
		target.removeClass('highlight', 200);
	}).fail(function (e) {
		target.removeClass('highlight');
		target.toggleClass('error', false, 200).toggleClass('error', 200);
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
makePrettyDatepickers($('.datepickered'));

$(cancelVisitActionIcons).add('.editVisit button').click(function (e) {
	var target = $(e.target),
		form = target.parents('form');
	if (confirm('This will send a notification to all the respondents.')) {
		form.submit();
	} else {
		e.preventDefault();
	}
});
cancelVisitActionIcons.click(function (e) {
	e.stopPropagation();
});
$('.editVisit').click(function (e) {
	var target = $(e.target),
		header = target.parents('.ui-accordion-header');
	if (header.hasClass('ui-state-active')) {
		e.stopPropagation();
	}
	$(this).toggleClass('active');
	$('#' + $(e.target).attr('showForm')).toggle();
});

visitsAccordion.accordion({
	active: false,
	collapsible: true
});
$('.ui-accordion-header', visitsAccordion).on({
	'mouseover': function (e) {
		$('i', this).show();
	},
	'mouseout': function (e) {
		$('i', this).hide();
	}
});

ajaxify($('.deletePhoto'), function () {
	alert('success!!');
});
