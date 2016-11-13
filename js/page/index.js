(function () {

    this.page = function() { };

    page.main = function() {
        terminal.println("Hello, World!");
        terminal.setDefaultColors("black", "white", function() {});
    }

}.call(this));
