;(function() {
    var Game = function() {
        var canvas = document.getElementById('pong');
        var screen = canvas.getContext('2d');
        this.size = { w: canvas.width, h: canvas.height };
        this.center = { x: this.size.w / 2, y: this.size.h / 2 };
        this.entities = [];

        var player = new Player(20, this.center.y);
        var computer = new Computer(this.size.w - 20, this.size.h / 2);
        var ball = new Ball(this.center.x, this.center.y);

        this.entities = this.entities.concat(player).concat(computer).concat(ball);

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
            // for (var i = 0; i < this.entities.length; i++) {
            //     this.entities[i].update();
            // }

            // For convenience. Need better way to do this as indexes can change
            // depending on entities.concat() order.
            var p1 = this.entities[0];
            var computer = this.entities[1];
            var ball = this.entities[2];

            p1.update();
            computer.update(ball);
            ball.update();

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

            // TODO: Factor this out?
            // Ball collision with Player1
            if (ball.bottom >= p1.paddle.top && ball.top <= p1.paddle.bottom) {
                if (ball.left <= p1.paddle.right) {
                    console.log('P1 hit');
                    ball.velocity.x = -ball.velocity.x;
                }
            }

            // Ball collision with Computer
            if (ball.bottom >= computer.paddle.top && ball.top <= computer.paddle.bottom) {
                if (ball.right >= computer.paddle.left) {
                    console.log('P2 hit');
                    ball.velocity.x = -ball.velocity.x;
                }
            }
        },

        draw: function(screen) {
            screen.clearRect(0, 0, this.size.w, this.size.h);

            screen.strokeRect(0, 0, this.size.w, this.size.h);
            screen.fillRect(this.size.w / 2, 0, 1, this.size.h);

            for (var i = 0; i < this.entities.length; i++) {
                if (this.entities[i].draw !== undefined) {
                    this.entities[i].draw(screen);
                }
            }
        }
    };

    var Player = function(x, y) {
        this.x = x;
        this.y = y;
        this.paddle = new Paddle(this.x, this.y);
        this.input = new Input();
    };

    Player.prototype = {
        update: function() {
            if (this.input.isDown(this.input.KEYS.UP)) {
                this.paddle.velocity = -1;
            } else if (this.input.isDown(this.input.KEYS.DOWN)) {
                this.paddle.velocity = 1;
            } else {
                this.paddle.velocity = 0;
            }

            this.paddle.update();
        },

        draw: function(screen) {
            this.paddle.draw(screen);
        }
    };

    var Computer = function(x, y) {
        this.x = x;
        this.y = y;
        this.paddle = new Paddle(this.x, this.y);
    };

    Computer.prototype = {
        update: function(ball) {
            // Perfect AI
            // TODO: Add some stupidity
            if (ball.y < this.paddle.y) {
                this.paddle.velocity = -1;
            } else if (ball.y > this.paddle.y) {
                this.paddle.velocity = 1;
            } else {
                this.paddle.velocity = 0;
            }

            this.paddle.update();
        },

        draw: function(screen) {
            this.paddle.draw(screen);
        }
    };

    var Paddle = function(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = 0;
        this.size = { w: 5, h: 80 };
    };

    Paddle.prototype = {
        update: function() {
            this.y += this.velocity;

            this.center = { x: this.x - this.size.w / 2, y: this.y - this.size.h / 2 };

            this.left = this.x - this.size.w / 2;
            this.right = this.x + this.size.w / 2;
            this.top = this.y - this.size.h / 2;
            this.bottom = this.y + this.size.h / 2;

            if (this.top <= 0) {
                this.y = 0 + this.size.h / 2;
            } else if (this.bottom >= 300) {
                this.y = 300 - this.size.h / 2;
            }
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

    var Input = function() {
        var keyState = {};

        window.addEventListener('keydown', function(e) {
            keyState[e.keyCode] = true;
        });

        window.addEventListener('keyup', function(e) {
            keyState[e.keyCode] = false;
        });

        this.isDown = function(keyCode) {
            return keyState[keyCode] === true;
        };

        this.KEYS = { UP: 38, DOWN: 40 };
    };

    window.onload = function () {
        new Game();
    };

    // TODO: Create a general drawRect() function to simplify paddles/ball drawing
})();
