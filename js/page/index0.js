(function () {

    this.page = function() { };

    page.main = function(parameter) {
        terminal.setDefaultForegroundColor("black");
        terminal.setDefaultBackgroundColor("white");
        terminal.setForegroundColor("violet");
        terminal.println("*This website is Certified Tasty");
    }

}.call(this));
