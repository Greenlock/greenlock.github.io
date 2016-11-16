(function () {

    this.basepage = function() { };

    basepage.main = function() {
        terminal.initialize();

        var path = getParameterByName("r") != null ? getParameterByName("r") : "index.js";
        var parameter = getParameterByName("p");

        loadpage(path, parameter);

        shell.main();
    }

    basepage.loadpage = function(pageName, parameter) {
        terminal.clearScreen();
        $.getScript("https://www.greenlock.co/js/page/" + pageName + ".js")
            .done(function( script, textStatus ) {
                page.main(parameter);
            })
            .fail(function( jqxhr, settings, exception ) {
                terminal.setForegroundColor("lightred");
                terminal.println("Invalid redirect '" + pageName + "'!");
                terminal.resetForegroundColor();
            });
    }

    function getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

}.call(this));
