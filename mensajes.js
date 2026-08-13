// =====================================================
//  INVITACIÓN DE CUMPLE · Base de datos de la conversación
// =====================================================
//
//  Aquí editas TODO el contenido de la invitación: nombres,
//  fotos, y el FLUJO de la conversación (un árbol de
//  decisión: el contacto manda mensajes, tú respondes
//  escribiendo o tocando una respuesta rápida, y según lo
//  que digas la conversación avanza por una rama u otra).
//
//  No necesitas tocar ningún otro archivo.
//
// =====================================================

const MSN_CONFIG = {

  // ---------------------------------------------------
  // 1) DATOS DE LA VENTANA
  // ---------------------------------------------------
  meta: {
    pageTitle:   "invitacion_cumple.exe",   // pestaña del navegador
    windowTitle: "Conversación — MSN Messenger",
  },

  // ---------------------------------------------------
  // 2) CONTACTOS
  //
  //    contact = TÚ, la organizadora de la fiesta. Es quien
  //    "manda" los mensajes de la conversación (el nombre
  //    "Invitad@" es solo un placeholder — cámbialo por tu
  //    nombre real cuando quieras).
  //
  //    me = la otra persona del chat, quien responde. Por
  //    defecto es genérica ("Tú"), pero si quien abre el
  //    enlace se identifica como alguien de la lista
  //    `people` (más abajo), sus datos sustituyen a estos.
  //
  //    photo: pon la ruta de una imagen ("fotos/ella.jpg")
  //    o déjalo en null para usar un avatar kaomoji por defecto
  //
  //    status: va entre paréntesis junto al nombre, arriba de
  //    la conversación (ej. "(Conectada)", "(Conectado)"...).
  //    personalMessage: la segunda línea bajo el nombre, como
  //    el "mensaje personal" clásico de MSN.
  // ---------------------------------------------------
  contact: {
    name:      "Invitad@ ✎",
    status:    "(Conectada)",
    personalMessage: "tramando algo... (¬‿¬)",
    statusMsg: "(⁎˃ᴗ˂⁎) tiene algo que contarte",
    photo:     null,
    kaomoji:   "(｡◕‿◕｡)",
  },

  me: {
    name:    "Tú",
    photo:   null,
    kaomoji: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
  },

  // ---------------------------------------------------
  // 2.1) INVITAD@S (identificación al empezar)
  //
  //    Antes de nada, TÚ (contact) preguntas "¿quién eres?"
  //    y esperas a que quien esté al otro lado escriba su
  //    nombre. Si lo que escribe coincide con las `keywords`
  //    de alguien de esta lista, esa persona pasa a ser "me"
  //    (nombre/foto/kaomoji propios) durante el resto de la
  //    conversación. Si no coincide con nadie, vuelves a
  //    preguntar — nadie sigue sin identificarse.
  //
  //    Cada invitad@:
  //      id:       identificador interno (no se muestra)
  //      keywords: palabras que reconoces como "es est@"
  //      name/photo/kaomoji: sustituyen a los de `me`
  //      personalMessage: (opcional) sustituye SOLO para esta
  //                 persona la frase "tramando algo..." que se
  //                 ve bajo tu nombre arriba de la conversación
  //                 (contact.personalMessage). Déjalo sin poner
  //                 (o quítalo) para que vea la frase genérica.
  //      entryNode: (opcional) el id de un nodo de `flow`
  //                 propio de esta persona — uno o dos
  //                 mensajes a su medida (un chiste interno,
  //                 por ejemplo) antes de reengancharse a la
  //                 conversación común. Déjalo en null para
  //                 ir directo a `afterIdentifyNode`.
  //
  //    Duplica el bloque de Daniela (de ejemplo) para cada
  //    invitad@ real: cambia id/keywords/name/photo/kaomoji,
  //    y si le escribes un saludo a medida, el `entryNode` del
  //    nodo que crees para ella/él en `flow` (ver más abajo).
  // ---------------------------------------------------
  people: [
    {
      id:       "daniela",
      keywords: ["Daniela", "Urrea", "mamá de Margarita"],
      name:     "Daniela",
      photo:    null,
      kaomoji:  "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
      personalMessage: "escapándonos a ver Harry Potter (¬‿¬)",
      entryNode: "daniela_saludo",
    },
  ],

  // ---------------------------------------------------
  // 3) SONIDOS
  //    Ruta a un mp3/m4a en esta misma carpeta. Si se deja
  //    null, se usa un pitido sintético de repuesto.
  // ---------------------------------------------------
  sounds: {
    message: "sonido-mensaje.m4a",   // suena cada vez que llega un mensaje nuevo
    nudge:   "sonido-nudge.m4a",     // suena en los mensajes con nudge: true (la ventana tiembla mientras dura)
  },

  // ---------------------------------------------------
  // 4) DATOS DE LA FIESTA
  //    Se usan dentro de los mensajes del flujo escribiendo
  //    {{event.date}}, {{event.time}}, {{event.place}} o
  //    {{event.note}} — así solo cambias el dato aquí y se
  //    actualiza en todos los mensajes que lo usan.
  // ---------------------------------------------------
  event: {
    date:  "Sábado 12 de septiembre",
    time:  "20:00h",
    place: "Mi casa (te paso la dirección aparte)",
    note:  "Trae lo que te apetezca, lo importante eres tú (づ｡◕‿‿◕｡)づ",
  },

  // ---------------------------------------------------
  // 5) EL FLUJO DE LA CONVERSACIÓN
  //
  //    Es un mapa de "nodos". La conversación siempre
  //    empieza en `startNode`. Cada nodo tiene:
  //
  //    - bot: los mensajes que manda el contacto al entrar
  //      en ese nodo (text, typingMs, nudge: true opcional).
  //
  //    - options: las respuestas posibles del usuario.
  //      Aparecen como botones de respuesta rápida Y también
  //      se detectan si el usuario las escribe a mano:
  //        { label: "texto del botón",
  //          keywords: ["palabra1", "palabra2"],  // lo que se busca en lo que escriba
  //          goto: "idDelSiguienteNodo" }
  //      Usa keywords: ["*"] para una opción "comodín" que
  //      responde a cualquier cosa que no encaje en las demás
  //      (útil para no dejar la conversación colgada).
  //
  //    - next: en vez de "options", un nodo puede avanzar
  //      solo (sin esperar respuesta) al nodo indicado.
  //
  //    - celebrate: true → lanza confeti al entrar en ese nodo.
  //
  //    Un nodo SIN options y SIN next es el final de esa
  //    rama: la conversación se queda ahí, tal cual, dentro
  //    del propio chat (no hay pantalla aparte).
  // ---------------------------------------------------
  // La conversación siempre empieza pidiendo que quien
  // responde se identifique (ver "2.1) INVITAD@S" arriba).
  startNode: "quienEres",

  // Nodo que hace la pregunta "¿quién eres?" — debe coincidir
  // con `startNode`. No lo cambies de sitio salvo que sepas
  // lo que haces.
  identifyNode: "quienEres",

  // A qué nodo de `flow` va la conversación una vez
  // identificado el invitado (si esa persona no tiene su
  // propio `entryNode` en `people`).
  afterIdentifyNode: "start",

  // Qué dice el contacto cuando el usuario escribe algo que
  // no coincide con ninguna keyword del nodo actual.
  fallback: {
    text: "jsjs no te pillé eso (・_・;) prueba con una de estas opciones ↓",
    typingMs: 900,
  },

  flow: {

    // Nodo de identificación: sin `options`, solo espera que
    // se escriba un nombre y lo compara con `people`. Si no
    // reconoce a nadie, usa `fallback` de aquí abajo y vuelve
    // a esperar (nunca deja pasar sin identificar).
    quienEres: {
      bot: [
        { text: "psst, espera un momento (・_・?)", typingMs: 1200 },
        { text: "perdona, ¿quién eres?", typingMs: 1400 },
      ],
      fallback: {
        text: "mmm no te reconozco (・_・;) prueba a escribir tu nombre",
        typingMs: 900,
      },
    },

    // Saludo a medida de Daniela — se reengancha con "start" a la
    // conversación común. Para otro invitado, duplica este nodo con
    // otro nombre (ej. "alex_saludo") y apúntalo desde su entryNode.
    daniela_saludo: {
      bot: [
        { text: "Holichi! Hoy no vengo a proponerte escaparnos a ver Harry Potter pero casi... 😏", typingMs: 1800 },
        { text: "Sé que todo depende de tus horarios pero quería mandarte esta invitación igualmente ♥️", typingMs: 1800 },
      ],
      next: "start",
    },

    start: {
      bot: [
        { text: "holaaa ¿estás ahí? (・_・?)", typingMs: 1300 },
        { text: "tengo que contarte algo... pero antes quiero saber algo tuyo", typingMs: 1700 },
        { text: "¿qué tal andas?", typingMs: 1200 },
      ],
      options: [
        { label: "muy bien (＾▽＾)", keywords: ["bien", "genial", "perfecto", "estupendo", "guay"], goto: "bien" },
        { label: "regular / mal (´；ω；`)", keywords: ["mal", "regular", "meh", "cansada", "cansado"], goto: "mal" },
      ],
    },

    bien: {
      bot: [
        { text: "me alegro (｡•̀ᴗ-)✧ porque vas a necesitar energía para lo que viene", typingMs: 1600 },
      ],
      next: "pista",
    },

    mal: {
      bot: [
        { text: "vaya... pues espero que esto te anime un poco (｡•́︿•̀｡)", typingMs: 1700 },
      ],
      next: "pista",
    },

    pista: {
      bot: [
        { text: "tengo que contarte algo importante", typingMs: 1400 },
        { text: "¿sabes qué se celebra el {{event.date}}?", typingMs: 1800, nudge: true },
      ],
      options: [
        { label: "¿tu cumple?", keywords: ["cumple", "cumpleaños", "cumpleanos", "birthday"], goto: "acertaste" },
        { label: "ni idea", keywords: ["no", "ni idea", "no se", "no sé", "nose"], goto: "pista2" },
      ],
    },

    pista2: {
      bot: [
        { text: "va sobre mí... y sobre una fiesta ٩(◕‿◕)۶", typingMs: 1600 },
      ],
      options: [
        { label: "¡tu cumple!", keywords: ["cumple", "cumpleaños", "cumpleanos", "birthday"], goto: "acertaste" },
        { label: "sigo sin saber (・_・;)", keywords: ["*"], goto: "acertaste" },
      ],
    },

    acertaste: {
      bot: [
        { text: "¡exacto! (灬♥ω♥灬)", typingMs: 1100 },
        { text: "y quiero que estés ahí conmigo", typingMs: 1400 },
        { text: "va a ser el {{event.date}}, a las {{event.time}}", typingMs: 1900, nudge: true },
        { text: "en {{event.place}}", typingMs: 1500 },
        { text: "{{event.note}}", typingMs: 1800 },
      ],
      options: [
        { label: "¡allí estaré! (づ￣ 3￣)づ", keywords: ["si", "sí", "alli", "allí", "estare", "estaré", "claro", "confirmo", "ahi", "ahí", "voy"], goto: "confirmado" },
        { label: "no voy a poder", keywords: ["no puedo", "no", "paso", "no voy"], goto: "insistir" },
      ],
    },

    insistir: {
      bot: [
        { text: "venga porfa (ᗒᗨᗕ) significaría mucho para mí", typingMs: 1700 },
      ],
      options: [
        { label: "vale, ahí estaré", keywords: ["*"], goto: "confirmado" },
      ],
    },

    confirmado: {
      bot: [
        { text: "¡yay! (灬º‿º灬)♡ nos vemos ahí", typingMs: 1500 },
        { text: "no hace falta que confirmes nada raro, solo que vengas ✎", typingMs: 1700 },
      ],
      celebrate: true,
    },

  },

};

// No toques esta línea (conecta la configuración con la app)
window.MSN_CONFIG = MSN_CONFIG;
