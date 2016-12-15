
var tiles = {};

tiles.empty = {
    backgroundColor: "rgb(40, 40, 40)",
    onTick: function(tile) {
        return;
    },
    getColor: function(tile) {
        return "rgb(40, 40, 40)";
    },
    getTagColor: function(tile) {
        return "rgba(0, 0, 0, 0)";
    },
    onClick: function(tile) {
        if (hasInventory()) {
            changeTile(tile, popFromInventory());
            saveGameState();
        }
    },
    onHold: function(tile) {
        if (hasInventory()) {
            changeTile(tile, popFromInventory());
            saveGameState();
        }
    }
};

tiles.green = {
    backgroundColor: "rgb(0, 128, 0)",
    onTick: function(tile) {
        return;
    },
    getColor: function(tile) {
        return "rgb(0, 128, 0)";
    },
    getTagColor: function(tile) {
        return "rgba(0, 0, 0, 0)";
    },
    onClick: function(tile) {
        if (canPushToInventory()) {
            changeTile(tile, "empty");
            pushToInventory("green");
            saveGameState();
        }
    },
    onHold: function(tile) {
        if (canPushToInventory()) {
            changeTile(tile, "empty");
            pushToInventory("green");
            saveGameState();
        }
    }
};
