(function () {

    this.terminal = function() { };

    terminal.cursorLeft = 0;
    terminal.cursorTop = 0;

    terminal.foregroundColor = 0;
    terminal.backgroundColor = 0;
    terminal.defaultForegroundColor = "white";
    terminal.defaultBackgroundColor = "black";

    var nextLine = 0,

        readMode = 0,
        readCallback = null,

        lineCache = [],
        lineForegroundColors = [],
        lineBackgroundColors = [],
        lineUpdateQueue = [],

        WC_NONE = 0,
        WC_READ_LINE = 1,
        WC_READ_KEY = 2,

        keycodes = ["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""];


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
        style.html("#stdin:focus{outline:none;}");
        $("head").append(style);
    }


    function updateQueuedLines() {
        for (var queueIndex = 0; queueIndex < lineUpdateQueue.length; queueIndex++) {
            var lineNumber = lineUpdateQueue[queueIndex];
            var line = lineCache[lineNumber];

            for (var i = nextLine; i <= lineNumber; i++) {
                var lineObject = $("<span id=\"stdout-" + i.toString() + "\"></span></br>");
                $("#stdout-container").append(lineObject);
                nextLine = i + 1;
            }

            var rawHtml = "";
            var hasSpans = false;
            var currentForeground = 0;
            var currentBackground = 0;

            for (var i = 0; i < line.length; i++) {
                if (currentForeground != lineForegroundColors[lineNumber][i] ||
                        currentBackground != lineBackgroundColors[lineNumber][i]) {
                    if (hasSpans) {
                        rawHtml += "</span>";
                    }
                    hasSpans = true;
                    rawHtml += "<span style=\"";
                    if (currentForeground != lineForegroundColors[lineNumber][i]) {
                        currentForeground = lineForegroundColors[lineNumber][i];
                        if (currentForeground !== 0) {
                            rawHtml += "color:" + currentForeground + ";";
                        }
                    }
                    if (currentBackground != lineBackgroundColors[lineNumber][i]) {
                        currentBackground = lineBackgroundColors[lineNumber][i];
                        if (currentBackground !== 0) {
                            rawHtml += "background-color:" + currentBackground + ";";
                        }
                    }
                    rawHtml += "\">";
                }

                if (line.charAt(i) == " ") {
                    rawHtml += "&nbsp;";
                } else {
                    rawHtml += _.escape(line.charAt(i));
                }
            }

            if (hasSpans) {
                rawHtml += "</span>";
            }

            $("#stdout-" + lineNumber.toString()).html(rawHtml);
        }

        lineUpdateQueue = []
        terminal.lines = lineCache;
    }

    function printChar(c) {
        if (terminal.cursorLeft >= 80) terminal.cursorLeft = 79;
        if (terminal.cursorLeft < 0) terminal.cursorLeft = 0;
        if (terminal.cursorTop < 0) terminal.cursorTop = 0;

        while (lineCache.length <= terminal.cursorTop) {
            var emptyForegroundColors = [];
            var emptyBackgroundColors = [];
            for (var i = 0; i < 80; i++) {
                emptyForegroundColors.push(0);
                emptyBackgroundColors.push(0);
            }
            lineForegroundColors.push(emptyForegroundColors);
            lineBackgroundColors.push(emptyBackgroundColors);

            lineCache.push("");
        }

        var currentLine = lineCache[terminal.cursorTop];
        while (currentLine.length <= terminal.cursorLeft) {
            currentLine += " ";
        }
        lineCache[terminal.cursorTop] = currentLine.substring(0, terminal.cursorLeft) + c + currentLine.substring(terminal.cursorLeft + 1, currentLine.length);
        
        lineForegroundColors[terminal.cursorTop][terminal.cursorLeft] = terminal.foregroundColor;
        lineBackgroundColors[terminal.cursorTop][terminal.cursorLeft] = terminal.backgroundColor;

        if (!_.contains(lineUpdateQueue, terminal.cursorTop)) {
            lineUpdateQueue.push(terminal.cursorTop);
        }

        terminal.cursorLeft++;
        if (terminal.cursorLeft >= 80) {
            terminal.cursorLeft = 0;
            terminal.cursorTop++;
        }
    }

    terminal.print = function (line) {
        for (var i = 0; i < line.length; i++) {
            c = line.charAt(i);
            if (c == "\n") {
                terminal.cursorLeft = 0;
                terminal.cursorTop++;
            } else {
                printChar(c);
            }
        }

        updateQueuedLines();

        //TODO: Re-implement. Auto-scrolling to the last line is disabled for the time being.
        //tryScrollToLine(terminal.cursorTop);
        //location.href = "#";
        //location.href = "#stdout-" + terminal.cursorTop.toString();
    }

    function tryScrollToLine(line) {
        var curtop = 0;
        var obj = document.getElementById("stdout-" + line.toString());
        if (obj == null) {
            obj = document.getElementById("stdout-" + (line - 1).toString());
        }
        if (obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            window.scroll(0, curtop);
        }
    }

    terminal.printLine = function (line) {
        terminal.print(line + "\n");
    }


    terminal.clearScreen = function() {
        $("#stdout-container").html("");
        nextLine = 0;
        lineCache = [];
        lineUpdateQueue = [];
        lineForegroundColors = [];
        lineBackGroundColors = [];
        terminal.cursorLeft = 0;
        terminal.cursorTop = 0;
    }

    terminal.setDefaultForegroundColor = function(color) {
        terminal.defaultForegroundColor = color;
        $("body").css("color", color);
        $("#stdin").css("color", terminal.foregroundColor === 0 ? color : terminal.foregroundColor);
    }

    terminal.setDefaultBackgroundColor = function (color) {
        terminal.defaultBackgroundColor = color;
        $("body").css("background-color", color);
        $("#stdin").css("background-color", terminal.backgroundColor === 0 ? color : terminal.backgroundColor);
    }

    terminal.setForegroundColor = function (color) {
        terminal.foregroundColor = color;
        $("#stdin").css("color", color === 0 ? terminal.defaultForegroundColor : color);
    }

    terminal.setBackgroundColor = function (color) {
        terminal.backgroundColor = color;
        $("#stdin").css("background-color", color === 0 ? terminal.defaultBackgroundColor : color);
    }


    terminal.readLine = function(callback) {
        readMode = WC_READ_LINE;
        readCallback = callback;
        var stdinObject = $("#stdin");
        stdinObject.css("left", (terminal.cursorLeft * 9.601).toString() + "px");
        stdinObject.css("top", ((terminal.cursorTop * 18) - 1).toString() + "px");
        stdinObject.css("width", (770 - (terminal.cursorLeft * 9.601)).toString() + "px");
        stdinObject.css("visibility", "visible");
        stdinObject.focus();
    }

    terminal.readKey = function(callback) {
        readMode = WC_READ_KEY;
        readCallback = callback;
        var stdinObject = $("#stdin");
        stdinObject.css("left", (terminal.cursorLeft * 9.601).toString() + "px");
        stdinObject.css("top", ((terminal.cursorTop * 18) - 1).toString() + "px");
        stdinObject.css("width", "10px");
        stdinObject.css("visibility", "visible");
        stdinObject.focus();
    }

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