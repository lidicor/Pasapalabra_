const ROSCO_ITEMS = [
  { letter: "A", mode: "empieza", clue: "Insecto amarillo y negro que hace miel.", answer: "abeja" },
  { letter: "B", mode: "empieza", clue: "Juguete redondo que bota y sirve para jugar al fútbol.", answer: "balón" },
  { letter: "C", mode: "empieza", clue: "Lugar donde vivimos con nuestra familia.", answer: "casa" },
  { letter: "D", mode: "empieza", clue: "Animal enorme y muy antiguo que ya no existe.", answer: "dinosaurio" },
  { letter: "E", mode: "empieza", clue: "Animal gris muy grande con trompa larga y orejas enormes.", answer: "elefante" },
  { letter: "F", mode: "empieza", clue: "Planta de colores bonitos que huele muy bien.", answer: "flor" },
  { letter: "G", mode: "empieza", clue: "Mascota peluda que hace miau.", answer: "gato" },
  { letter: "H", mode: "empieza", clue: "Postre frío y dulce que se come en cucurucho o tarrina.", answer: "helado" },
  { letter: "I", mode: "empieza", clue: "Tierra rodeada de agua por todas partes.", answer: "isla" },
  { letter: "J", mode: "empieza", clue: "Animal amarillo con manchas y el cuello larguísimo.", answer: "jirafa" },
  { letter: "K", mode: "empieza", clue: "Fruta peluda por fuera y verde por dentro.", answer: "kiwi" },
  { letter: "L", mode: "empieza", clue: "Brilla en el cielo por la noche cuando dormimos.", answer: "luna" },
  { letter: "M", mode: "empieza", clue: "Fruta roja o verde muy rica y crujiente.", answer: "manzana" },
  { letter: "N", mode: "empieza", clue: "Es blanca, esponjosa y flota en el cielo.", answer: "nube" },
  { letter: "Ñ", mode: "contiene", clue: "Animal pequeño de ocho patas que hace telarañas.", answer: "araña" },
  { letter: "O", mode: "empieza", clue: "Animal grande y peludo al que le encanta la miel.", answer: "oso" },
  { letter: "P", mode: "empieza", clue: "Mascota fiel que mueve la cola y hace guau.", answer: "perro" },
  { letter: "Q", mode: "empieza", clue: "Alimento amarillo hecho con leche que les encanta a los ratones.", answer: "queso" },
  { letter: "R", mode: "empieza", clue: "Animalito pequeño de orejas redondas y cola larga.", answer: "ratón" },
  { letter: "S", mode: "empieza", clue: "Nos da luz y calor durante todo el día.", answer: "sol" },
  { letter: "T", mode: "empieza", clue: "Animal verde que camina muy despacio y lleva su casa a cuestas.", answer: "tortuga" },
  { letter: "U", mode: "empieza", clue: "Fruta pequeña y redonda que crece en racimos.", answer: "uva" },
  { letter: "V", mode: "empieza", clue: "Animal de granja con manchas que da leche y hace muu.", answer: "vaca" },
  { letter: "W", mode: "empieza", clue: "Deporte acuático que se hace sobre una tabla con vela.", answer: "windsurf" },
  { letter: "X", mode: "empieza", clue: "Instrumento musical de colores que se toca con palillos.", answer: "xilófono" },
  { letter: "Y", mode: "empieza", clue: "Juguete redondo con una cuerda que sube y baja.", answer: "yoyó" },
  { letter: "Z", mode: "empieza", clue: "Verdura naranja y alargada que les encanta a los conejos.", answer: "zanahoria" },
];

let statuses = ROSCO_ITEMS.map(() => "pending");
let currentIndex = 0;

const roscoEl = document.getElementById("rosco");
const roscoLabelEl = document.getElementById("rosco-label");
const roscoActiveLetterEl = document.getElementById("rosco-active-letter");
const roscoFinishedTitleEl = document.getElementById("rosco-finished-title");
const scoreCorrectEl = document.getElementById("score-correct");
const scoreWrongEl = document.getElementById("score-wrong");
const scorePendingEl = document.getElementById("score-pending");
const playPanelEl = document.getElementById("play-panel");
const endPanelEl = document.getElementById("end-panel");
const clueModeEl = document.getElementById("clue-mode");
const clueTextEl = document.getElementById("clue-text");
const answerFormEl = document.getElementById("answer-form");
const answerInputEl = document.getElementById("rosco-answer");
const passBtnEl = document.getElementById("pass-btn");
const restartBtnEl = document.getElementById("restart-btn");
const feedbackEl = document.getElementById("feedback");
const finalCorrectEl = document.getElementById("final-correct");
const finalTotalEl = document.getElementById("final-total");

const bubbleEls = ROSCO_ITEMS.map((item, index) => {
  const angle = (index / ROSCO_ITEMS.length) * 2 * Math.PI - Math.PI / 2;
  const x = 50 + 43.5 * Math.cos(angle);
  const y = 50 + 43.5 * Math.sin(angle);
  const el = document.createElement("div");
  el.className = "rosco-bubble pending";
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
  el.textContent = item.letter;
  roscoEl.appendChild(el);
  return el;
});

function normalizeAnswer(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getNextPendingIndex(fromIndex) {
  const total = statuses.length;
  for (let step = 1; step <= total; step++) {
    const idx = (fromIndex + step) % total;
    if (statuses[idx] === "pending") return idx;
  }
  return -1;
}

function showFeedback(kind, message) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${kind}`;
}

function render() {
  const correctCount = statuses.filter((s) => s === "correct").length;
  const wrongCount = statuses.filter((s) => s === "wrong").length;
  const pendingCount = statuses.length - correctCount - wrongCount;

  scoreCorrectEl.textContent = `${correctCount} bien`;
  scoreWrongEl.textContent = `${wrongCount} mal`;
  scorePendingEl.textContent = `${pendingCount} faltan`;

  bubbleEls.forEach((el, index) => {
    const status = statuses[index];
    el.className = `rosco-bubble ${index === currentIndex ? "active" : status}`;
  });

  if (currentIndex === -1) {
    roscoLabelEl.classList.add("hidden");
    roscoActiveLetterEl.classList.add("hidden");
    roscoFinishedTitleEl.classList.remove("hidden");
    playPanelEl.classList.add("hidden");
    endPanelEl.classList.remove("hidden");
    finalCorrectEl.textContent = String(correctCount);
    finalTotalEl.textContent = String(ROSCO_ITEMS.length);
    return;
  }

  const item = ROSCO_ITEMS[currentIndex];
  roscoLabelEl.classList.remove("hidden");
  roscoActiveLetterEl.classList.remove("hidden");
  roscoFinishedTitleEl.classList.add("hidden");
  roscoActiveLetterEl.textContent = item.letter;

  playPanelEl.classList.remove("hidden");
  endPanelEl.classList.add("hidden");
  clueModeEl.textContent =
    item.mode === "empieza" ? `Empieza por la ${item.letter}` : `Contiene la ${item.letter}`;
  clueTextEl.textContent = item.clue;
}

answerFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  if (currentIndex === -1) return;

  const raw = answerInputEl.value.trim();
  if (!raw) {
    showFeedback("neutral", "Escribe una palabra o pulsa Pasapalabra.");
    answerInputEl.focus();
    return;
  }

  const item = ROSCO_ITEMS[currentIndex];
  const isCorrect = normalizeAnswer(raw) === normalizeAnswer(item.answer);
  statuses[currentIndex] = isCorrect ? "correct" : "wrong";

  showFeedback(
    isCorrect ? "correct" : "wrong",
    isCorrect
      ? `¡Muy bien! Era "${item.answer}".`
      : `¡Casi! La palabra era "${item.answer}".`,
  );

  answerInputEl.value = "";
  currentIndex = getNextPendingIndex(currentIndex);
  render();
  answerInputEl.focus();
});

passBtnEl.addEventListener("click", () => {
  if (currentIndex === -1) return;
  const item = ROSCO_ITEMS[currentIndex];
  showFeedback("neutral", `Pasapalabra en la ${item.letter}. ¡La dejamos para luego!`);
  answerInputEl.value = "";
  currentIndex = getNextPendingIndex(currentIndex);
  render();
  answerInputEl.focus();
});

restartBtnEl.addEventListener("click", () => {
  statuses = ROSCO_ITEMS.map(() => "pending");
  currentIndex = 0;
  answerInputEl.value = "";
  feedbackEl.className = "feedback hidden";
  render();
  answerInputEl.focus();
});

render();
