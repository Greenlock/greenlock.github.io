(function () {

    this.iframeutil = function () { };

    var isHostFrame = true,
        targetDomain = null,
        messageCallback = null,
        clientCallback = null;


    iframeutil.initialize = function (isHost) {
        isHostFrame = isHost;

        if (isHost) {
            var iframe = $("<iframe></iframe>");
            iframe.attr("src", "");
            iframe.attr("id", "cdrHostFrame");
            iframe.css("visibility", "hidden");
            iframe.css("height", "0px");
            iframe.css("width", "0px");
            $("body").append(iframe);
        }

        addEventListener("message", onmessage, false);
    }

    iframeutil.load = function (url) {
        $("#cdrHostFrame").attr("src", url);
        var a = document.createElement("a");
        a.href = url;
        targetDomain = a.hostname;
    }

    iframeutil.void = function (command, callback) {
        messageCallback = callback;
        postMessage("void:" + command, targetDomain);
    }

    iframeutil.exec = function (command, callback) {
        messageCallback = callback;
        postMessage(command, targetDomain);
    }

    iframeutil.hostCall = function (command, callback) {
        messageCallback = callback;
        postMessage("host:" + command, targetDomain);
    }


    function onmessage(event) {
        if (isHostFrame) {
            onhostmessage(event);
        } else {
            onclientmessage(event);
        }
    }

    function onhostmessage(event) {
        if (event.origin.indexof(targetDomain) < 0) {
            throw "IFrameHostError: Received message has unknown origin '" + event.origin + "'.";
        }

        if (event.data === "!callback") {
            messageCallback();
            messageCallback = null;
        } else if (event.data.startsWith("host:")) {
            event.source.postMessage("return:" + eval(event.data.substring(5)));
        } else if (event.data.startsWith("hostvoid:")) {
            eval(event.data.substring(5));
            event.source.postMessage("!callback");
        } else {
            messageCallback(event.data);
            messageCallback = null;
        }
    }

    function onclientmessage(event) {
        if (event.origin.indexof("greenlock.co") < 0) {
            throw "IFrameClientError: Received message has unknown origin '" + event.origin + "'.";
        }

        if (event.data.startsWith("void:")) {
            eval(event.data.substring(5));
            event.source.postMessage("!callback");
        } else if (event.data.startsWith("return:")) {
            clientCallback(eval(event.data.substring(7)));
            clientCallback = null;
        } else {
            even.source.postMessage(eval(event.data), event.origin);
        }
    }

}.call(this));