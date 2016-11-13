(function () {

    this.shell = function() { };


    var users = {},
        currentUser = null,
        userToken = null;


    shell.altmain = function () {
        terminal.print("I am test.\nHola>");
        terminal.readLn(function (command) { terminal.setDefaultColors("black", "white", function() {}); });
    }

    shell.main = function () {
        terminal.initialize();
        iframeutil.initialize(true);

        terminal.setForegroundColor("#00AA00");
        terminal.print("Greenlock.co");
        terminal.resetForegroundColor();
        terminal.print(" // ");
        terminal.setForegroundColor("#88FF88");
        terminal.printLine("Home of the Greenest of Beans");
        terminal.resetForegroundColor();

        filesystem.mountStatic("https://www.greenlock.co/staticfs", "/", function() {
            console.log(filesystem.getFiles("/sys/"));
            filesystem.readFile("/hello.txt", function (data) {
                console.log(data);
            });
        });
    }

    function login() {
        terminal.printLine("");
        terminal.printLine("Enter your username if you have one, otherwise just make something up.");
        terminal.print("username>");
    }

    function repl() {
        terminal.printLine("");
        terminal.print("user />");
        terminal.readLine(function (command) {
            var args = parseCommand(command);
            if (args.length > 0) {
                if (args[0].toLowerCase() == "help") {
                    terminal.printLine("This website is a very (veery) simple implementation of a Bash-esque");
                    terminal.printLine("command line. There is currently no user or filesystem support. This is");
                    terminal.printLine("pretty much a barebones system right now.");
                    terminal.printLine("");
                    terminal.printLine("As of now, available commands are:");
                    terminal.printLine("echo  --  Prints a given line of text.");
                    terminal.printLine("cls|clear  --  Clears all previous output.");
                    terminal.printLine("color  --  Changes text and background colors.");
                } else if (args[0].toLowerCase() == "echo") {
                    if (args.length < 2) {
                        terminal.printLine("Not enough arguments. Use me like this: 'echo <some text>'");
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
                        terminal.printLine("Not enough arguments. Use me like this: 'color <text color> <background color>'");
                    } else if (args.length < 3) {
                        terminal.setDefaultForegroundColor(args[1]);
                    } else {
                        if (args[1] != "-") terminal.setDefaultForegroundColor(args[1]);
                        terminal.setDefaultBackgroundColor(args[2]);
                    }
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
