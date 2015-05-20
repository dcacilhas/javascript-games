;(function() {
    var Game = function() {
        var canvas = document.getElementById('pong');
        var screen = canvas.getContext('2d');
        this.size = { w: canvas.width, h: canvas.height };
        this.center = { x: this.size.w / 2, y: this.size.h / 2 };
        this.bodies = [];

        var player1 = new Paddle(20, this.center.y);
        var player2 = new Paddle(this.size.w - 20, this.size.h / 2);
        var ball = new Ball(this.center.x, this.center.y);

        this.bodies = this.bodies.concat(player1).concat(player2).concat(ball);

        var game = this;
        var tick = function() {
            game.update();
            game.draw(screen);
            requestAnimationFrame(tick);
        };

        tick();
    };

    Game.prototype = {
        update: function() {

            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }

            // For convenience. Need better way to do this as indexes can change
            // depending on bodies.concat() order.
            var p1 = this.bodies[0];
            var p2 = this.bodies[1];
            var ball = this.bodies[2];

            // TODO: Extract collision checks into general functions

            // Ball collision with canvas
            if (ball.right >= this.size.w) {
                // For now bounce back, but should +1 score for P1
                console.log('P1 score++');
                ball.velocity.x = -ball.velocity.x;
            } else if (ball.left <= 0) {
                // For now bounce back, but should +1 score for P2
                console.log('P2 score++');
                ball.velocity.x = -ball.velocity.x;
            } else if (ball.top <= 0) {
                ball.velocity.y = -ball.velocity.y;
            } else if (ball.bottom >= this.size.h) {
                ball.velocity.y = -ball.velocity.y;
            }

            // Player1 paddle collision with canvas top/bottom
            if (p1.top <= 0) {
                p1.velocity = -p1.velocity;
            } else if (p1.bottom >= this.size.h) {
                p1.velocity = -p1.velocity;
            }

            // Player2 paddle collision with canvas top/bottom
            if (p2.top <= 0) {
                p2.velocity = -p2.velocity;
            } else if (p2.bottom >= this.size.h) {
                p2.velocity = -p2.velocity;
            }

            // Ball collision with Player1
            if (ball.bottom >= p1.top && ball.top <= p1.bottom) {
                if (ball.left <= p1.right) {
                    console.log('P1 hit');
                    ball.velocity.x = -ball.velocity.x;
                }
            }

            // Ball collision with Player2
            if (ball.bottom >= p2.top && ball.top <= p2.bottom) {
                if (ball.right >= p2.left) {
                    console.log('P2 hit');
                    ball.velocity.x = -ball.velocity.x;
                }
            }
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

    var Paddle = function(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 1;
        this.size = { w: 5, h: 80 };
    };

    Paddle.prototype = {
        update: function() {
            // Move it just to test top/bottom collision
            // TODO: Add keyboard controls and/or computer AI
            this.y += this.velocity;

            this.center = { x: this.x - this.size.w / 2, y: this.y - this.size.h / 2 };

            this.left = this.x - this.size.w / 2;
            this.right = this.x + this.size.w / 2;
            this.top = this.y - this.size.h / 2;
            this.bottom = this.y + this.size.h / 2;
        },

        draw: function(screen) {
            screen.fillRect(this.center.x, this.center.y, this.size.w, this.size.h);

            // Four corners for collision debug purposes
            screen.fillRect(this.left, this.top, 1, 1);
            screen.fillRect(this.left, this.bottom, 1, 1);
            screen.fillRect(this.right, this.top, 1, 1);
            screen.fillRect(this.right, this.bottom, 1, 1);
        }
    };

    var Ball = function(x, y) {
        this.x = x;
        this.y = y;
        this.size = { w: 10, h: 10 };
        this.velocity = { x: 3, y: 1 };
    };

    Ball.prototype = {
        update: function() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            this.center = { x: this.x - this.size.w / 2, y: this.y - this.size.h / 2 };

            this.left = this.x - this.size.w / 2;
            this.right = this.x + this.size.w / 2;
            this.top = this.y - this.size.h / 2;
            this.bottom = this. y + this.size.h / 2;
        },

        draw: function (screen) {
            // TODO: Ball as circle (requires collision rework)
            // screen.beginPath();
            // screen.arc(this.x, this.y, this.size, 2 * Math.PI, false);
            // screen.fill();

            // Draw ball as rectangle for simpler collision detection
            screen.fillRect(this.center.x, this.center.y, this.size.w, this.size.h);

            // Four corners for collision debug purposes
            screen.fillRect(this.left, this.top, 1, 1);
            screen.fillRect(this.left, this.bottom, 1, 1);
            screen.fillRect(this.right, this.top, 1, 1);
            screen.fillRect(this.right, this.bottom, 1, 1);
        }
    };

    // TODO: Create a general drawRect() function to simplify paddles/ball drawing
})();
