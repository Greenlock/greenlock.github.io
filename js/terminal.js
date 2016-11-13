(function () {

    this.terminal = function() { };

    var readMode = 0,
        readCallback = null,

        foregroundColor = "white",
        backgroundColor = "black",
        defaultForegroundColor = "white",
        defaultBackgroundColor = "black",

        WC_NONE = 0,
        WC_READ_LINE = 1,
        WC_READ_KEY = 2,

        keycodes = ["", "", "", "CANCEL", "", "", "HELP", "", "BACK_SPACE", "TAB", "", "", "CLEAR", "ENTER", "ENTER_SPECIAL", "", "SHIFT", "CONTROL", "ALT", "PAUSE", "CAPS_LOCK", "KANA", "EISU", "JUNJA", "FINAL", "HANJA", "", "ESCAPE", "CONVERT", "NONCONVERT", "ACCEPT", "MODECHANGE", "SPACE", "PAGE_UP", "PAGE_DOWN", "END", "HOME", "LEFT", "UP", "RIGHT", "DOWN", "SELECT", "PRINT", "EXECUTE", "PRINTSCREEN", "INSERT", "DELETE", "", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "COLON", "SEMICOLON", "LESS_THAN", "EQUALS", "GREATER_THAN", "QUESTION_MARK", "AT", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "OS_KEY", "", "CONTEXT_MENU", "", "SLEEP", "NUMPAD0", "NUMPAD1", "NUMPAD2", "NUMPAD3", "NUMPAD4", "NUMPAD5", "NUMPAD6", "NUMPAD7", "NUMPAD8", "NUMPAD9", "MULTIPLY", "ADD", "SEPARATOR", "SUBTRACT", "DECIMAL", "DIVIDE", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24", "", "", "", "", "", "", "", "", "NUM_LOCK", "SCROLL_LOCK", "WIN_OEM_FJ_JISHO", "WIN_OEM_FJ_MASSHOU", "WIN_OEM_FJ_TOUROKU", "WIN_OEM_FJ_LOYA", "WIN_OEM_FJ_ROYA", "", "", "", "", "", "", "", "", "", "CIRCUMFLEX", "EXCLAMATION", "DOUBLE_QUOTE", "HASH", "DOLLAR", "PERCENT", "AMPERSAND", "UNDERSCORE", "OPEN_PAREN", "CLOSE_PAREN", "ASTERISK", "PLUS", "PIPE", "HYPHEN_MINUS", "OPEN_CURLY_BRACKET", "CLOSE_CURLY_BRACKET", "TILDE", "", "", "", "", "VOLUME_MUTE", "VOLUME_DOWN", "VOLUME_UP", "", "", "SEMICOLON", "EQUALS", "COMMA", "MINUS", "PERIOD", "SLASH", "BACK_QUOTE", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "OPEN_BRACKET", "BACK_SLASH", "CLOSE_BRACKET", "QUOTE", "", "META", "ALTGR", "", "WIN_ICO_HELP", "WIN_ICO_00", "", "WIN_ICO_CLEAR", "", "", "WIN_OEM_RESET", "WIN_OEM_JUMP", "WIN_OEM_PA1", "WIN_OEM_PA2", "WIN_OEM_PA3", "WIN_OEM_WSCTRL", "WIN_OEM_CUSEL", "WIN_OEM_ATTN", "WIN_OEM_FINISH", "WIN_OEM_COPY", "WIN_OEM_AUTO", "WIN_OEM_ENLW", "WIN_OEM_BACKTAB", "ATTN", "CRSEL", "EXSEL", "EREOF", "PLAY", "ZOOM", "", "PA1", "WIN_OEM_CLEAR", ""];

    terminal.print = function(line) {
        var spanHtml = "<span style=\"";
        if (foregroundColor != defaultForegroundColor) {
            spanHtml += "color:" + foregroundColor + ";";
        }
        if (backgroundColor != defaultBackgroundColor) {
            spanHtml += "background-color:" + backgroundColor;
        }
        spanHtml += "\"></span>";
        var spanObject = $(spanHtml);
        var splitLine = line.split("\n");
        for (var i = 0; i < splitLine.length; i++) {
            if (i > 0) {
                spanObject.append("<br>")
            }
            spanObject.append(_.escape(splitLine[i]).replace(" ", "&nbsp;"));
        }
        $("#content-container").append(spanObject);
    }

    terminal.println = function(line) {
        terminal.print(line + "\n");
    }

    terminal.printhtml = function(line) {
        var spanHtml = "<span style=\"";
        if (foregroundColor != defaultForegroundColor) {
            spanHtml += "color:" + foregroundColor + ";";
        }
        if (backgroundColor != defaultBackgroundColor) {
            spanHtml += "background-color:" + backgroundColor;
        }
        spanHtml += "\"></span>";
        var spanObject = $(spanHtml);
        spanObject.append(line);
        $("#content-container").append(spanObject);
    }

    terminal.printlink = function(line, href) {
        var spanHtml = "<span style=\"";
        if (foregroundColor != defaultForegroundColor) {
            spanHtml += "color:" + foregroundColor + ";";
        }
        if (backgroundColor != defaultBackgroundColor) {
            spanHtml += "background-color:" + backgroundColor;
        }
        spanHtml += "\"></span>";
        var spanObject = $(spanHtml);
        var hrefObject = $("<a></a>");
        hrefObject.attr("href", href);
        hrefObject.append(line.replace("\n", "").replace(" ", "&nbsp;"));
        spanObject.append(hrefObject);
        $("#content-container").append(spanObject);
    }

    terminal.clearScreen = function() {
        $("#content-container").html("");
    }

    terminal.setDefaultForegroundColor = function(color, callback) {
        $("#transition-container").fadeOut(function() {
            $("#transition-container").css("color", color);
            $("#stdin").css("color", foregroundColor == defaultForegroundColor ? color : foregroundColor);
            defaultForegroundColor = color;
            $("#transition-container").fadeIn(400, function() { callback(); });
        });
    }

    terminal.setDefaultBackgroundColor = function(color, callback) {
        $("#transition-back").css("background-color", color);
        $("#transition-container").fadeOut(400, function() {
            $("#transition-container").css("background-color", color);
            $("#stdin").css("background-color", backgroundColor == defaultBackgroundColor ? color : backgroundColor);
            defaultBackgroundColor = color;
            $("#transition-container").fadeIn(400, function() { callback(); });
        });
    }

    terminal.setDefaultColors = function(fore, back, callback) {
        $("#transition-back").css("background-color", back);
        $("#transition-container").fadeOut(400, function() {
            $("#transition-container").css("background-color", back);
            $("#stdin").css("background-color", backgroundColor == defaultBackgroundColor ? back : backgroundColor);
            defaultBackgroundColor = back;
            $("#transition-container").css("color", fore);
            $("#stdin").css("color", foregroundColor == defaultForegroundColor ? fore : foregroundColor);
            defaultForegroundColor = fore;
            $("#transition-container").fadeIn(400, function() { callback(); });
        });
    }

    terminal.setForegroundColor = function(color) {
        $("#stdin").css("color", color == defaultForegroundColor ? defaultForegroundColor : color);
        foregroundColor = color;
    }

    terminal.setBackgroundColor = function(color) {
        $("#stdin").css("background-color", color == defaultBackgroundColor ? defaultBackgroundColor : color);
        backgroundColor = color;
    }

    terminal.resetForegroundColor = function() {
        terminal.setForegroundColor(defaultForegroundColor);
    }

    terminal.resetBackgroundColor = function() {
        terminal.setBackgroundColor(defaultBackgroundColor);
    }

    terminal.readln = function(callback) {
        readMode = WC_READ_LINE;
        readCallback = callback;
        $("#stdin").css("visibility", "visible");
        $("#stdin").keydown(handleKeyDown);
        $("#stdin").focus();
    }

    terminal.readkey = function(callback) {
        readMode = WC_READ_KEY;
        readCallback = callback;
        $("#stdin").css("visibility", "visible");
        $("#stdin").keydown(handleKeyDown);
        $("#stdin").focus();
    }

    function handleKeyDown(event) {
	    if (readMode == WC_READ_LINE && event.keyCode == 13) {
	        inputValue = _.unescape($("#stdin").val());
	        readMode = WC_NONE;
	        $("#stdin").val("");
	        $("#stdin").css("visibility", "hidden");
	        terminal.println(inputValue);
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
