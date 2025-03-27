const red = document.getElementById('red');
const green = document.getElementById('green');
const blue = document.getElementById('blue');

const redVal = document.getElementById('redValue');
const greenVal = document.getElementById('greenValue');
const blueVal = document.getElementById('blueValue');

const preview = document.getElementById('colorPreview');

// Cargar el sonido
const paintSound = new Audio('aerosol.mp3'); // Ruta del archivo de sonido

function updateColor() {
    const r = red.value;
    const g = green.value;
    const b = blue.value;

    redVal.textContent = r;
    greenVal.textContent = g;
    blueVal.textContent = b;

    preview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    const hex = "#" + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('');
    document.getElementById('hexValue').textContent = hex.toUpperCase();

    // Reproducir el sonido
    paintSound.currentTime = 0; // Reinicia el sonido si ya se está reproduciendo
    paintSound.play();
}

red.addEventListener('input', updateColor);
green.addEventListener('input', updateColor);
blue.addEventListener('input', updateColor);

updateColor();

const resetBtn = document.getElementById('resetBtn');
const presets = document.querySelectorAll('.preset');

resetBtn.addEventListener('click', () => {
    red.value = 0;
    green.value = 0;
    blue.value = 0;
    updateColor();
});

presets.forEach(button => {
    button.addEventListener('click', () => {
        const hex = button.getAttribute('data-color');
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);

        red.value = r;
        green.value = g;
        blue.value = b;

        updateColor();
    });
});
