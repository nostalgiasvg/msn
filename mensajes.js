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
    pageTitle:   "msn_messenger.exe",   // pestaña del navegador
    windowTitle: "MSN Messenger",
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
    name:      "m_ariia",
    status:    "(Conectada)",
    personalMessage: "ミ★ ✨😏🌸 𝘵𝘳𝘢𝘮𝘢𝘯𝘥𝘰 𝘢𝘭𝘨𝘰 🌸😏✨ ★彡",
    statusMsg: "m_ariia está escribiendo",
    photo:     "fotos/m_ariia.png",
    kaomoji:   "(｡◕‿◕｡)",
  },

  me: {
    name:    "Tú",
    photo:   null,
    kaomoji: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
  },

  // ---------------------------------------------------
  // 2.1) INVITAD@S (identificación al empezar)
  // ---------------------------------------------------
  people: [
    {
      id:       "daniela",
      keywords: ["Daniela", "Urrea", "mamá de Margarita"],
      name:     "Daniela",
      photo:    "fotos/daniela.png",
      kaomoji:  "🌼",
      personalMessage: "✨🌼🥂 ɱιɾα, ρυñҽƚα, ɳσ ɱҽ ϙυιƚҽɳ ҽʅ ρҽɾɾҽσ 🥂🌼✨",
      entryNode: "daniela_saludo",
    },
    {
      id:       "luis",
      keywords: ["Luis", "Luisito", "Luisete"],
      name:     "Luis",
      photo:    "fotos/luis.png",
      kaomoji:  "🤘",
      personalMessage: "🐾🤘💚 𝔢𝔰𝔱𝔲𝔳𝔢 𝔟𝔞𝔦𝔩𝔞𝔫𝔡𝔬 𝔠𝔬𝔫 𝔩𝔞 𝔪𝔞𝔩𝔞 𝔰𝔲𝔢𝔯𝔱𝔢 💚🤘🐾",
      entryNode: "luis_saludo",
    },
    {
      id:       "daniel",
      keywords: ["Daniel", "Dani", "tu cuñado"],
      name:     "Daniel",
      photo:    "fotos/daniel.png",
      kaomoji:  "👒",
      personalMessage: "★¸.•☆•.¸★ 🌊🌞_a_la_madre_de_julia_se_la_respeta_🌞🌊 ★⡀.•☆•.★",
      entryNode: "daniel_saludo",
    },
    {
      id:       "laura",
      keywords: ["Laura", "Lau", "tu prima Lau", "tu prima Laura"],
      name:     "Laura",
      photo:    "fotos/laura.png",
      kaomoji:  "🍡",
      personalMessage: "꧁•⊹٭★🎵 𝙸'𝚖 𝚓𝚞𝚜𝚝 𝚊 𝚔𝚒𝚍 𝚊𝚗𝚍 𝚕𝚒𝚏𝚎 𝚒𝚜 𝚊 𝚗𝚒𝚐𝚑𝚝𝚖𝚊𝚛𝚎 🎵★٭⊹•꧂",
      entryNode: "laura_saludo",
    },
    {
      id:       "paula",
      keywords: ["Paula", "Pau", "tu prima Pau", "tu prima Paula"],
      name:     "Paula",
      photo:    "fotos/paula.png",
      kaomoji:  "👘",
      personalMessage: "🖤😜 𝕤𝕠𝕣𝕣𝕪𝕞𝕒𝕤𝕖𝕟! 𝕤𝕚 𝕟𝕠 𝕔𝕠𝕟𝕥𝕖𝕤𝕥𝕠, 𝕖𝕤𝕥𝕠𝕪 𝕧𝕚𝕖𝕟𝕕𝕠 𝕒𝕟𝕚𝕞𝕖 😜🖤",
      entryNode: "paula_saludo",
    },
    {
      id:       "erika",
      keywords: ["Erika", "Erikis"],
      name:     "Erika",
      photo:    "fotos/erika.png",
      kaomoji:  "🤘",
      personalMessage: "`✵•.¸,✵°✵.｡.✰ half-kawaii😜🖤, half-me-cago-en-tus-☠️✰.｡.✵°✵,¸.•✵´ ",
      entryNode: "erika_saludo",
    },
    {
      id:       "sheila",
      keywords: ["Sheila", "Shei", "Shei Shei"],
      name:     "Sheila",
      photo:    "fotos/sheila.png",
      kaomoji:  "🎳",
      personalMessage: "✨🌹 🅷🅾🆈 🆅🅰 🅰 🆂🅴🆁 🅴🅻 🅳🅸🅰 🅼🅴🅽🅾🆂 🅿🅴🅽🆂🅰🅳🅾 🌹✨",
      entryNode: "sheila_saludo",
    },
    {
      id:       "celeste",
      keywords: ["Celeste", "Ce", "C"],
      name:     "Celeste",
      photo:    "fotos/celeste.png",
      kaomoji:  "🧘🏻‍♀️",
      personalMessage: "🧘🏻‍♀️💖_be_soft_and_radical_💖🧘🏻‍♀️",
      entryNode: "celeste_saludo",
    },
    {
      id:       "jarrys",
      keywords: ["Jarrys", "Jota", "J"],
      name:     "Jarrys",
      photo:    "fotos/jarrys.png",
      kaomoji:  "🎧",
      personalMessage: "/_so_like_september_i_fall_down_🍂",
      entryNode: "jarrys_saludo",
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
    date:  "Sábado 19 de septiembre",
    time:  "17:00h",
    place: "mi casa, ¡no hay pérdida!",
    note:  "no requeriría nada más que tu presencia, porque lo importante es que estés ♥️✨ ¿qué me dices?",
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
    text: "jiji, VAYA qué palo, no te pillo. ¿Por qué no pruebas con alguna de las opciones de abajo? 👇 ",
    typingMs: 900,
  },

  flow: {

    // Nodo de identificación: sin `options`, solo espera que
    // se escriba un nombre y lo compara con `people`. Si no
    // reconoce a nadie, usa `fallback` de aquí abajo y vuelve
    // a esperar (nunca deja pasar sin identificar).
    quienEres: {
      bot: [
        { text: "oieee, una cosita...", typingMs: 1200 },
        { text: "usté quién es? 😳", typingMs: 1400 },
      ],
      fallback: {
        text: "mmm no caigo, qué palo! y si me dices tu nombre pero tal como sale en el DNI (sin apellidos, obvio)? 🙄",
        typingMs: 900,
      },
    },

    // Saludo a medida de Daniela — se reengancha con "start" a la
    // conversación común. Para otro invitado, duplica este nodo con
    // otro nombre (ej. "alex_saludo") y apúntalo desde su entryNode.
    daniela_saludo: {
      bot: [
        { text: "Ah vale! Daniela 🌼, holichi! Hoy no vengo a proponerte escaparnos a ver Harry Potter pero casi... 😏", typingMs: 1800 },
        { text: "Sé que todo depende de tus horarios pero...", typingMs: 1800 },
      ],
      next: "start",
    },
    luis_saludo: {
      bot: [
        { text: "Ay vale, Luiiiiis!🤘 Holaaa! Te propongo un plan un poco muggle... ", typingMs: 1800 },
        { text: "Puede que no incluya un sectumsempra🐍 pero, sí que habrá tarta 🍰!!! ", typingMs: 1800 },
      ],
      next: "start",
    },
    daniel_saludo: {
      bot: [
        { text: "Ay vale! Danieeeeel! Lo que te propongo no implica derribar torres me temo...", typingMs: 1800 },
        { text: "Pero sí que implica tarta 🍰!!! ", typingMs: 1800 },
      ],
      next: "start",
    },
    laura_saludo: {
      bot: [
        { text: "Ay Lau! ♥️ Justo quería proponerte algo que pasará antes de que podamos hablar en japonés...", typingMs: 1800 },
        { text: "y que igual implicaría una visita a MonroeBakes y también incluye a Dani por supuesto jijiji 🎑", typingMs: 1800 },
      ],
      next: "start",
    },
    paula_saludo: {
      bot: [
        { text: "Ay PauPau!💘 Puessss justo quería proponerte un plan muy de normies pero que este año siento que se lo merece ", typingMs: 1800 },
        { text: "si no puedes no te rayes, que hay mucha vida por delante para repetirlo! 🧚", typingMs: 1800 },
      ],
      next: "start",
    },
    erika_saludo: {
      bot: [
        { text: "Ay Erikis, eres túuuu!🖤 Quería escribirte justo que, si te apetece y puedes porque 🐶🐶, tengo una propuesta (obvio con Iker incluido 🖤)", typingMs: 1800 },
        { text: "algo que nunca hago pero que siento que este año podría ser buena idea, ¡no sé, tú me entiendes!", typingMs: 1800 },
      ],
      next: "start",
    },
    sheila_saludo: {
      bot: [
        { text: "Ay Shei Sheiiii🌹 Vengo a proponerte algo, aunque requiera usar una mesa no tan increíblemente increíble como la tuya 🥹🥹🥹", typingMs: 1800 },
        { text: "es algo que no he hecho antes pero que creo que en esta ocasión quiero hacerlo y compartirlo con vosotras (porque la chica de la orla siempre está incluida 💖💖)", typingMs: 1800 },
      ],
      next: "start",
    },
    celeste_saludo: {
      bot: [
        { text: "Ay Ce, eres tú!✨ Quería proponerte un plan, cero presión y 100% chill; que incluiría a toda crew 🥰", typingMs: 1800 },
        { text: "igual no vuelve a pasar pero esta vez siento que es lo que me haría feliz y más aún si os sumáis 💖✨", typingMs: 1800 },
      ],
      next: "start",
    },
    jarrys_saludo: {
      bot: [
        { text: "Jarrys, que eres tú!✨ Quería proponerte un plan, que puede o no incluir hablar de pokemon ZA 👀", typingMs: 1800 },
        { text: "pero que sí que me gustaría que te incluyera a ti y a toda tu crew 🥰", typingMs: 1800 },
      ],
      next: "start",
    },

    start: {
      bot: [
        { text: "me enrollo un montón, ¿sigues ahí? 🫪", typingMs: 1300 },
        { text: "en fin! que te iba a contar eso pero primero...", typingMs: 1700 },
        { text: "¿cómo estás? ¿va todo bien?", typingMs: 1200 },
      ],
      options: [
        { label: "muy bien ♥️", keywords: ["bien", "genial", "perfecto", "estupendo", "guay"], goto: "bien" },
        { label: "fatal, gracias 🙃", keywords: ["mal", "fatal", "regular", "meh", "cansada", "cansado"], goto: "mal" },
      ],
    },

    bien: {
      bot: [
        { text: "me alegro!!😍😍😍 porque igual así tienes energía para lo que voy a proponer", typingMs: 1600 },
      ],
      next: "pista",
    },

    mal: {
      bot: [
        { text: "VAIA. Espero que esto pueda animarte un poco al menos? 😭", typingMs: 1700 },
      ],
      next: "pista",
    },

    pista: {
      bot: [
        { text: "si estás en el mood...", typingMs: 1400 },
        { text: "¿sabes qué se celebra el {{event.date}}?", typingMs: 1800, nudge: true },
      ],
      options: [
        { label: "¿tu cumple 🎂🎉?", keywords: ["cumple", "cumpleaños", "cumpleanos", "birthday"], goto: "acertaste" },
        { label: "ni idea", keywords: ["no", "ni idea", "no se", "no sé", "nose"], goto: "pista2" },
      ],
    },

    pista2: {
      bot: [
        { text: "va sobre mí... y sobre celebrar estar viva 👻", typingMs: 1600 },
      ],
      options: [
        { label: "¡tu cumple 🎂🎉!", keywords: ["cumple", "cumpleaños", "cumpleanos", "birthday"], goto: "acertaste" },
        { label: "sigo sin tener ni idea", keywords: ["*"], goto: "pista3" },
      ],
    },

    // Si insiste en "ni idea" otra vez, vuelve a pista2 — así el
    // bucle pista2 ⇄ pista3 se puede repetir tantas veces como haga
    // falta, y "tu cumple" (en cualquiera de las dos) sale hacia
    // "acertaste" siempre.
    pista3: {
      bot: [
        { text: "¿En serio? Otra pista: soplaré 36 velas 🎂👀", typingMs: 1600 },
      ],
      options: [
        { label: "¡tu cumple 🎂🎉!", keywords: ["cumple", "cumpleaños", "cumpleanos", "birthday"], goto: "acertaste" },
        { label: "sigo sin tener ni idea", keywords: ["*"], goto: "pista2" },
      ],
    },

    acertaste: {
      bot: [
        { text: "¡yassss! ♥️", typingMs: 1100 },
        { text: "y me gustaría que te vinieras a celebrar conmigo", typingMs: 1400 },
        { text: "va a ser el {{event.date}}, a las {{event.time}}", typingMs: 1900 },
        { text: "en {{event.place}}", typingMs: 1500 },
        { text: "{{event.note}}", typingMs: 1800 },
      ],
      options: [
        { label: "cuenta conmigo ☺️", keywords: ["si", "sí", "alli", "allí", "estare", "estaré", "claro", "confirmo", "ahi", "ahí", "voy", "cuenta conmigo"], goto: "confirmado" },
        { label: "no voy a poder 🥲", keywords: ["no puedo", "no", "no voy a poder", "no voy"], goto: "insistir" },
      ],
    },

    insistir: {
      bot: [
        { text: "si te insisto, ¿valdría para algo? jajajaj", typingMs: 1700 },
      ],
      options: [
        { label: "de verdad no puedo", keywords: ["no puedo", "no voy", "imposible", "no podré", "de verdad no", "en serio no", "no"], goto: "noPasaNada" },
        { label: "vaaaaale, ahí estaré 🧐", keywords: ["*"], goto: "confirmado" },
      ],
    },

    // Salida real para quien de verdad no puede venir — antes esto
    // no existía y cualquier respuesta en "insistir" acababa
    // forzando "confirmado" como si hubiera dicho que sí.
    noPasaNada: {
      bot: [
        { text: "no te preocupes, celebramos otro día. ¡No nos vamos a perder de vista! ♥️✨", typingMs: 1600 },
      ],
    },

    confirmado: {
      bot: [
        { text: "VIVAAA! Nos vemos allí entonces 😎", typingMs: 1500 },
        { text: "confírmame vía 📲, ¡y nos vemos pronto! 💁🏻‍♀️", typingMs: 1700 },
      ],
      celebrate: true,
    },

  },

};

// No toques esta línea (conecta la configuración con la app)
window.MSN_CONFIG = MSN_CONFIG;
