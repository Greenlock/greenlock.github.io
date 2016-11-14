(function () {

    this.shell = function() { };

    shell.main = function () {
        terminal.resetForegroundColor();
        shell.repl();
    }

    function repl() {
        var cd = localStorage.getItem("cd");
        terminal.print("\n[web " + (cd === false ? "/" : cd + "]$ ");
        terminal.readln(function (command) {
            var args = parseCommand(command);
            if (args.length > 0) {
                if (args[0].toLowerCase() == "help") {
                    terminal.println("This website is a Bash-esque command line terminal.");
                    terminal.println("Available commands: help, echo, cls, clear, color");
                } else if (args[0].toLowerCase() == "echo") {
                    if (args.length < 2) {
                        terminal.setForegroundColor("red");
                        terminal.println("Not enough arguments.");
                        terminal.resetForegroundColor();
                    } else {
                        var remainingArgs = argsFrom(1, args);
                        var echo = "";
                        for (var i = 0; i < remainingArgs.length; i++) {
                            echo += (i == 0 ? "" : " ") + remainingArgs[i];
                        }
                        terminal.printLine(echo);
                    }
                } else if (args[0].toLowerCase() == "cls" || args[0].toLowerCase() == "clear") {
                    terminal.clearScreen();
                } else if (args[0].toLowerCase() == "color") {
                    if (args.length < 2) {
                        terminal.setForegroundColor("red");
                        terminal.println("Not enough arguments.");
                        terminal.println("Usage: 'color <text color> <background color>'");
                        terminal.resetForegroundColor();
                    } else if (args.length < 3) {
                        terminal.setDefaultForegroundColor(args[1]);
                    } else {
                        if (args[1] != "-") terminal.setDefaultForegroundColor(args[1]);
                        terminal.setDefaultBackgroundColor(args[2]);
                    }
                } else if (args[0].toLowerCase() == "echo") {
                } else {
                    terminal.printLine(args[0] + " is not a known command.");
                }
            }
            setTimeout(repl, 0);
        });
    }

    function parseCommand(command) {
        var args = [];
        var currentToken = "";
        var isLiteral = false;
        for (var i = 0; i < command.length; i++) {
            var c = command.charAt(i);
            if (isLiteral) {
                currentToken += c;
                if (c == "\"") {
                    args.push(JSON.parse(currentToken));
                    currentToken = "";
                    isLiteral = false;
                } else if (c == "\\") {
                    currentToken += command.charAt(++i);
                }
            } else {
                if (c == "\"") {
                    if (currentToken.length > 0) {
                        args.push(currentToken);
                        currentToken = "";
                    }
                    currentToken += "\"";
                    isLiteral = true;
                } else if (c == " " || c == "\t") {
                    if (currentToken.length > 0) {
                        args.push(currentToken);
                        currentToken = "";
                    }
                } else {
                    currentToken += c;
                }
            }
        }
        if (currentToken.length > 0) {
            if (isLiteral) {
                currentToken += "\"";
                args.push(JSON.parse(currentToken));
            } else {
                args.push(currentToken);
            }
        }
        return args;
    }

    function argsFrom(index, args) {
        var returnList = [];
        for (var i = index; i < args.length; i++) {
            returnList.push(args[i]);
        }
        return returnList;
    }

}.call(this));
