var cur = 0;
var done = 0;
var htmlcon = "";
var csscon = "";
var initcss = "<style>";
var endcss = "</style>";
var solution = "";
var answer = "";
var previous = new Array();
var code = new Object();
var parsed;
var body;
var head;

$(document).ready(function() {

	$.ajax({
		url : "./data.json",
		dataType : "text",
		success : function(resp) {
			parsed = JSON.parse(resp);
			htmlcon = parsed.tutorial.lesson[0].html;
			csscon = parsed.tutorial.lesson[0].css;
			solution = parsed.tutorial.lesson[0].solution;
			$("h1").text(parsed.tutorial.title);
			$("title").text($("h1").text() + " · Tutorializr");
			$("textarea").val(htmlcon);
			$(".span4").append("<p>" + parsed.tutorial.lesson[0].text + "</p>");
			$(".span4").append("<pre><strong>" + parsed.tutorial.lesson[0].pre + "</strong></pre>");
			updateProgressBar();
		}
	}).fail(function() {
		alert("failed");
	});

});

$("li").bind("click", function() {
	var active = $(".active");
	var textarea = $("textarea");
	var iframe = $("iframe");

	saveEdits(active);

	if (!$(this).hasClass("active")) {
		$(this).addClass("active");
		active.removeClass("active");
		var tabtext = $(this).find("a").text();
		if (tabtext != "Preview") {
			iframe.hide();
			textarea.show();
			switch(tabtext) {
				case "HTML":
					textarea.val(htmlcon);
					break;
				case "CSS":
					textarea.val(csscon);
					break;
				default:
					break;
			}
		} else {
			textarea.hide();
			iframe.show();
			body = iframe.contents().find("body");
			head = iframe.contents().find("head").append(initcss + endcss).children("style");
			body.html(htmlcon);
			head.text(csscon);
		}
	}

});

$("#submit").bind("click", function() {
	answer = htmlcon + csscon;
	var temp = answer.split(/[ \n]+/).join("");
	if (temp == solution) {
		$("#bad, #console p").hide();
		$("#console").css("padding", "8px");
		if (done == cur && done < (parsed.tutorial.chapters)) {
			done += 1;
			updateProgressBar();
			code["html"] = htmlcon;
			code["css"] = csscon;
			previous.push(code);
		}

		if (cur < (parsed.tutorial.chapters - 1)) {
			$("#good").show();
			$("#next").removeClass("disabled");
		} else {
			$("#goodlast").show();
			$('#complete').modal("show");
		}
	} else {
		$("#good, #goodlast, #console p").hide();
		$("#console").css("padding", "8px");
		$("#bad").show();
	}
});

$("#reset").bind("click", function() {
	htmlcon = parsed.tutorial.lesson[cur].html;
	csscon = parsed.tutorial.lesson[cur].css;
	switch ($(".active").find("a").text()) {
		case "HTML":
			$("textarea").val(htmlcon);
			break;
		case "CSS":
			$("textarea").val(csscon);
			break;
		default:
			break;
	}
});

$("#next, #nextlink").bind("click", function() {
	cur += 1;
	if (cur == done) {
		$("#next").addClass("disabled");
	}
	$("#prev").removeClass("disabled");
	setCurrentLesson();
});

$("#prev").bind("click", function() {
	cur -= 1;
	if (cur == 0) {
		$(this).addClass("disabled");
	}
	$("#next").removeClass("disabled");
	setCurrentLesson();
});

$("textarea").bind("blur", function() {
	saveEdits($(".active"));
});

function saveEdits(prev) {
	var text = prev.find("a").text();
	if (text == "HTML")
		htmlcon = $("textarea").val();
	else if (text == "CSS")
		csscon = $("textarea").val();
}

function setCurrentLesson() {
	$("#good, #bad").hide();
	$("#console p").show();
	$("#console").css("padding", "12px");
	if (cur < done) {
		htmlcon = previous[cur].html;
		csscon = previous[cur].css;
	} else {
		htmlcon = parsed.tutorial.lesson[cur].html;
		csscon = parsed.tutorial.lesson[cur].css;
	}
	solution = parsed.tutorial.lesson[cur].solution;
	$(".active").removeClass("active");
	$("ul li:first-child").addClass("active");
	$("h1").text(parsed.tutorial.title);
	$("textarea").val(htmlcon);
	$(".span4 p:gt(0), .span4 pre").remove();
	$(".span4").append("<p>" + parsed.tutorial.lesson[cur].text + "</p>");
	$(".span4").append("<pre><strong>" + parsed.tutorial.lesson[cur].pre + "</strong></pre>");
}

function updateProgressBar() {
	var percent = (done * 100) / parsed.tutorial.chapters;
	$(".bar").css("width", percent + "%");
	$(".span4 p:first-child").text(done + "/" + parsed.tutorial.chapters + "Complete").css("font-weight", "bold");
}
