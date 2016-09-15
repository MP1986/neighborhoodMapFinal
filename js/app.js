    // Variables for player movement boundaries.
var maxY = 404;
var minY = 0;
var maxX = 404;
var minX = 0;
var playerStartX = 202;
var playerStartY = 404;

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = 0;
    this.y = 220;
    this.width = 50;
    this.height = 50;
    this.speed = Math.random() * 300 + 40;
};

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;

    var spawnPoint = Math.random();

    if (this.x > maxX) {
        if (spawnPoint >= 0 && spawnPoint <= .33) {
            this.y = 220;
            this.x = 0;
        } else if (spawnPoint > .33 && spawnPoint <= .66) {
            this.y = 220 - 85.5;
            this.x = 0;
        } else if (spawnPoint > .66 && spawnPoint <= 1) {
            this.y = 220 - (85.5 * 2);
            this.x = 0;
        }
    }
};

    // Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.
var Player = function() {
    this.x = playerStartX;
    this.y = playerStartY;
    this.width = 50;
    this.height = 50;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {

    //Iterates through each enemy and checks for collision with player then sends //player back to start.

    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x && player.y < enemy.y + enemy.height && player.height + player.y > enemy.y) {
            player.x = 202;
            player.y = 404;
        };
    }
    //Detects when player reaches top and sends back to beginning.
    if (this.y < minY) {
        this.x = playerStartX;
        this.y = playerStartY;
    }
};

    //Renders player.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

    //Handle player input.
Player.prototype.handleInput = function(direction) {
    if (direction == 'up' && this.y > minY)
        this.y -= 85.5;
    else if (direction == 'down' && this.y < maxY)
        this.y += 85.5;
    else if (direction == 'left' && this.x > minX)
        this.x -= 101;
    else if (direction == 'right' && this.x < maxX)
        this.x += 101;
};

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});