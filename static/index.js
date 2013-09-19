function ajaxify(elements, ajaxArgs, confirm) {
	elements.each(function (i, element) {
		var elementArgs = {},
			prop;

		confirm = confirm || function () { return true; };
		element = $(element);

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
