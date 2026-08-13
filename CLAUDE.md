# invitacion_cumple.exe — contexto del proyecto

Invitación de cumpleaños interactiva con estética Windows XP: una
ventana de MSN Messenger clásica simula un **chat real** — el
contacto manda unos mensajes (indicador "está escribiendo…", efecto
nudge/zumbido, sonidos) y luego espera respuesta. El usuario escribe
libremente o toca una respuesta rápida; según lo que diga (detección
de palabras clave), la conversación avanza por un **árbol de
decisión** definido en `mensajes.js`, hasta terminar contando fecha,
hora y lugar de la fiesta como mensajes normales del propio chat.
**No hay pantalla final aparte** — fue un cambio explícito pedido por
la usuaria (antes había un "reveal overlay" con tarjeta de invitación
y "¡ESTÁS INVITAD@!"; se eliminó por completo).

## Visual de la ventana MSN

El HTML/CSS de la ventana de conversación (título, menú, barra de
herramientas, "Para:", log, barra de formato, panel de fotos, barra
de estado, banner publicitario, modal de aviso estilo "Windows XP")
fue **portado desde un prototipo React/Tailwind generado en Figma
Make** que la usuaria diseñó aparte y le gustó más que el look XP
Luna original (esa carpeta, `msn-ui-test/`, ya se borró — era solo
referencia de diseño, no se ejecutaba ni se desplegaba como parte de
la invitación; si hace falta volver a consultarla habría que
re-exportarla desde Figma Make). Solo se trajo el **visual**
(colores, tipografía Inter, iconos SVG, layout) — toda la lógica
(`app.js`, el motor de flujo, `mensajes.js`) es la de este proyecto.
Los elementos que en el prototipo eran interactivos (arrastrar la
ventana, minimizar/maximizar, menús desplegables, selector de
emojis) se trajeron como **decorativos**: cualquier click en chrome
sin función real (clase `deco-btn`) abre una modal de aviso
("Oye, ¡céntrate que estamos hablando!") en vez de hacer nada.

## Arquitectura

| Archivo | Rol |
|---|---|
| `index.html` | Estructura de la ventana MSN + escritorio XP + taskbar |
| `styles.css` | Estética portada del prototipo Figma Make (Inter, paleta MSN moderna) |
| `app.js` | Lógica: motor de flujo por nodos (`enterNode`, `matchKeyword`, `handleSend`, `sendReply`), sonido, nudge, confeti, modal de aviso |
| `mensajes.js` | **Único archivo de configuración** — nombres, fotos, sonidos (`sounds`), datos del evento (`event`), y el flujo de conversación (`flow`: nodos con `bot`, `options`/`keywords`/`goto`, `next`, `celebrate`) |
| `bliss.jpg` | Fondo de escritorio (reutilizado de otro proyecto de la usuaria) |
| `msn-icon.png` | Icono de la app (barra de título, favicon de la pestaña, taskbar) — recorte con fondo transparente de una imagen que mandó la usuaria |
| `info-icon.png` | Icono "i" de la modal de aviso — mismo tratamiento (fondo quitado con flood-fill) |
| `sonido-mensaje.m4a` | Beep de "nuevo mensaje", recortado de un mp3 que repetía el sonido 3 veces |
| `sonido-nudge.m4a` | Zumbido del nudge, recortado de silencio; `app.js` sincroniza la duración de la animación de temblor con `audio.duration` de este archivo |
| `.gitignore` | Solo ignora `.DS_Store` |

**Regla no negociable**: todo el contenido editable vive en
`mensajes.js`. Ningún otro archivo debería necesitar tocarse para
personalizar el contenido (nombres, fotos, flujo de conversación,
datos del evento).

**Motor de flujo (`app.js`)**: la conversación es un mapa de nodos
(`cfg.flow`), no una lista lineal. `enterNode(id)` reproduce los
mensajes del bot de ese nodo y luego, si hay `options`, renderiza
chips de respuesta rápida y habilita el textarea; si hay `next`,
encadena automáticamente al siguiente nodo sin esperar input; si no
hay ninguno de los dos, es un nodo terminal (fin de la conversación
dentro del propio chat). El texto libre se compara contra
`keywords` de cada opción (normalizado: minúsculas, sin acentos,
`includes`); `keywords: ["*"]` actúa de comodín/atrapa-todo. Si no
hay coincidencia, se usa `node.fallback` o `cfg.fallback`. Los
mensajes del bot pueden usar `{{event.campo}}` para interpolar datos
de `cfg.event` sin duplicar texto.

**`contact` vs `me`/`people` — quién es quién**: `contact` es
**la usuaria** (organizadora), quien "manda" los mensajes del flujo
— su nombre de ejemplo es "Invitad@ ✎", pero eso es solo un
placeholder que ella cambiará por su nombre real; no representa a
quien abre el enlace. `me` es la otra persona (quien responde), y
por defecto es genérica ("Tú"). Como un mismo enlace puede
compartirse con varios invitados distintos, `cfg.people` (array en
`mensajes.js`) permite identificarlos: la conversación **siempre
empieza** en el nodo `quienEres` (`startNode`/`identifyNode`), que
pregunta "perdona, ¿quién eres?" y espera texto libre — sin chips a
propósito, para no revelar la lista de invitados. `matchPerson()`
compara lo escrito contra `person.keywords`; si no reconoce a
nadie, usa `node.fallback` y **vuelve a preguntar indefinidamente**
(decisión explícita de la usuaria: nadie pasa sin identificarse).
Si reconoce a alguien, `applyIdentity(person)` sustituye `cfg.me`
(nombre/foto/kaomoji) y refresca en caliente el panel de fotos
("Tú") antes de continuar — a `person.entryNode` si lo tiene (unos
mensajes a su medida), o si no a `cfg.afterIdentifyNode` (por
defecto `"start"`, el flujo común). `restart()` restaura `cfg.me` a
`defaultMe` (copia guardada al cargar la página), así que "reiniciar"
vuelve a pedir identificación desde cero.

## Pendiente / próximos pasos

1. **Sonido real de MSN** — ✅ resuelto para mensaje y nudge. Mismo
   proceso casero en ambos casos (ffmpeg no está disponible — Homebrew
   roto en esta Mac — así que se usa `afconvert`/`afinfo` + un script
   Python de análisis RMS para detectar huecos de silencio, recortar
   solo la parte útil con fades cortos, y codificar a AAC/m4a):
   - `sonido-mensaje.m4a` (0.7s): recorte de un mp3 que repetía el beep
     3 veces, se quedó solo la primera repetición.
   - `sonido-nudge.m4a` (~1.87s): recorte del zumbido quitando el
     silencio de alrededor. La animación de temblor (`triggerNudge` en
     `app.js`) ya no usa una duración fija — lee `audio.duration` del
     propio archivo para que el temblor dure exactamente lo que dura
     el sonido.
   `msnNotify()`/`nudgeSound()` en `app.js` reproducen `cfg.sounds.message`
   / `cfg.sounds.nudge` (ver `mensajes.js`) vía `<audio>`, con tonos
   sintéticos como *fallback* si esos campos se dejan en `null`.
   Sigue pendiente, si la usuaria quiere: sonido real para el "ding"
   final (`windowsDing` sigue siendo sintético) — mismo patrón, añadir
   `sounds.reveal` en `mensajes.js`.

2. **Fotos de perfil**: la usuaria va a mandar las fotos de cada
   persona (contacto / ella / cada invitad@). Falta:
   - Guardar cada imagen en esta carpeta con nombre claro.
   - Rellenar `contact.photo` en `mensajes.js`, y `photo` dentro de
     cada entrada de `cfg.people` para los invitados (si se deja
     `null`, se usa un avatar kaomoji por defecto — así que no hace
     falta esperar a tener todas).

3. **Contenido de la invitación**: los textos actuales en
   `mensajes.js` (`flow`, `event.date/time/place/note`) son de
   ejemplo — la usuaria los personalizará con el flujo y los datos
   reales de su fiesta. `cfg.people` también tiene un único invitado
   de ejemplo (id "ejemplo", keyword "ejemplo") — hay que duplicarlo
   y rellenarlo con los invitados reales (keywords, nombre, foto, y
   opcionalmente `entryNode` para un saludo a medida).

## Preferencias de estilo de la usuaria (aplican a este proyecto)

- Kaomojis en vez de emojis en toda la interfaz y contenido.
- Tema oscuro/retro consistente con el resto de sus proyectos "vibe
  coding" (Windows 95/XP/Y2K), aunque aquí se usa paleta clara propia
  de MSN Messenger/XP Luna por ser fiel a la referencia visual pedida.
- Un único archivo de configuración (`mensajes.js`) para todo el
  contenido editable — no tocar el resto de archivos para personalizar.
- Prefiere recibir el archivo funcionando de inmediato y pulir con
  cambios puntuales, no refactors grandes.
