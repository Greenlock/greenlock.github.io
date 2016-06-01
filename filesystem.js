(function() {

    this.filesystem = function() { };


    var devices = [];


    filesystem.mountStatic = function(url, mount, callback) {
        $.getJSON(url.endsWith("/") ? url + "device.json" : url + "/device.json", function(data) {
            console.log("Recieved data " + data.toString());
            devices.push({
                type: "static", 
                url: (url.endsWith("/") ? url.slice(0, -1) : url),
                mount: (mount.endsWith("/") ? mount.slice(0, -1) : mount),
                structure: data });
            setTimeout(callback, 0);
        });
    }

    filesystem.getDirectories = function(dir) {
        var d = dir.endsWith("/") ? dir.slice(0, -1) : dir;

        var dev = null;
        for (var device in devices) {
            if (d.startsWith(device["mount"])) {
                if (dev == null) {
                    dev = device;
                } else {
                    if (dev["mount"].length < device["mount"].length) {
                        dev = device;
                    }
                }
            }
        }
        if (dev == null) throw "The given directory cannot be found on any mounted device.";

        var directoryStructure = dev["structure"];
        for (var i = dev["mount"].split("/").length; i < d.split("/").length; i++) {
            directoryStructure = directoryStructure["directories"][d.split("/")[i]];
        }

        return directoryStructure["directories"].keys();
    }

}.call(this));