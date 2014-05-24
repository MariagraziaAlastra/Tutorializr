function highlightTags(text) {
	text = replaceSpecialChars(text, true);
	var tags = getHTMLTags(text);
	var highlight = [];

	for (var i = 0; i < tags.length; i++) {
		tags[i] = replaceSpecialChars(tags[i], false);
		highlight[i] = "<span class='htmltag'>" + tags[i] + "</span>";
	}

	//make sure incomplete tags are not rendered incorrectly by the browser
	text = replaceSpecialChars(text, false);
	text = plainToHighlighted(text, tags, highlight);
	return text;
}

function getHTMLTags(text) {
	var tags = [];
	var i = 0;
	var htmlregex = new RegExp("<[^><]+>", "ig");
	while (( result = htmlregex.exec(text))) {
		tags[i] = result.toString();
		i++;
	}

	return tags;
}

function replaceSpecialChars(text, isreverse) {
	if (!isreverse) {
		return text.replace(/>/g, "&gt;").replace(/</g, "&lt;");
	} else {
		return text.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
	}
}

function plainToHighlighted(text, tags, highlight) {
	var re;
	for (var i = 0; i < tags.length; i++) {
		re = new RegExp(escapeRegExp(tags[i]), "ig");
		text = text.replace(re, highlight[i]);
	}

	return text;

}

function escapeRegExp(string) {
	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
