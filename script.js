document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const htmlCode = document.getElementById('html-code');
    const cssCode = document.getElementById('css-code');
    const jsCode = document.getElementById('js-code');
    
    const htmlNumbers = document.getElementById('html-numbers');
    const cssNumbers = document.getElementById('css-numbers');
    const jsNumbers = document.getElementById('js-numbers');
    
    const copyBtn = document.getElementById('copyBtn');
    const copyWithNumbersBtn = document.getElementById('copyWithNumbersBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tabs = document.querySelectorAll('.tab');
    const editorSections = document.querySelectorAll('.editor-section');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    // Configuración
    const LINE_HEIGHT = 20;
    
    // Función para actualizar números de línea
    function updateLineNumbers(textarea, numbersElement) {
        const lines = textarea.value.split('\n');
        const totalLines = lines.length || 1;
        
        let numbersHTML = '';
        for (let i = 1; i <= totalLines; i++) {
            numbersHTML += i + '\n';
        }
        
        numbersElement.textContent = numbersHTML;
        numbersElement.style.lineHeight = `${LINE_HEIGHT}px`;
    }
    
    // Función para sincronizar scroll
    function syncScroll(textarea, numbersElement) {
        numbersElement.scrollTop = textarea.scrollTop;
    }
    
    // Configurar cada editor
    function setupEditor(textarea, numbersElement) {
        // Inicializar números
        updateLineNumbers(textarea, numbersElement);
        
        // Actualizar números al escribir
        textarea.addEventListener('input', () => {
            updateLineNumbers(textarea, numbersElement);
        });
        
        // Sincronizar scroll
        textarea.addEventListener('scroll', () => {
            syncScroll(textarea, numbersElement);
        });
        
        // Manejar tabulación
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // Insertar 4 espacios
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                
                // Mover cursor
                this.selectionStart = this.selectionEnd = start + 4;
                
                // Actualizar números
                updateLineNumbers(this, numbersElement);
            }
        });
    }
    
    // Inicializar editores
    setupEditor(htmlCode, htmlNumbers);
    setupEditor(cssCode, cssNumbers);
    setupEditor(jsCode, jsNumbers);
    
    // Cambiar pestañas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Quitar active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            // Agregar active a la pestaña clickeada
            tab.classList.add('active');
            
            // Ocultar todas las secciones
            editorSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección correspondiente
            document.getElementById(`${tabId}-editor`).classList.add('active');
            
            // Dar foco al textarea de la pestaña activa
            setTimeout(() => {
                document.getElementById(`${tabId}-code`).focus();
            }, 10);
        });
    });
    
    // Mostrar notificación
    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        notification.style.background = type === 'success' ? '#388a34' : '#c42b1c';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }
    
    // Obtener editor activo
    function getActiveEditor() {
        const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
        
        switch(activeTab) {
            case 'html':
                return {
                    element: htmlCode,
                    numbers: htmlNumbers,
                    name: 'HTML'
                };
            case 'css':
                return {
                    element: cssCode,
                    numbers: cssNumbers,
                    name: 'CSS'
                };
            case 'js':
                return {
                    element: jsCode,
                    numbers: jsNumbers,
                    name: 'JavaScript'
                };
        }
    }
    
    // Copiar solo el código
    copyBtn.addEventListener('click', () => {
        const editor = getActiveEditor();
        const code = editor.element.value;
        
        navigator.clipboard.writeText(code)
            .then(() => {
                showNotification(`${editor.name} copiado`);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                showNotification('Error al copiar', 'error');
            });
    });
    
    // Copiar código con números
    copyWithNumbersBtn.addEventListener('click', () => {
        const editor = getActiveEditor();
        const lines = editor.element.value.split('\n');
        
        if (lines.length === 0) {
            showNotification('No hay código para copiar', 'error');
            return;
        }
        
        // Calcular ancho de números
        const maxDigits = String(lines.length).length;
        
        // Formatear con números alineados
        let formatted = '';
        for (let i = 0; i < lines.length; i++) {
            const lineNum = String(i + 1);
            const padding = ' '.repeat(maxDigits - lineNum.length);
            formatted += `${padding}${lineNum} | ${lines[i]}\n`;
        }
        
        navigator.clipboard.writeText(formatted.trim())
            .then(() => {
                showNotification(`${editor.name} con números copiado`);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
                showNotification('Error al copiar', 'error');
            });
    });
    
    // Limpiar editor
    clearBtn.addEventListener('click', () => {
        const editor = getActiveEditor();
        
        if (editor.element.value.trim() === '') {
            showNotification('El editor ya está vacío', 'error');
            return;
        }
        
        if (confirm(`¿Limpiar el código ${editor.name}?`)) {
            editor.element.value = '';
            updateLineNumbers(editor.element, editor.numbers);
            showNotification(`${editor.name} limpiado`);
        }
    });
    
    // Código de ejemplo
    htmlCode.value = `<!DOCTYPE html>
<html>
<head>
    <title>Mi Página</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Hola Mundo!</h1>
        <p>Este es un ejemplo de código HTML.</p>
    </div>
</body>
</html>`;
    
    cssCode.value = `/* Estilos CSS de ejemplo */
body {
    background: #f0f0f0;
    color: #333;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    color: #2196f3;
    border-bottom: 2px solid #2196f3;
    padding-bottom: 10px;
}

.button {
    display: inline-block;
    padding: 10px 20px;
    background: #4caf50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
}`;
    
    jsCode.value = `// JavaScript de ejemplo
console.log('Editor cargado correctamente');

function saludar() {
    const nombre = 'Usuario';
    console.log(\`Hola, \${nombre}!\`);
    return nombre;
}

// Llamar función
saludar();

// Event listener básico
document.addEventListener('DOMContentLoaded', function() {
    console.log('Documento listo');
});

// Ejemplo con arrow function
const suma = (a, b) => {
    return a + b;
};

console.log('Resultado:', suma(5, 3));`;
    
    // Actualizar números iniciales
    updateLineNumbers(htmlCode, htmlNumbers);
    updateLineNumbers(cssCode, cssNumbers);
    updateLineNumbers(jsCode, jsNumbers);
    
    // Dar foco al editor HTML
    setTimeout(() => {
        htmlCode.focus();
    }, 100);
});
