
function TileInstance(data) {
    this.x = data.x;
    this.y = data.y;
    this.type = data.type;
    this.state = data.state;
    this.inventory = data.inventory;
}

TileInstance.prototype.impl = function() {
    return tiles[this.type];
}

TileInstance.prototype.update = function() {
    updateTile(this.x, this.y);
    saveGameState();
}

TileInstance.prototype.changeTo = function(type) {
    this.type = type;
    this.state = 0;
    this.inventory = [];
    updateTile(this.x, this.y);
    saveGameState();
}


var gameState = {
    inventory: [],
    tileGrid: [[],[],[],[],[]]
};

function getQueryVariable(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadGameState() {
    var saveName = getQueryVariable("save");
    var savedGameState = null;

    if (saveName == null || saveName == "") {
        console.log("[GHOSTLY] No save specified, loading game from default save slot.");
        savedGameState = JSON.parse(localStorage.getItem("save__default"));
    } else {
        console.log("[GHOSTLY] Loading game from save slot '" + saveName + "'.");
        savedGameState = JSON.parse(localStorage.getItem("save__" + saveName));
    }

    if (savedGameState !== false && savedGameState != null) {
        console.log("[GHOSTLY] Saved game state was found.");
        gameState = savedGameState;
        for (var y = 0; y < 5; y++) {
            for (var x = 0; x < 5; x++) {
                updateTile(getTile(x, y));
            }
        }

        console.log("[GHOSTLY] Reloading inventory.");
        for (var i = 0; i < 5; i++) {
            $("#inventory>.inv-tile.i-" + (gameState.inventory.length - 1).toString()).fadeOut(400);
        }

        for (var i = 0; i < 5; i++) {
            if (gameState.inventory.length > i) {
                $("#inventory>.inv-tile.i-" + i.toString()).css("background-color", gameState.inventory[i].backgroundColor);
                $("#inventory>.inv-tile.i-" + i.toString()).fadeIn(400);
            }
        }
    } else {
        console.log("[GHOSTLY] No saved game state could be found. Starting new game.");
        for (var y = 0; y < 5; y++) {
            for (var x = 0; x < 5; x++) {
                gameState.tileGrid[y][x] = {
                    x: x,
                    y: y,
                    type: "empty",
                    state: 0,
                    inventory: []
                };
                updateTile(getTile(x, y));
            }
        }

        console.log("[GHOSTLY] Creating new inventory.");
        pushToInventory("green");
    }
}

function saveGameState() {
    var saveName = getQueryVariable("save");
    if (saveName == null || saveName == "") {
        localStorage.setItem("save__default", JSON.stringify(gameState));
    } else {
        localStorage.setItem("save__" + saveName, JSON.stringify(gameState));
    }
}


function onLoad() {
    console.log("[GHOSTLY] Beginning title fade.");
    $("#tile-grid>.tile.y-2").animate({backgroundColor: "rgb(40, 40, 40)"}, 1000, onInit);
}

var hasLoaded = false;

function onInit() {
    if (hasLoaded) {
        return;
    }
    hasLoaded = true;

    console.log("[GHOSTLY] Loading game.");
    $("#tile-grid>.tile>.title").remove();
    $("#tile-grid>.tile").css("cursor", "pointer");
    loadGameState();
    setInterval(onTick, 1000);
    $("#main-menu").fadeIn(400);
    console.log("[GHOSTLY] Initialization complete.");
}


function onTick() {
    for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 5; x++) {
            getImpl(getTile(x, y)).onTick(getTile(x, y));
        }
    }
}

var isClicking = false,
    wasLongClick = false,
    clickTimeout = null;

function onTileDown(x, y) {
    if (!isClicking) {
        isClicking = true;
        wasLongClick = false;
        clickTimeout = setTimeout(function() { onTileHold(x, y) }, 500);
    }
}

function onTileUp(x, y) {
    if (isClicking) {
        isClicking = false;
        if (!wasLongClick) {
            clearTimeout(clickTimeout);
            wasLongClick = false;
            getImpl(getTile(x, y)).onClick(getTile(x, y));
        }
    }
}

function onTileHold(x, y) {
    clickWasLongPress = true;
    getImpl(getTile(x, y)).onHold(getTile(x, y));
}


function getTile(x, y) {
    return gameState.tileGrid[y][x];
}

function getImpl(tile) {
    return tiles[tile.type];
}

function changeTile(tile, type) {
    console.log("[GHOSTLY] Changing tile " + tile.x.toString() + ", " + tile.y.toString() + " from type '" + tile.type + "' to '" + type + "'.");
    tile.type = type;
    tile.state = 0;
    tile.inventory = [];
    updateTile(tile);
}

function updateTile(tile) {
    var element = $("#tile-grid>.tile.x-" + tile.x.toString() + ".y-" + tile.y.toString());
    var elementColor = element.css("background-color");
    var tileColor = getImpl(tile).getColor();

    var tagElement = $("#tile-grid>.tile.x-" + tile.x.toString() + ".y-" + tile.y.toString() + ">.inner-tile");
    var tagColor = tagElement.css("background-color");
    var tileTagColor = getImpl(tile).getTagColor();

    if (tileColor != elementColor) {
        element.animate({backgroundColor: tileColor}, 400);
    }

    if (tileTagColor != tagColor) {
        element.animate({backgroundColor: tileTagColor}, 400);
    }

    console.log("[GHOSTLY] Updated " + tile.x.toString() + ", " + tile.y.toString() + " :: " + elementColor + " --> " + tileColor + " :: " + tagColor + " --> " + tileTagColor);
}

function canPushToInventory() {
    return gameState.inventory.length < 10;
}

function pushToInventory(type) {
    $("#inventory>.inv-tile.i-" + gameState.inventory.length.toString()).css("background-color", tiles[type].backgroundColor);
    $("#inventory>.inv-tile.i-" + gameState.inventory.length.toString()).fadeIn(400);
    gameState.inventory.push(type);
}

function hasInventory() {
    return gameState.inventory.length > 0;
}

function popFromInventory() {
    $("#inventory>.inv-tile.i-" + (gameState.inventory.length - 1).toString()).fadeOut(400);
    return gameState.inventory.pop(gameState.inventory.length - 1);
}


/*var game = {

    gameState: {
        inventory: [],
        tileGrid: [[],[],[],[],[]]
    },

    onLoad: function() {

    },


    isClicking: false,
    wasLongClick: false,
    clickTimeout: null,

    onTileDown: function(x, y) {
        if (!ghostly.isClicking) {
            ghostly.isClicking = true;
            ghostly.wasLongClick = false;
            ghostly.clickTimeout = setTimeout(function() { ghostly.onTileLongClick(x, y) }, 500);
        }
    },

    onTileUp: function(x, y) {
        if (ghostly.isClicking) {
            ghostly.isClicking = false;
            if (!ghostly.clickWasLongPress) {
                clearTimeout(ghostly.clickTimeout);
                ghostly.wasLongClick = false;
                ghostly.gameState.tileGrid[y][x].onShortClick(x, y);
            }
        }
    },

    onTileLongClick: function(x, y) {
        ghostly.clickWasLongPress = true;
        ghostly.gameState.tileGrid[y][x].onLongClick(x, y);
    },

    onTick: function() {
        for (var y = 0; y < 5; y++) {
            for (var x = 0; x < 5; x++) {
                if (ghostly.gameState.tileGrid[y][x].beforeTick(x, y)) {
                    ghostly.gameState.tileGrid[y][x].state+=16;
                }
                if (ghostly.gameState.tileGrid[y][x].onTick(x, y)) {
                    ghostly.updateTile(x, y);
                }
            }
        }
    },


    updateTile: function(x, y) {
        var element = $("#tile-grid>.tile.x-" + x.toString() + ".y-" + y.toString());
        if (ghostly.gameState.tileGrid[y][x].getColor() != element.css("background-color")) {
            element.animate({backgroundColor: ghostly.gameState.tileGrid[y][x].getColor()}, 400);
        }
    },

    setTile: function(x, y, tile) {
        ghostly.gameState.tileGrid[y][x] = new Tile(tiles[tile]);
        ghostly.updateTile(x, y);
    },

    hasInventory: function() {
        return ghostly.gameState.inventory.length > 0;
    },


}
*/
