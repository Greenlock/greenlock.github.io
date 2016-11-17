(function () {

    this.shell = function() {};

    shell.main = function() {
        terminal.resetForegroundColor();
        terminal.pintln("[REPL]");
        return;
        shell.repl();
    }

    function repl() {
        terminal.print("\n[web " + cd + "]$ ");
        terminal.readln(function (command) {
            var args = parseCommand(command);
            if (args.length > 0) {
                if (commands.hasOwnProperty(args[0])) {
                    commands[args[0]](argsFrom(1, args));
                } else {
                    if (args[0] == "/") {
                        terminal.printLine("'" + args[0] + "' is a directory.");
                    } else {
                        var segments = args[0].toLowerCase().substring(1).split("/");
                        var dirObject = filesystem;
                        for (var i = 0; i < segments.length; i++) {
                            if (i < segments.length - 1) {
                                if (segments[i] in dirObject) {
                                    dirObject = dirObject[segments[i]];
                                } else {
                                    terminal.setForegroundColor("red");
                                    terminal.printLine("'" + args[0] + "' is not a valid path.");
                                    terminal.resetForegroundColor();
                                    setTimeout(repl, 0);
                                    return;
                                }
                            } else {
                                if (segments[i] in dirObject && typeof dirObject[segments[i]] === "string") {
                                    window.location.href = dirObject[segments[i]];
                                    return;
                                } else {
                                    terminal.setForegroundColor("red");
                                    terminal.printLine("'" + args[0] + "' is not a valid filename.");
                                    terminal.resetForegroundColor();
                                    setTimeout(repl, 0);
                                    return;
                                }
                            }
                        }
                        terminal.setForegroundColor("red");
                        terminal.printLine("'" + args[0] + "' is not a valid path.");
                        terminal.resetForegroundColor();
                    }
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


    var commands = function() {};

    commands.help = function(args) {
        terminal.println("This website is a simplistic shell terminal populated with some common Bash commands.");
        terminal.println("Built-in commands: help, echo, clear, color, dcolor, cd");
    }

    commands.echo = function(args) {
        if (args.length < 2) {
            terminal.setForegroundColor("red");
            terminal.println("You must specify text to be echoed.");
            terminal.resetForegroundColor();
        } else {
            var echo = "";
            for (var i = 0; i < args.length; i++) {
                echo += (i == 0 ? "" : " ") + args[i];
            }
            terminal.printLine(echo);
        }
    }

    commands.clear = function(args) {
        terminal.clearScreen();
    }

    commands.color = function(args) {
        if (args.length < 1) {
            terminal.setForegroundColor("red");
            terminal.println("Not enough arguments.");
            terminal.println("Usage: 'color [text color|-] (background color)'");
            terminal.resetForegroundColor();
        } else if (args.length < 2) {
            if (args[0] != "-") terminal.setDefaultForegroundColor(args[0]);
        } else {
            if (args[0] != "-") terminal.setDefaultForegroundColor(args[0]);
            if (args[1] != "-") terminal.setDefaultBackgroundColor(args[1]);
        }
    }

    commands.icolor = function(args) {
        if (args.length < 1) {
            terminal.setForegroundColor("red");
            terminal.println("Not enough arguments.");
            terminal.println("Usage: 'color [text color|-] (background color)'");
            terminal.resetForegroundColor();
        } else if (args.length < 2) {
            if (args[0] != "-") terminal.setForegroundColor(args[0]);
        } else {
            if (args[0] != "-") terminal.setForegroundColor(args[0]);
            if (args[1] != "-") terminal.setBackgroundColor(args[1]);
        }
    }

    commands.cd = function(args) {

    }


    var filesystem = function() {};

    filesystem = {
        "index.html": "www.greenlock.co/p/index.html"
    }

}.call(this));
