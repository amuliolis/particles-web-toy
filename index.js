var pz = 0;

let Particle = class {
    constructor(x, y, vx, vy, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
    }
    update() {
        this.life--;
        this.x += this.vx;
        this.y += this.vy;

        this.vx += ((noise[    Math.round(pz/4)  + 50*Math.round(this.y/8) + 200*50*Math.round(this.x/8)]/1000)-0.5)/20;
        this.vy += ((noise[(50-Math.round(pz/4)) + 50*Math.round(this.y/8) + 200*50*Math.round(this.x/8)]/1000)-0.5)/20;


        let magnitude = Math.sqrt((this.vx*this.vx) + (this.vy*this.vy));
        if (magnitude > 1) {
            this.vx /= magnitude;
            this.vy /= magnitude;
        }
    }
};

var asdf;
let Character = class {
    constructor(letter, x, y, width, height) {
        this.letter = letter;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
    }
    checkClick(cx, cy) {
        if (cx > this.x && cx < this.x + this.width &&
            cy < this.y && cy > this.y - this.height) {
                return true;
            }
        return false;
    }
};

function getViewportDimension() {
    var e = window, a = 'inner';
    if (!( 'innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {w:e[a + 'Width'], h:e[a + 'Height']};
}

var c;
var ctx;
var t = 0;

let particles = [];
let characters = [];
let message = "particles".split('');

var test;
function start() {
    c = document.getElementById("c");
    c.addEventListener('click', function(event) {
        
        var click_x = event.pageX - (c.offsetLeft + c.clientLeft);
        var click_y = event.pageY - (c.offsetTop + c.clientTop);

        characters.forEach((char, index, arr) => {
            if (char.checkClick(click_x, click_y)) {
                
                var pix = ctx.getImageData(char.x, char.y+20, char.width, -(char.height+20)).data;

                for (var i = 0; i < pix.length; i += 4) {
                    if (pix[i] > 250 && pix[i+1] > 250 && pix[i+2] > 250) {
                        particles.push(new Particle(
                            (char.x)+((i/4)%char.width),
                            ((char.y+20)-(char.height+20))+((i/4)/char.width),
                            (Math.random()-0.5)/5, (Math.random()-0.5)/5, 500));
                    }
                }
                arr.splice(index, 1);
            }
        });

    });

    ctx = c.getContext('2d');

    ctx.font = "80px Arial";
    for (var i = 0; i < message.length; i++) {
        characters.push(new Character(message[i], 400, 375,
            Math.ceil(ctx.measureText(message[i]).width), 60));
    }

    var cursor = 400+characters[0].width + 4;
    for (var i = 1; i < characters.length; i++) {
        characters[i].x = cursor;
        cursor += characters[i].width + 4;
    }

    setInterval(draw, 16);
}

function draw() {
    t++;
    
    var dim = getViewportDimension();
    c.width = dim.w;
    c.height = dim.h;

    ctx.fillStyle = 'rgb(44, 44, 70)';
    ctx.fillRect(0, 0, c.width, c.height);
    

    if (t % 400 < 200) {
        pz += 1;
    } else {
        pz -= 1;
    }

    particles.forEach((p, index, arr) => {
        p.update();
        if (p.life < 0) {
    	    arr.splice(index, 1);
        }

        var alpha = vmap(p.life, 0, p.maxLife, 1, 0);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        ctx.fillRect(p.x, p.y, 2, 2);
    });

    ctx.font = "80px Arial";
    ctx.fillStyle = 'white';

    characters.forEach((char, index, arr) => {
        char.y = c.height/2;
        ctx.fillText(char.letter, char.x, char.y);
    });

}

function vmap(value, value_min, value_max, target_min, target_max) {

    var valueBetweenZeroAndOne =
    (value_max - value)/(value_max - value_min);

    return (valueBetweenZeroAndOne * (target_max-target_min)) + target_min;
}
