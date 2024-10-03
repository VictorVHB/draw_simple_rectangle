let image = null; // Para armazenar a imagem carregada
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let startX, startY;
const rectangles = [];
const texts = [];
let selectedColor = "#FF0000";
let isTextMode = false;
let currentText = "";
const textInputContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');
const downloadBtn = document.getElementById('downloadBtn');

// Função para carregar a imagem
document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            image = img;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    };
    reader.readAsDataURL(file);
});

// Inicia o desenho do retângulo ou a inserção de texto
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isTextMode) {
        textInputContainer.style.display = 'block';
        textInputContainer.style.left = `${x}px`;
        textInputContainer.style.top = `${y}px`;
        textInput.focus();
    } else {
        startX = x;
        startY = y;
        isDrawing = true;
    }
});

// Função para inserir o texto na imagem
document.getElementById('insertText').addEventListener('click', () => {
    if (currentText) {
        texts.push({ text: currentText, x: parseInt(textInputContainer.style.left), y: parseInt(textInputContainer.style.top), color: selectedColor });

        redraw();
        currentText = "";
        textInputContainer.style.display = 'none';
        textInput.value = '';
    }
});

// Função para desenhar o retângulo
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    redraw();

    ctx.beginPath();
    ctx.rect(startX, startY, x - startX, y - startY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = selectedColor;
    ctx.stroke();
});

// Finaliza o desenho do retângulo
canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        const rectWidth = canvas.width - startX; // Largura do retângulo
        const rectHeight = canvas.height - startY; // Altura do retângulo

        rectangles.push({ startX, startY, width: rectWidth, height: rectHeight, color: selectedColor });
        isDrawing = false;
    }
});

// Redesenha a imagem e todos os elementos
function redraw() {
    ctx.drawImage(image, 0, 0);

    rectangles.forEach(rect => {
        ctx.beginPath();
        ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = rect.color;
        ctx.stroke();
    });

    texts.forEach(txt => {
        ctx.font = "20px Arial";
        ctx.fillStyle = txt.color;
        ctx.fillText(txt.text, txt.x, txt.y);
    });
}

// Função para baixar a imagem
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'image-with-rectangles-and-text.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Alterna entre os modos de desenho
document.getElementById('drawRectangle').addEventListener('click', () => {
    isTextMode = false;
    textInputContainer.style.display = 'none';
});

document.getElementById('addText').addEventListener('click', () => {
    isTextMode = true;
});

// Altera a cor selecionada
document.getElementById('colorPicker').addEventListener('input', (e) => {
    selectedColor = e.target.value;
});