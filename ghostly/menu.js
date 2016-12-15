
function onMainMenuLoadClick() {
    $("#main-menu").fadeOut(400, function() {
        $("#load-menu").fadeIn(400);
    });
}

function onMainMenuNewClick() {
    $("#main-menu").fadeOut(400, function() {
        $("#new-menu").fadeIn(400);
    });
}

function onMainMenuCloneClick() {
    $("#main-menu").fadeOut(400, function() {
        $("#clone-menu").fadeIn(400);
    });
}

function onMainMenuResetClick() {
    $("#main-menu").fadeOut(400, function() {
        $("#reset-menu").fadeIn(400);
    });
}


function onLoadMenuOkClick() {
    window.location.replace(window.location.href.split('?')[0] + "?save=" + encodeURIComponent($("#load-menu>span>.menu-input").val()));
}

function onLoadMenuCancelClick() {
    $("#load-menu").fadeOut(400, function() {
        $("#main-menu").fadeIn(400);
    });
}


function onNewMenuOkClick() {
    var saveUri = encodeURIComponent($("#new-menu>span>.menu-input").val());
    localStorage.removeItem("save__" + saveUri);
    window.location.replace(window.location.href.split('?')[0] + "?save=" + saveUri);
}

function onNewMenuCancelClick() {
    $("#new-menu").fadeOut(400, function() {
        $("#main-menu").fadeIn(400);
    });
}


function onCloneMenuOkClick() {
    var saveUri = encodeURIComponent($("#clone-menu>span>.menu-input").val());
    localStorage.setItem("save__" + saveUri, JSON.stringify(gameState));
    window.location.replace(window.location.href.split('?')[0] + "?save=" + saveUri);
}

function onCloneMenuCancelClick() {
    $("#clone-menu").fadeOut(400, function() {
        $("#main-menu").fadeIn(400);
    });
}


function onResetMenuYesClick() {
    var saveName = getQueryVariable("save");
    if (saveName == null || saveName == "") {
        localStorage.removeItem("save__default");
    } else {
        localStorage.removeItem("save__" + saveName);
    }
    window.location.replace(window.location.href);
}

function onResetMenuCancelClick() {
    $("#reset-menu").fadeOut(400, function() {
        $("#main-menu").fadeIn(400);
    });
}
