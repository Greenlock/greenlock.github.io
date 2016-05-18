var wcCursorLeft = 0;
var wcCursorTop = 0;
var wcNextLine = 0;
var wcReadMode = 0;
var wcReadCallback = null;

var WC_NONE = 0;
var WC_READ_LINE = 1;
var WC_READ_KEY = 2;

function wcInitialize() {
	$("#stdin").keydown(wcHandleKeyDown);
}

function wcPrintCharacter(c) {
	if (wcCursorLeft >= 80) wcCursorLeft = 79;
	if (wcCursorLeft < 0) wcCursorLeft = 0;
	if (wcCursorTop < 0) wcCursorTop = 0;
	
	for (i = wcNextLine; i <= wcCursorTop; i++) {
		var lineObject = $("<span id=\"stdout-" + i.toString() + "\" class=\"stdout\"></span></br>");	
		$("#stdout-container").append(lineObject);
	}
	wcNextLine = wcCursorTop + 1;

	var currentLine = _.unescape($("#stdout-" + wcCursorTop.toString()).html());
	var newLine = "";
	if (wcCursorLeft >= currentLine.length) {
		var padding = ""
		for (i = 0; i < wcCursorLeft - currentLine.length; i++) padding += " ";
		newLine = currentLine + padding + c;
	} else if (wcCursorLeft < currentLine.length) {
		newLine = currentLine.substring(0, wcCursorLeft) + c + currentLine.substring(wcCursorLeft + 1, currentLine.length);
	}
	$("#stdout-" + wcCursorTop.toString()).html(_.escape(newLine));
	
	wcCursorLeft += 1;
	if (wcCursorLeft >= 80) {
		wcCursorLeft = 0;
		wcCursorTop++;
	}
}

function wcPrint(line) {
    for (i = 0; i < line.length; i++) {
        c = line.substring(i, i + 1);
        if (c == "\n") {
            wcCursorLeft = 0;
            wcCursorTop++;
        } else {
            wcPrintCharacter(c);
        }
    }
}

function wcPrintLine(line) {
    wcPrint(line + "\n");
}

function wcReadLine(callback) {
	wcReadMode = WC_READ_LINE;
	wcReadCallback = callback;
	var stdinObject = $("#stdin");
	stdinObject.css("left", (wcCursorLeft * 9.601).toString() + "px");
	stdinObject.css("top", ((wcCursorTop * 18) - 1).toString() + "px");
	stdinObject.css("width", (770 - (wcCursorLeft * 9.601)).toString() + "px");
	stdinObject.css("visibility", "visible");
}

function wcReadKey(callback) {
	wcReadMode = WC_READ_KEY;
	wcReadCallback = callback;
	var stdinObject = $("#stdin");
	stdinObject.css("left", (wcCursorLeft * 9.601).toString() + "px");
	stdinObject.css("top", ((wcCursorTop * 18) - 1).toString() + "px");
	stdinObject.css("width", "9.6px");
	stdinObject.css("visibility", "visible");
}

function wcHandleKeyDown(event) {
	if (wcReadMode == WC_READ_LINE && event.keyCode == 13) {
	    intputValue = _.unescape($("#stdin").val());
	    wcReadMode = WC_NONE;
	    $("#stdin").val("");
	    $("#stdin").css("visibility", "hidden");
	    wcCursorLeft = 0;
	    wcCursorTop++;
		if (wcReadCallback != null) {
		    wcReadCallback(intputValue);
			wcReadCallback = null;
		}
		return false;
	} else if (wcReadMode == WC_READ_KEY) {
	    wcReadMode = WC_NONE;
	    $("#stdin").val("");
	    $("#stdin").css("visibility", "hidden");
	    wcCursorLeft = 0;
	    wcCursorTop++;
	    if (wcReadCallback != null) {
	        wcReadCallback(event.keyCode);
	        wcReadCallback = null;
	    }
	    return false;
	} else {
		return true;
	}
}