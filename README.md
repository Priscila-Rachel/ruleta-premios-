# ruleta-premios-
Ruleta interactiva desarrollada con HTML5, CSS3 Y JavaScript para animaciones y lógica aleatoria.
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
> 🎮 **[Probar la Ruleta en Vivo](https://tu-usuario.github.io/nombre-del-repo/)**

# 🎰 Ruleta de Premios (Neon Arcade Edition)

Una aplicación web interactiva y responsiva de una ruleta de la suerte desarrollada con **HTML5**, **CSS3** y **JavaScript Vanilla**, ambientada con una estética arcade retro-neón. 

El proyecto destaca por no utilizar librerías externas: la renderización geométrica, la síntesis de sonido y el sistema de partículas fueron construidos desde cero con tecnologías nativas del navegador.

---

## 📸 Vista previa

*(Podés agregar acá una captura o un GIF animado de la ruleta funcionando)*

---

## ⚡ Características principales

* **Renderizado dinámico en SVG:** Construcción matemática de sectores polares a cartesianos, clavijas perimetrales e ilustraciones vectoriales nativas mediante `<defs>` y `<symbol>`.
* **Física y animación calculada:** Algoritmo de rotación con desaceleración personalizada (`cubic-bezier` / función de atenuación exponencial) y efecto de cabeceo físico de la aguja indicadora al impactar cada clavija.
* **Audio nativo con Web Audio API:** Síntesis sonora procedural en tiempo real (osciladores y envolventes de ganancia) para los clics mecánicos del giro, la melodía de victoria y el tono de fallo, sin necesidad de archivos de audio externos `.mp3`.
* **Motor de confeti en Canvas:** Sistema de partículas con física de gravedad, velocidad vectorial y rotación aleatoria ejecutado en `<canvas>`.
* **Estética Neón & Glassmorphism:** Tipografía con parpadeo eléctrico mediante `@keyframes`, fondos con luces flotantes difusas y modales con efectos translúcidos (`backdrop-filter`) que alternan su paleta de color según el resultado (cian para victoria, magenta para fallo).
* **Diseño Responsivo:** Escalado fluido para dispositivos móviles y escritorio usando funciones CSS como `clamp()` y `aspect-ratio`.

---

## 🛠️ Tecnologías utilizadas

* **HTML5:** Marcado semántico, soporte accesible (`aria-live`, roles de diálogo) y lienzos SVG/Canvas.
* **CSS3:** Variables CSS (`:root`), degradados lineales y radiales, sombras compuestas (`drop-shadow`, `box-shadow`, `text-shadow`) y animaciones clave.
* **JavaScript (ES6+):** Manipulación del DOM, cálculo trigonométrico, `requestAnimationFrame` y Web Audio API.

---

## 📁 Estructura del proyecto

```text
├── index.html       # Estructura semántica, viewport y llamadas a scripts/estilos
├── styles.css       # Variables de color, diseño responsivo y efectos neón
├── app.js           # Lógica del sorteo, dibujo SVG, audio nativo y confeti
└── README.md        # Documentación del proyecto


