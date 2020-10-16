function Font() {
    var _f = this;

    _f.family = 'Matrix Code NFI';

    _f.size = 30;
    _f.sizeDefault = 30;

    _f.sizeVariable = function () {
        return Math.floor(((Math.random() * 0.7) + 0.5) * _f.size);
    }

    _f.setZoom = function (factor) {
        _f.size = Math.floor(factor * _f.sizeDefault);
    };
}

function Direction() {
    var _d = this;

    _d.currentX = 'none';
    _d.currentY = 'down';

    _d.directionX = {
        left: -1,
        right: 1,
        none: 0
    };

    _d.directionY = {
        down: 1,
        up: -1,
        none: 0
    };

    _d.setX = function (direction) {
        if (_d.directionX.hasOwnProperty(direction)) {
            _d.currentX = direction;
        }
    };

    _d.setY = function (direction) {
        if (_d.directionY.hasOwnProperty(direction)) {
            _d.currentY = direction;
        }
    };
}

function Color() {
    _c = this;

    _c.default = '#00FF00';
    _c.current = '#00FF00';

    _c.palette = {
        lime: '#00FF00',
        olive: '#999900',
        mediumseagreen: '#3CB371',
        red: '#FF1A1A',
        deeppink: '#FF1493',
        fuchsia: '#FF00FF',
        orange: '#FFA500',
        yellow: '#FFFF00',
        blue: '#3333FF',
        dodgerblue: '#1E90FF',
        aqua: '#00FFFF',
        whitesmoke: '#F5F5F5'
    };

    _c.set = function (color) {
        if (_c.palette.hasOwnProperty(color)) {
            _c.current = _c.palette[color];
        }
    };
}

function Wave() {
    var _w = this;

    _w.direction = {
        waveX: false,
        waveY: false
    }

    _w.generate = function (waveSeed, fontSize) {
        return Math.floor(fontSize * Math.sin(waveSeed / fontSize));
    }

    _w.toggle = function (wave) {
        if (_w.direction.hasOwnProperty(wave)) {
            _w.direction[wave] = !_w.direction[wave];
        }
    }
}

function Ticker(interval, duration = 0, delay = 0) {
    var _t = this;

    _t.last = false;

    _t.interval = interval;
    _t.intervalDefault = interval;

    _t.duration = duration;
    _t.delay = delay;

    _t.toggle = function () {
        if (_t.delay == 0) {
            _t.delay = Number.MAX_VALUE;
        } else {
            _t.delay = 0;
        }
    }
}

function Matrix(matrixId) {
    var _m = this;

    _m.m = [];

    _m.chars = '!"#$%&\'()*+,-./:;<=>?[\\]^_{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');

    _m.density = 1.2;

    _m.canvas = document.getElementById(matrixId);
    _m.context = _m.canvas.getContext('2d');

    _m.canvas.width = window.innerWidth;
    _m.canvas.height = window.innerHeight;

    _m.font = new Font();
    _m.direction = new Direction();
    _m.color = new Color();
    _m.wave = new Wave();
    _m.ticker = new Ticker(100, 0, 0);

    _m.numCols = Math.floor(_m.density * _m.canvas.width / _m.font.size);
    _m.numRows = Math.floor(_m.density * _m.canvas.height / _m.font.size);

    _m.randomInt = function (max) {
        return Math.floor(Math.random() * max);
    }

    _m.randomChar = function () {
        return _m.chars[_m.randomInt(_m.chars.length)];
    }

    _m.createChar = function (offset = 0) {
        var fontSize = _m.font.sizeVariable();
        var posX = posY = stopX = stopY = 0;

        if (_m.direction.currentY == 'none') {
            posY = _m.randomInt(_m.canvas.height);
        } else if (_m.direction.currentY == 'down') {
            posY = -fontSize - offset;

            stopY = Math.floor(_m.randomInt(1.2 * _m.canvas.height));

            if (stopY > _m.canvas.height) {
                stopY = _m.canvas.height;
            }

            stopY += fontSize;
        } else if (_m.direction.currentY == 'up') {
            posY = _m.canvas.height + fontSize + offset;

            stopY = _m.canvas.height - Math.floor(_m.randomInt(1.2 * _m.canvas.height));

            if (stopY < 0) {
                stopY = 0;
            }

            stopY -= fontSize;
        }

        if (_m.direction.currentX == 'none') {
            posX = _m.randomInt(_m.canvas.width);
        } else if (_m.direction.currentX == 'right') {
            if (_m.direction.currentY != 'none') {
                posX = _m.randomInt(_m.canvas.width) - _m.randomInt(_m.canvas.width) / 2;
                posY = _m.randomInt(_m.canvas.height);

                if (_m.direction.currentY == 'down') {
                    posY -= fontSize;
                } else {
                    posY += fontSize;
                }
            } else {
                posX = -fontSize - offset;
            }

            stopX = Math.floor(_m.randomInt(1.2 * _m.canvas.width));

            if (stopX > _m.canvas.width) {
                stopX = _m.canvas.width;
            }
        } else if (_m.direction.currentX == 'left') {
            if (_m.direction.currentY != 'none') {
                posX = _m.randomInt(_m.canvas.width) + _m.randomInt(_m.canvas.width) / 2;
                posY = _m.randomInt(_m.canvas.height);

                if (_m.direction.currentY == 'down') {
                    posY -= fontSize;
                } else {
                    posY += fontSize;
                }
            } else {
                posX = _m.canvas.width + fontSize + offset;
            }

            stopX = _m.randomInt(_m.canvas.width) - Math.floor(_m.randomInt(1.2 * _m.canvas.width));

            if (stopX < -fontSize) {
                stopX = -fontSize;
            }
        }

        return {
            posX: posX,
            posY: posY,
            stopX: stopX,
            stopY: stopY,
            fontSize: fontSize,
            prev: {
                posX: 0,
                posY: 0,
                char: ''
            }
        };
    }

    _m.init = function () {
        _m.m = [];

        for (var i = 0; i < _m.numCols; i++) {
            _m.m.push(_m.createChar(2 * _m.randomInt(_m.canvas.height)));
        }

        window.requestAnimationFrame(_m.draw);
    }

    _m.resize = function () {
        _m.canvas.width = window.innerWidth;
        _m.canvas.height = window.innerHeight;

        _m.numCols = Math.floor(_m.density * _m.canvas.width / _m.font.size);
        _m.numRows = Math.floor(_m.density * _m.canvas.height / _m.font.size);

        _m.init();
    }

    _m.clearScreen = function () {
        _m.context.clearRect(0, 0, _m.canvas.width, _m.canvas.height); // clear canvas
    }

    _m.drawCharPrev = function (currentChar) {
        _m.context.font = currentChar.fontSize + 'px ' + _m.font.family;
        _m.context.fillStyle = _m.color.current;
        _m.context.globalCompositeOperation = 'hard-light';
        _m.context.fillText(currentChar.prev.char, currentChar.prev.posX, currentChar.prev.posY);
    }

    _m.drawChar = function (currentChar) {
        var char = _m.randomChar();

        _m.context.globalCompositeOperation = 'source-atop';
        _m.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        _m.context.fillRect(currentChar.posX - Math.floor(0.25 * currentChar.fontSize), currentChar.posY - Math.floor(0.8 * currentChar.fontSize), currentChar.fontSize, currentChar.fontSize);

        _m.drawCharPrev(currentChar);

        _m.context.font = currentChar.fontSize + 'px ' + _m.font.family;
        _m.context.globalCompositeOperation = "source-over";
        _m.context.fillStyle = 'white';
        _m.context.fillText(char, currentChar.posX, currentChar.posY);

        return char;
    }

    _m.draw = function (now) {
        if (now > _m.ticker.delay) {
            if (!_m.ticker.last || now >= _m.ticker.last + _m.ticker.interval) {
                _m.ticker.last = now;

                _m.context.fillStyle = "rgba(0, 0, 0, 0.09)";
                _m.context.fillRect(0, 0, _m.canvas.width, _m.canvas.height);

                for (var c = 0; c < _m.m.length; c++) {
                    var waveX = 0;
                    var waveY = 0;
                    var createChar = true;

                    if (_m.wave.direction.waveX) {
                        if (_m.direction.currentY == 'down' || _m.direction.currentY == 'up') {
                            var waveSeedX = _m.m[c].posY;
                        } else {
                            var waveSeedX = now;
                        }

                        waveX = _m.wave.generate(waveSeedX, _m.m[c].fontSize);
                    }

                    if (_m.wave.direction.waveY) {
                        if (_m.direction.currentY == 'down' || _m.direction.currentY == 'up') {
                            var waveSeedY = now;
                        } else {
                            var waveSeedY = _m.m[c].posX;
                        }

                        waveY = _m.wave.generate(waveSeedY, _m.m[c].fontSize);
                    }

                    _m.m[c].posX += _m.direction.directionX[_m.direction.currentX] * _m.m[c].fontSize + waveX;
                    _m.m[c].posY += _m.direction.directionY[_m.direction.currentY] * _m.m[c].fontSize + waveY;

                    if (_m.direction.currentY == 'down') {
                        if (_m.m[c].posY < _m.m[c].stopY) {
                            if (_m.m[c].posY >= 0) {
                                _m.m[c].prev.char = _m.drawChar(_m.m[c]);
                            }

                            createChar = false;
                        }
                    } else if (_m.direction.currentY == 'up') {
                        if (_m.m[c].posY > _m.m[c].stopY) {
                            if (_m.m[c].posY <= _m.canvas.height) {
                                _m.m[c].prev.char = _m.drawChar(_m.m[c]);
                            }

                            createChar = false;
                        }
                    } else if (_m.direction.currentX == 'right') {
                        if (_m.m[c].posX < _m.m[c].stopX) {
                            if (_m.m[c].posX >= -_m.m[c].fontSize) {
                                _m.m[c].prev.char = _m.drawChar(_m.m[c]);
                            }

                            createChar = false;
                        }
                    } else if (_m.direction.currentX == 'left') {
                        if (_m.m[c].posX > _m.m[c].stopX) {
                            if (_m.m[c].posX <= _m.canvas.width) {
                                _m.m[c].prev.char = _m.drawChar(_m.m[c]);
                            }

                            createChar = false;
                        }
                    }

                    if (createChar) {
                        _m.drawCharPrev(_m.m[c]);

                        _m.m[c] = _m.createChar();
                    } else {
                        _m.m[c].prev.posX = _m.m[c].posX;
                        _m.m[c].prev.posY = _m.m[c].posY;
                    }
                }
            }
        }

        window.requestAnimationFrame(_m.draw);
    }

    _m.toggleFullScreen = function() {
        var elem = document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

    /* Main */

    //setup resize callback
    window.addEventListener('resize', function () {
        _m.resize();
    });

    document.addEventListener('click', function () {
        _m.ticker.toggle();
    });

    document.addEventListener('dblclick', function () {
        _m.toggleFullScreen();
    });

    //start animation
    _m.init();
    //don't animate from start when working locally
    if (document.location.protocol == 'file:')
        _m.ticker.toggle();

    // moving the logo up/down with keys
    window.addEventListener('keydown', function (e) {
        var key = e.key || e.keyCode || e.which;
        var title = document.getElementById('title');
        var margin = parseInt(title.getAttribute("data-top"));
        if (key == 38) {
            margin -= 5;
            title.style.marginTop = margin + 'px';
            title.setAttribute('data-top', margin);
        } else if (key == 40) {
            margin += 5;
            title.style.marginTop = margin + 'px';
            title.setAttribute('data-top', margin);
        } else if (key == 32) {
            _m.ticker.toggle();
        } else if (key == 13) {
            _m.toggleFullScreen();
        }
    });
}

new Matrix('matrix');