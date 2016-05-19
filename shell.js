function entrypoint() {
    terminal.initialize();

    terminal.printLine("Welcome to greenlock.co! This website is a command-line terminal.");
    terminal.printLine("Type 'help' for more information.");

    repl();
}

function repl() {
    terminal.printLine("");
    terminal.print("user />");
    terminal.readLine(function (command) {
        var args = parseCommand(command);
        if (args[0].toLowerCase() == "help") {
            terminal.printLine("This website is a very (veery) simple implementation of a Bash-esque command");
            terminal.printLine("line. There is currently no user or filesystem support. This is pretty much");
            terminal.printLine("a barebones system right now.");
            terminal.printLine("");
            terminal.printLine("As of now, available commands are:");
            terminal.printLine("echo  --  Prints a given line of text.");
        } else if (args[0].toLowerCase() == "echo") {
            var remainingArgs = argsFrom(1, args);
            var echo = "";
            for (var i = 0; i < remainingArgs.length; i++) {
                echo += (i == 0 ? "" : " ") + remainingArgs[i];
            }
            terminal.printLine(echo);
        } else {
            terminal.printLine(args[0] + " is not a known command.");
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
            if (c == "\"") {
                currentToken += "\"";
                args.push(eval(currentToken));
                isLiteral = false;
            } else if (c == "\\") {
                currentToken += "\\";
                i++;
                currentToken += command.charAt(i);
            } else {
                currentToken += c;
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
        if (currentToken.startsWith("\"")) {
            currentToken += "\"";
            args.push(eval(currentToken));
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