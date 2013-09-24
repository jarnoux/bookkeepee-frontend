function ajaxify(elements, ajaxArgs, confirm) {
	elements.each(function (i, element) {
		var elementArgs = {},
			prop;

		confirm = confirm || function () { return true; };
		element = $(element).css('cursor', 'pointer');

		for (prop in ajaxArgs) {
			elementArgs[prop] = ajaxArgs[prop];
		}

		elementArgs.url = element.attr('ajaxify');
		elementArgs.context = element;
		elementArgs.method = 'post';

		element.click(function (e) {
			if (confirm()) {
				$.ajax(elementArgs);
			}
		});
	});
}

// resize textareas to fit their content size
$('.textareaHelper').parent().css('position', 'relative');
$('textarea').height(function () {
	return $(this).next().height() * 1.1;
});