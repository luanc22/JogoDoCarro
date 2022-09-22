//Constantes do jogo
const drag = 0.002;
const canvas = document.getElementById("tela");
var ctx = canvas.getContext("2d");
const turnmodifier = 0.0002;

//Cores
const yellow = "#adab24";
const white = "#FFFFFF";

const interval = 26.7;//Intervalo do loop
const screensize= {
    xsize : canvas.width,
    ysize : canvas.height
}
//Variaveis do jogo
var objects = []; // objetos a serem renderizados


//Variaveis para o controle com as teclas
var keyspressed ={
    wpressed : false,
    spressed:false,
    apressed : false,
    dpressed : false
}

//Define eventos quando tecla é pressionada
document.addEventListener('keydown',presskey);
document.addEventListener('keyup',unpresskey);

//Seta e unseta os controles pressionados
function presskey(e){
    switch(e.keyCode){
        case 87:
            keyspressed.wpressed = true;
            break;
        case 83:
            keyspressed.spressed = true;
            break;
        case 65 :
            keyspressed.apressed = true;
            break;
        case 68 :
            keyspressed.dpressed = true;
            break;
        default:
            return;
    }
}
function unpresskey(e){
    switch(e.keyCode){
        case 87:
            keyspressed.wpressed = false;
            break;
        case 83:
            keyspressed.spressed = false;
            break;
        case 65 :
            keyspressed.apressed = false;
            break;
        case 68 :
            keyspressed.dpressed = false;
            break;
        default:
            return;
    }
}


var backlights = [
    {
        type :'rectangle',
        relativex : -4,
        relativey :1,
        sizex : 1,
        sizey : 1,
        color : "#000000"
    },
    {
        type :'rectangle',
        relativex : -4,
        relativey :-2,
        sizex : 1,
        sizey : 1,
        color : "#000000"
    }
]

//Variaveis do carro
var car = {
    posx :50,
    posy :50,
    ang :0, //angulo em graus
    acceleration : 0.005,
    maxspeed : 0.5,
    speed :0,
    //Sprites do carro
    sprites :
        [
            {
                type :'rectangle',
                relativex : -4,
                relativey :-2,
                sizex : 6,
                sizey : 4,
                color : "#013220"
            },
            backlights[0],
            backlights[1],
            {
                type :'rectangle',
                relativex : 1,
                relativey :1,
                sizex : 1,
                sizey : 1,
                color : yellow
            },
            {
                type :'rectangle',
                relativex : 1,
                relativey :-2,
                sizex : 1,
                sizey : 1,
                color : yellow
            }

        ]
}

objects.push(car)//Adiciona o carro nos objetos a serem renderizados

requestAnimationFrame(render);
//Função de renderizar
function render(){
    ctx.clearRect(0,0,screensize.xsize,screensize.ysize);
    //Renderiza todosos objetos da cena
    objects.forEach((object)=>{
        ctx.save();
        ctx.translate((screensize.xsize*car.posx)/100,(screensize.ysize*car.posy)/100);
        ctx.rotate(convertToRad(object.ang));
        object.sprites.forEach((sprite)=>{
            let xbig = (screensize.xsize*sprite.sizex)/100;
            let ybig = (screensize.ysize*sprite.sizey)/100;
            ctx.fillStyle = sprite.color;
            ctx.fillRect(sprite.relativex,sprite.relativey,sprite.sizex,sprite.sizey);
        });
        ctx.restore()
    });
    requestAnimationFrame(render);
}


//Loop de jogo
function loop(){

    //Movimenta o carro
    let delta = calculateTranslation(car.speed,convertToRad(car.ang));
    

    car.posx+=delta.deltax;
    car.posy+=delta.deltay;
    //Aplica arrasto
    if(car.speed>0 ||car.speed<0){
        car.speed = car.speed>0 ? car.speed-drag : car.speed+drag;
    }

    backlights[0].color = yellow;
    backlights[1].color = yellow;

    if(keyspressed.wpressed){
        car.speed+=car.acceleration;
    }
    if(keyspressed.spressed){
        car.speed -=car.acceleration;
        backlights[0].color = white;
        backlights[1].color = white;
    }
    if(keyspressed.apressed && (Math.round(car.speed*100)>0 ||Math.round(car.speed*100)<0)){
        car.ang-=turnmodifier*(1-car.speed*1.0);
        
    }
    if(keyspressed.dpressed && (Math.round(car.speed*100)>0 ||Math.round(car.speed*100)<0)){
        car.ang+=turnmodifier*(1-car.speed*1.0);
    }
    if(car.ang>360 || car.ang<-360){
        car.ang = 0;
    }

}

function calculateTranslation(speed, angle){
    
    let deltax = (Math.cos(angle)*speed);
    let deltay = (Math.sin(angle)*speed);
    
    return {
        deltax : deltax,
        deltay : deltay
    }
}


function convertToRad(angle){
    return angle*(Math.PI*180);
}

setInterval(loop,interval);