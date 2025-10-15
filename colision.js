const canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 

//Obtiene las dimensiones de la pantalla actual 
const window_height = window.innerHeight; 
const window_width = window.innerWidth; 

canvas.height = window_height; 
canvas.width = window_width; 

canvas.style.background = "#ff8"; 

class Circle { 
    constructor(x, y, radius, color, text, speed) { 
        this.posX = x; 
        this.posY = y; 
        this.radius = radius; 
        this.color = color; 
        this.originalColor = color;
        this.text = text; 
        this.speed = speed; 

        // Direcciones iniciales aleatorias
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; 
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed; 
        
        this.isColliding = false;
    } 

    draw(context) { 
        context.beginPath(); 
        context.strokeStyle = this.color; 
        context.textAlign = "center"; 
        context.textBaseline = "middle"; 
        context.font = "20px Arial"; 
        context.fillText(this.text, this.posX, this.posY); 
        context.lineWidth = 2; 
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); 
        context.stroke(); 
        context.closePath(); 
    } 

    update(context) { 
        this.draw(context); 
    } 
    
    move() {
        // Actualizar posición
        this.posX += this.dx; 
        this.posY += this.dy; 
        
        // Rebotar en bordes
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) { 
            this.dx = -this.dx; 
        } 
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy; 
        }
    }
    
    checkCollision(otherCircle) {
        const dx = this.posX - otherCircle.posX;
        const dy = this.posY - otherCircle.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= (this.radius + otherCircle.radius);
    }
    
    // Método para manejar colisión física entre círculos
    resolveCollision(otherCircle) {
        // Calcular vector de dirección
        const dx = otherCircle.posX - this.posX;
        const dy = otherCircle.posY - this.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Vector normalizado
        const nx = dx / distance;
        const ny = dy / distance;
        
        // Intercambiar velocidades (colisión elástica simple)
        const tempDx = this.dx;
        const tempDy = this.dy;
        
        this.dx = otherCircle.dx;
        this.dy = otherCircle.dy;
        
        otherCircle.dx = tempDx;
        otherCircle.dy = tempDy;
        
        // Separar los círculos para evitar superposición
        const overlap = (this.radius + otherCircle.radius) - distance;
        const separation = overlap / 2;
        
        this.posX -= nx * separation;
        this.posY -= ny * separation;
        otherCircle.posX += nx * separation;
        otherCircle.posY += ny * separation;
    }
} 

let circles = []; 

function generateCircles(n) { 
    for (let i = 0; i < n; i++) { 
        let radius = Math.random() * 30 + 20; 
        let x = Math.random() * (window_width - radius * 2) + radius; 
        let y = Math.random() * (window_height - radius * 2) + radius; 
        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`; 
        let speed = Math.random() * 4 + 1; 
        let text = `C${i + 1}`; 
        circles.push(new Circle(x, y, radius, color, text, speed)); 
    } 
} 

function checkAndResolveCollisions() {
    // Resetear estado de colisión
    circles.forEach(circle => {
        circle.isColliding = false;
    });
    
    // Verificar y resolver colisiones entre todos los pares
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (circles[i].checkCollision(circles[j])) {
                circles[i].isColliding = true;
                circles[j].isColliding = true;
                
                // Resolver colisión física
                circles[i].resolveCollision(circles[j]);
            }
        }
    }
    
    // Actualizar colores
    circles.forEach(circle => {
        circle.color = circle.isColliding ? "#0000FF" : circle.originalColor;
    });
}

function animate() { 
    ctx.clearRect(0, 0, window_width, window_height); 
    
    // Primero mover todos los círculos
    circles.forEach(circle => { 
        circle.move(); 
    }); 
    
    // Luego verificar y resolver colisiones
    checkAndResolveCollisions();
    
    // Finalmente dibujar
    circles.forEach(circle => { 
        circle.update(ctx); 
    }); 
    
    requestAnimationFrame(animate); 
} 

generateCircles(20); 
animate();