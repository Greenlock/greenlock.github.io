(function () {

    this.page = function() { };

    page.main = function() {
        terminal.println("Hello, World!");
        terminal.setDefaultColors("white", "black", function() {});
    }

}.call(this));
