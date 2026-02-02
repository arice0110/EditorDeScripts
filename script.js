const editor = document.getElementById('editor');
const lineNumbers = document.getElementById('line-numbers');

// Función para actualizar los números de línea
function updateLineNumbers() {
    const lines = editor.value.split('\n');
    const count = lines.length;
    let numbersHTML = '';
    
    for (let i = 1; i <= count; i++) {
        numbersHTML += i + '<br>';
    }
    
    lineNumbers.innerHTML = numbersHTML;
}

// Sincronizar el scroll de los números con el del textarea
editor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = editor.scrollTop;
});

// Actualizar al escribir o pegar
editor.addEventListener('input', updateLineNumbers);

// BOTÓN 1: Copiar solo el texto
document.getElementById('copy-raw').addEventListener('click', () => {
    navigator.clipboard.writeText(editor.value);
    alert('Código copiado al portapapeles');
});

// BOTÓN 2: Copiar texto con numeración
document.getElementById('copy-numbered').addEventListener('click', () => {
    const lines = editor.value.split('\n');
    const numberedText = lines.map((line, index) => `${index + 1}: ${line}`).join('\n');
    
    navigator.clipboard.writeText(numberedText);
    alert('Código numerado copiado al portapapeles');
});

// Inicializar
updateLineNumbers();
