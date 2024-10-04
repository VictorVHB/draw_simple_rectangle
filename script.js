let image = null; // Para armazenar a imagem carregada
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let startX, startY;
const rectangles = [];
const texts = [];
let selectedColor = "#FF0000";
let isTextMode = false;
const textInputContainer = document.getElementById('textInputContainer');
const textInput = document.getElementById('textInput');
const downloadBtn = document.getElementById('downloadBtn');

// Definir dimensões máximas do canvas
const maxWidth = 800;
const maxHeight = 600;

// Função para carregar a imagem
document.getElementById('imageUpload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            let imgWidth = img.width;
            let imgHeight = img.height;

            // Redimensiona a imagem se for maior que os valores máximos
            if (imgWidth > maxWidth || imgHeight > maxHeight) {
                const aspectRatio = imgWidth / imgHeight;

                if (imgWidth > imgHeight) {
                    imgWidth = maxWidth;
                    imgHeight = maxWidth / aspectRatio;
                } else {
                    imgHeight = maxHeight;
                    imgWidth = maxHeight * aspectRatio;
                }
            }

            image = img;
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

            // Exibe o botão de download
            downloadBtn.style.display = 'block';
            downloadBtn.style.marginTop = '20px'; // Garante margem
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
        // Mostra o campo de entrada de texto na posição do clique
        textInputContainer.style.display = 'block';
        textInputContainer.style.left = `${e.pageX}px`;
        textInputContainer.style.top = `${e.pageY}px`;
        textInput.focus(); // Foco no campo de texto

        // Salva a posição do clique
        startX = x;
        startY = y;
    } else {
        startX = x;
        startY = y;
        isDrawing = true;
    }
});

// Função para inserir o texto na imagem
document.getElementById('insertText').addEventListener('click', () => {
    const insertedText = textInput.value.trim(); // Novo nome para a variável

    if (insertedText) {
        texts.push({
            text: insertedText,
            x: startX,  // Usa as coordenadas do clique
            y: startY,
            color: selectedColor // Usa a cor selecionada
        });

        redraw(); // Redesenha a imagem e os elementos
        textInputContainer.style.display = 'none'; // Esconde o campo de entrada de texto
        textInput.value = ''; // Limpa o campo de texto
    }
});

// Função para desenhar o retângulo
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.save();  // Salva o estado atual
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    redraw();

    ctx.beginPath();
    ctx.rect(startX, startY, x - startX, y - startY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = selectedColor;
    ctx.stroke();

    ctx.restore();  // Restaura o estado anterior
});

// Finaliza o desenho do retângulo
canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const rectWidth = endX - startX; // Cálculo correto da largura
        const rectHeight = endY - startY; // Cálculo correto da altura

        rectangles.push({ startX, startY, width: rectWidth, height: rectHeight, color: selectedColor });
        isDrawing = false;
        redraw(); // Redesenha após adicionar o retângulo
    }
});

// Redesenha a imagem e todos os elementos
function redraw() {
    // Desenha a imagem de fundo
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Desenha todos os retângulos
    rectangles.forEach(rect => {
        ctx.beginPath();
        ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = rect.color;
        ctx.stroke();
    });

    // Desenha todos os textos
    texts.forEach(txt => {
        ctx.font = "20px Arial";
        ctx.fillStyle = txt.color;
        ctx.fillText(txt.text, txt.x, txt.y);  // Usa as coordenadas salvas
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