;(function() {
    var Game = function() {
        var canvas = document.getElementById('pong');
        var screen = canvas.getContext('2d');
        this.size = { w: canvas.width, h: canvas.height };
        this.center = { x: this.size.w / 2, y: this.size.h / 2 };
        this.bodies = [];

        var player1 = new Player(20, this.center.y);
        var player2 = new Player(this.size.w - 20, this.size.h / 2);
        var ball = new Ball(this.center.x, this.center.y);

        this.bodies = this.bodies.concat(player1).concat(player2).concat(ball);

        var self = this;
        var tick = function() {
            self.update();
            self.draw(screen);
            requestAnimationFrame(tick);
        };

        tick();
    };

    Game.prototype = {
        update: function() {

        },

        draw: function(screen) {
            screen.clearRect(0, 0, this.size.w, this.size.h);

            screen.strokeRect(0, 0, this.size.w, this.size.h);
            screen.fillRect(this.size.w / 2, 0, 1, this.size.h);

            for (var i = 0; i < this.bodies.length; i++) {
                if (this.bodies[i].draw !== undefined) {
                    this.bodies[i].draw(screen);
                }
            }
        }
    };

    window.onload = function () {
        new Game();
    };

    var Player = function(x, y) {
        this.x = x;
        this.y = y;
        this.size = { w: 5, h: 80 };
        this.center = { x: this.x - this.size.w / 2, y: this.y - this.size.h / 2 };
    };

    Player.prototype = {
        update: function() {

        },

        draw: function(screen) {
            screen.fillRect(this.center.x, this.center.y, this.size.w, this.size.h);
        }
    };

    var Ball = function(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
    };

    Ball.prototype = {
        update: function() {

        },

        draw: function (screen) {
            screen.beginPath();
            screen.arc(this.x, this.y, this.size, 2 * Math.PI, false);
            screen.fill();
        }
    };
})();