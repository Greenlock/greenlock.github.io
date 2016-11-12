(function() {

    this.filesystem = function () { };


    var devices = [];


    filesystem.mountStatic = function (url, mount, callback) {
        $.getJSON(url.endsWith("/") ? url + "device.json" : url + "/device.json", function(data) {
            devices.push({
                type: "static", 
                url: (url.endsWith("/") ? url.slice(0, -1) : url),
                mount: (mount.endsWith("/") ? mount.slice(0, -1) : mount),
                entries: data });
            setTimeout(callback, 0);
        });
    }

    filesystem.getDirectories = function (dir) {
        var d = dir.endsWith("/") ? dir.slice(0, -1) : dir;

        var dev = null;
        for (var i = 0; i < devices.length; i++) {
            if (d.startsWith(devices[i].mount)) {
                if (dev == null) {
                    dev = devices[i];
                } else {
                    if (dev.mount.length < devices[i].mount.length) {
                        dev = device;
                    }
                }
            }
        }
        if (dev == null) throw "GLFSFileError: The given directory cannot be found on any mounted device.";

        var results = [];
        for (var i = 0; i < dev.entries.length; i++) {
            var combinedPath = dev.mount + dev.entries[i];
            if (combinedPath.indexOf(d) > -1) {
                var reducedPath = combinedPath.substring(d.length + 1);
                if (reducedPath.indexOf("/") > -1 && results.indexOf(reducedPath.split("/")[0]) < 0) {
                    results.push(reducedPath.split("/")[0]);
                }
            }
        }

        return results;
    }

    filesystem.getFiles = function (dir) {
        var d = dir.endsWith("/") ? dir.slice(0, -1) : dir;

        var dev = null;
        for (var i = 0; i < devices.length; i++) {
            if (d.startsWith(devices[i].mount)) {
                if (dev == null) {
                    dev = devices[i];
                } else {
                    if (dev.mount.length < devices[i].mount.length) {
                        dev = device;
                    }
                }
            }
        }
        if (dev == null) throw "GLFSFileError: The given directory cannot be found on any mounted device.";

        var results = [];
        for (var i = 0; i < dev.entries.length; i++) {
            var combinedPath = dev.mount + dev.entries[i];
            if (combinedPath.indexOf(d) > -1) {
                var reducedPath = combinedPath.substring(d.length + 1);
                if (reducedPath.indexOf("/") < 0) {
                    results.push(reducedPath);
                }
            }
        }

        return results;
    }

    filesystem.readFile = function (filename, callback) {
        for (var i = 0; i < devices.length; i++) {
            if (filename.startsWith(devices[i].mount)) {
                for (var e = 0; e < devices[i].entries.length; e++) {
                    if (devices[i].mount + devices[i].entries[e] == filename) {
                        $.get(devices[i].url + "/devroot" + devices[i].entries[e], function (data) {
                            callback(data);
                        });
                        return;
                    }
                }
            }
        }
        throw "GLFSFileError: File not found on any mounted device!";
    }

}.call(this));