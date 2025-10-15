const canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 

// Obtiene las dimensiones de la pantalla actual 
const window_height = window.innerHeight; 
const window_width = window.innerWidth; 

canvas.height = window_height; 
canvas.width = window_width; 

canvas.style.background = "#ff8"; 

// Contador de objetos eliminados
let eliminatedCount = 0;
let scoreElement = document.createElement("div");
scoreElement.style.position = "absolute";
scoreElement.style.top = "20px";
scoreElement.style.right = "20px";
scoreElement.style.fontSize = "24px";
scoreElement.style.fontWeight = "bold";
scoreElement.style.color = "#333";
scoreElement.style.backgroundColor = "rgba(255,255,255,0.8)";
scoreElement.style.padding = "10px 20px";
scoreElement.style.borderRadius = "10px";
scoreElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
scoreElement.textContent = "Bitcoins: 0";
document.body.appendChild(scoreElement);

// Precargar imagen de Bitcoin
const bitcoinImage = new Image();
bitcoinImage.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='%23F7931A' d='M63.04 39.741c-4.274 17.143-21.638 27.576-38.782 23.301C7.12 58.767-3.313 41.404.961 24.26 5.235 7.118 22.598-3.315 39.742.959c17.144 4.274 27.576 21.638 23.302 38.782h-.004z'/%3E%3Cpath fill='%23FFF' d='M46.111 27.441c.636-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.51-.875-1.4 5.616c-.924-.23-1.872-.447-2.813-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.679 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.019 4.569 1.139c.85.213 1.683.436 2.503.646l-1.453 5.834 3.507.875 1.44-5.773c.958.26 1.888.5 2.798.726l-1.434 5.745 3.511.875 1.453-5.823c5.987 1.133 10.489.676 12.384-4.739 1.527-4.36-.076-6.875-3.226-8.515 2.294-.529 4.022-2.038 4.483-5.155zm-8.022 11.249c-1.085 4.36-8.426 2.003-10.806 1.412l1.929-7.729c2.38.595 10.01 1.77 8.877 6.317zm1.086-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.365 1.416 7.335 5.553z'/%3E%3C/svg%3E";

class Bitcoin { 
    constructor(x, y, size, speed) { 
        this.posX = x; 
        this.posY = y; 
        this.size = size; 
        this.speed = speed; 
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03; // Rotación más lenta
        this.amplitude = Math.random() * 1.5; // Movimiento horizontal más suave
        this.frequency = Math.random() * 0.015;
        this.initialX = x;
    } 

    draw(context) { 
        context.save();
        context.translate(this.posX, this.posY);
        context.rotate(this.rotation);
        
        // Dibujar Bitcoin
        if (bitcoinImage.complete) {
            context.drawImage(bitcoinImage, -this.size/2, -this.size/2, this.size, this.size);
        } else {
            // Fallback si la imagen no carga
            context.fillStyle = "#F7931A";
            context.beginPath();
            context.arc(0, 0, this.size/2, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#FFD700";
            context.font = "bold " + (this.size/4) + "px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("₿", 0, 0);
        }
        
        context.restore();
    } 

    update() { 
        // Mover hacia abajo con velocidad reducida
        this.posY += this.speed;
        
        // Rotación más lenta
        this.rotation += this.rotationSpeed;
        
        // Movimiento horizontal suave (flotación)
        this.posX = this.initialX + Math.sin(this.posY * this.frequency) * this.amplitude;
        
        // Si sale por abajo, reaparecer arriba
        if (this.posY - this.size > window_height) {
            this.reset();
        }
    }
    
    reset() {
        this.posY = -this.size;
        this.posX = Math.random() * (window_width - this.size * 2) + this.size;
        this.initialX = this.posX;
        this.speed = Math.random() * 1.5 + 0.8; // Velocidad reducida: entre 0.8 y 2.3
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.amplitude = Math.random() * 1.5;
        this.frequency = Math.random() * 0.015;
    }
    
    // Verificar si el clic está dentro del Bitcoin
    isPointInside(x, y) {
        const dx = x - this.posX;
        const dy = y - this.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.size / 2;
    }
} 

// Crear un array para almacenar los Bitcoins
let bitcoins = []; 

// Función para generar Bitcoins aleatorios 
function generateBitcoins(n) { 
    for (let i = 0; i < n; i++) { 
        let size = Math.random() * 40 + 30; // Tamaño entre 30 y 70 
        let x = Math.random() * (window_width - size * 2) + size; 
        let y = -size - Math.random() * 300; // Iniciar más arriba del canvas
        let speed = Math.random() * 1.5 + 0.8; // Velocidad reducida: entre 0.8 y 2.3 
        bitcoins.push(new Bitcoin(x, y, size, speed)); 
    } 
} 

// Detectar clic del mouse
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Verificar colisión con cada Bitcoin
    for (let i = bitcoins.length - 1; i >= 0; i--) {
        if (bitcoins[i].isPointInside(mouseX, mouseY)) {
            // Eliminar Bitcoin y crear uno nuevo
            bitcoins.splice(i, 1);
            eliminatedCount++;
            scoreElement.textContent = `Bitcoins: ${eliminatedCount}`;
            
            // Crear nuevo Bitcoin
            let size = Math.random() * 40 + 30;
            let x = Math.random() * (window_width - size * 2) + size;
            let y = -size;
            let speed = Math.random() * 1.5 + 0.8; // Velocidad reducida
            bitcoins.push(new Bitcoin(x, y, size, speed));
            
            // Efecto visual
            createClickEffect(mouseX, mouseY);
            break;
        }
    }
});

// Efecto visual al hacer clic
function createClickEffect(x, y) {
    const particles = 6;
    for (let i = 0; i < particles; i++) {
        setTimeout(() => {
            ctx.save();
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }, i * 80);
    }
}

// Función para animar los Bitcoins 
function animate() { 
    ctx.clearRect(0, 0, window_width, window_height); 
    
    // Actualizar y dibujar todos los Bitcoins
    bitcoins.forEach(bitcoin => { 
        bitcoin.update(); 
        bitcoin.draw(ctx); 
    }); 
    
    requestAnimationFrame(animate); 
} 

// Esperar a que cargue la imagen antes de iniciar
bitcoinImage.onload = function() {
    // Generar 15 Bitcoins y comenzar la animación 
    generateBitcoins(15); 
    animate();
};

// Ajustar canvas cuando cambia el tamaño de la ventana
window.addEventListener('resize', function() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

// Iniciar si la imagen ya está cargada
if (bitcoinImage.complete) {
    generateBitcoins(15);
    animate();
}