(function () {

    this.basepage = function() { };

    basepage.main = function() {
        terminal.initialize();

        var path = getParameterByName("r") != null ? getParameterByName("r") : "index.js";
        path = path.endsWith(".js") ? path : path + ".js";
        var parameter = getParameterByName("p");

        basepage.loadPage(path, parameter);

        shell.main();
    }

    basepage.loadPage = function(pageName, parameter) {
        terminal.clearScreen();
        $.getScript("/js/page/" + pageName)
            .done(function( script, textStatus ) {
                history.pushState({},"Greenlock.co","/?r=" + encodeURI(pageName));
                page.main(parameter);
            })
            .fail(function( jqxhr, settings, exception ) {
                terminal.setForegroundColor("red");
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
