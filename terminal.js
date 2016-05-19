(function () {

    this.terminal = function() { };

    terminal.cursorLeft = 0;
    terminal.cursorTop = 0;

    var nextLine = 0,
        readMode = 0,
        readCallback = null,

        WC_NONE = 0,
        WC_READ_LINE = 1,
        WC_READ_KEY = 2;


    terminal.initialize = function () {
        var body = $("body");
        body.css("background-color", "black");
        body.css("color", "white");
        body.css("font-family", "Courier New");
        body.css("font-size", "16px");

        var container = $("<div></div>");
        container.attr("id", "container");
        container.css("position", "absolute");
        container.css("width", "770px");
        container.css("left", "20px");
        container.css("top", "20px");

        var stdoutContainer = $("<span></span>");
        stdoutContainer.attr("id", "stdout-container");

        var stdin = $("<input/>");
        stdin.attr("id", "stdin");
        stdin.attr("type", "text");
        stdin.css("position", "absolute");
        stdin.css("width", "10px");
        stdin.css("left", "0px");
        stdin.css("top", "0px");
        stdin.css("background-color", "black");
        stdin.css("color", "white");
        stdin.css("font-family", "Courier New");
        stdin.css("font-size", "16px");
        stdin.css("visibility", "hidden");
        stdin.css("border", "none");
        stdin.keydown(handleKeyDown);

        container.append(stdoutContainer);
        container.append(stdin);
        body.append(container);
    };

    terminal.printChar = function(c) {
        if (terminal.cursorLeft >= 80) terminal.cursorLeft = 79;
        if (terminal.cursorLeft < 0) terminal.cursorLeft = 0;
        if (terminal.cursorTop < 0) terminal.cursorTop = 0;

        for (var i = nextLine; i <= terminal.cursorTop; i++) {
            var lineObject = $("<span id=\"stdout-" + i.toString() + "\" class=\"stdout\"></span></br>");
            $("#stdout-container").append(lineObject);
        }
        nextLine = terminal.cursorTop + 1;

        var currentLine = _.unescape($("#stdout-" + terminal.cursorTop.toString()).html());
        var newLine = "";
        if (terminal.cursorLeft >= currentLine.length) {
            var padding = ""
            for (var i = 0; i < terminal.cursorLeft - currentLine.length; i++) padding += " ";
            newLine = currentLine + padding + c;
        } else if (terminal.cursorLeft < currentLine.length) {
            newLine = currentLine.substring(0, terminal.cursorLeft) + c + currentLine.substring(terminal.cursorLeft + 1, currentLine.length);
        }
        $("#stdout-" + terminal.cursorTop.toString()).html(_.escape(newLine));

        terminal.cursorLeft++;
        if (terminal.cursorLeft >= 80) {
            terminal.cursorLeft = 0;
            terminal.cursorTop++;
        }
    };

    terminal.print = function(line) {
        for (var i = 0; i < line.length; i++) {
            c = line.charAt(i);
            if (c == "\n") {
                terminal.cursorLeft = 0;
                terminal.cursorTop++;
            } else {
                terminal.printChar(c);
            }
        }
    };

    terminal.printLine = function(line) {
        terminal.print(line + "\n");
    };

    terminal.readLine = function(callback) {
        wcReadMode = WC_READ_LINE;
        wcReadCallback = callback;
        var stdinObject = $("#stdin");
        stdinObject.css("left", (wcCursorLeft * 9.601).toString() + "px");
        stdinObject.css("top", ((wcCursorTop * 18) - 1).toString() + "px");
        stdinObject.css("width", (770 - (wcCursorLeft * 9.601)).toString() + "px");
        stdinObject.css("visibility", "visible");
    };

    terminal.readKey = function(callback) {
        wcReadMode = WC_READ_KEY;
        wcReadCallback = callback;
        var stdinObject = $("#stdin");
        stdinObject.css("left", (wcCursorLeft * 9.601).toString() + "px");
        stdinObject.css("top", ((wcCursorTop * 18) - 1).toString() + "px");
        stdinObject.css("width", "9.6px");
        stdinObject.css("visibility", "visible");
    };

    function handleKeyDown(event) {
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

}.call(this));