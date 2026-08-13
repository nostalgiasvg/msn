# ✎ Invitación de Cumple · MSN Messenger

Una invitación de cumpleaños interactiva con estética Windows XP:
al abrir la página, se despliega una ventana de MSN Messenger clásica
donde el contacto escribe unos primeros mensajes y luego **espera tu
respuesta**. Es un chat de verdad: escribes o tocas una respuesta
rápida, y según lo que digas la conversación sigue una rama u otra,
hasta terminar contándote el día y la hora de la fiesta — siempre
dentro del propio chat, sin ninguna pantalla aparte.

## Qué hace

- Ventana **MSN Messenger** fiel al original: barra de título azul XP,
  menú, barra de herramientas, panel de fotos a la derecha y burbujas
  de kaomoji en vez de emojis.
- **Chat interactivo con árbol de decisión**: el contacto escribe
  ("está escribiendo…" + sonido tipo MSN) y luego se detiene a
  esperar tu respuesta. Puedes escribir libremente (se detectan
  palabras clave) o tocar uno de los botones de respuesta rápida.
- Si escribes algo que no encaja con ninguna opción, el contacto te
  lo hace saber y te vuelve a mostrar las opciones (no se queda
  colgado).
- Efecto **"nudge"** (zumbido): la ventana tiembla y hace flash, como
  el clásico zumbido de MSN.
- El desenlace (fecha, hora, lugar) se cuenta como mensajes normales
  del chat, con un poco de confeti — no hay pantalla de "invitación"
  separada.
- Botón **(↻) reiniciar** en la barra de estado para volver a
  empezar la conversación desde cero.
- Sonido opcional, silenciable con el botón de la barra de estado.

## Cómo verlo

Abre **`index.html`** con doble clic. No necesitas instalar nada.

> Para publicarlo: sube esta carpeta a GitHub y activa *GitHub Pages*.
> Es solo HTML, CSS y JS, sin dependencias ni compilación.

## Cómo personalizarlo (lo único que necesitas tocar)

Abre **`mensajes.js`** y edita:

1. **Nombres** — `contact.name` (la persona a la que va dirigida) y
   `me.name` (tú, o quien firme el mensaje).
2. **Fotos** — pon la ruta de una imagen en `contact.photo` / `me.photo`
   (por ejemplo `"fotos/ella.jpg"`, guardando la imagen en esta misma
   carpeta). Si lo dejas en `null`, se usa un avatar kaomoji por defecto.
3. **Datos de la fiesta** — el bloque `event`: `date`, `time`, `place`
   y `note`. Se insertan automáticamente donde el flujo escriba
   `{{event.date}}`, `{{event.time}}`, `{{event.place}}` o
   `{{event.note}}`, así que solo hace falta cambiarlos aquí una vez.
4. **El flujo de la conversación** — el bloque `flow`: un mapa de
   "nodos". Cada nodo tiene los mensajes que manda el contacto
   (`bot`) y las respuestas posibles (`options`, con `label`,
   `keywords` y `goto` al siguiente nodo). Todo esto está explicado
   con más detalle en los comentarios de `mensajes.js`.

Ejemplo de un nodo:

```js
pista: {
  bot: [{ text: "¿sabes qué se celebra el {{event.date}}?", typingMs: 1500 }],
  options: [
    { label: "¿tu cumple?", keywords: ["cumple", "cumpleaños"], goto: "acertaste" },
    { label: "ni idea", keywords: ["no", "ni idea"], goto: "pista2" },
  ],
},
```

## Archivos del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La página que se abre. |
| `styles.css` | Toda la estética (ventana XP/MSN, colores, animaciones). |
| `app.js` | La lógica: motor del flujo de chat, sonido, nudge, confeti. |
| `mensajes.js` | **Lo único que edita** — nombres, fotos, datos de la fiesta y el flujo de la conversación. |
| `bliss.jpg` | El fondo de escritorio clásico de Windows XP. |

---

## Prompt para replicar esto en Claude Code

> "Quiero una invitación de cumpleaños web (HTML, CSS y JS puros) con
> estética Windows XP, donde una ventana de MSN Messenger clásica
> (barra de título azul, menú, panel de fotos a la derecha) simule un
> chat real: el contacto manda unos mensajes ('está escribiendo…',
> sonido tipo MSN, efecto de nudge/zumbido) y luego espera mi
> respuesta. Quiero escribir libremente o tocar botones de respuesta
> rápida, y que ciertas palabras clave activen distintas ramas de un
> árbol de decisión, hasta terminar contando el día, la hora y el
> lugar de la fiesta como mensajes normales del chat — sin ninguna
> pantalla final aparte. Todo el contenido (nombres, fotos, flujo de
> conversación, datos de la fiesta) debe estar en un archivo de
> configuración aparte, fácil de editar."
