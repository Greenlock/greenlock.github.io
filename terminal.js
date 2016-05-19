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

    var keycodes = ["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""];


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

        var style = $("<style></style>");
        style.html("#stdin:focus { outline: none; }");
        $("head").append(style);
    };

    function printChar(c) {
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
                printChar(c);
            }
        }

        location.href = "#";
        location.href = "#stdout-" + terminal.cursorTop.toString();
    };

    terminal.printLine = function(line) {
        terminal.print(line + "\n");
    };

    terminal.clearScreen = function() {
        $("#stdout-container").html("");
    };

    terminal.readLine = function(callback) {
        readMode = WC_READ_LINE;
        readCallback = callback;
        var stdinObject = $("#stdin");
        stdinObject.css("left", (terminal.cursorLeft * 9.601).toString() + "px");
        stdinObject.css("top", ((terminal.cursorTop * 18) - 1).toString() + "px");
        stdinObject.css("width", (770 - (terminal.cursorLeft * 9.601)).toString() + "px");
        stdinObject.css("visibility", "visible");
        stdinObject.focus();
    };

    terminal.readKey = function(callback) {
        readMode = WC_READ_KEY;
        readCallback = callback;
        var stdinObject = $("#stdin");
        stdinObject.css("left", (terminal.cursorLeft * 9.601).toString() + "px");
        stdinObject.css("top", ((terminal.cursorTop * 18) - 1).toString() + "px");
        stdinObject.css("width", "10px");
        stdinObject.css("visibility", "visible");
        stdinObject.focus();
    };

    function handleKeyDown(event) {
	    if (readMode == WC_READ_LINE && event.keyCode == 13) {
	        inputValue = _.unescape($("#stdin").val());
	        readMode = WC_NONE;
	        $("#stdin").val("");
	        $("#stdin").css("visibility", "hidden");
	        terminal.printLine(inputValue);
		    if (readCallback != null) {
		        readCallback(inputValue);
			    readCallback = null;
		    }
		    return false;
	    } else if (readMode == WC_READ_KEY) {
	        readMode = WC_NONE;
	        $("#stdin").val("");
	        $("#stdin").css("visibility", "hidden");
	        terminal.print(keycodes[event.keyCode].length > 1 ? "^" : keycodes[event.keyCode]);
	        if (readCallback != null) {
	            readCallback(event.keyCode);
	            readCallback = null;
	        }
	        return false;
	    } else {
		    return true;
	    }
    }

}.call(this));