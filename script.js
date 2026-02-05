const resultSection = document.getElementById("resultSection");
const resultBox = document.getElementById("resultBox");
const themeToggle = document.getElementById("themeToggle");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");
const toBase = document.getElementById("toBase");

/* THEME */
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

/* TOAST */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* DISABLE SWAP WHEN CONVERT TO ALL */
toBase.addEventListener("change", () => {
  swapBtn.disabled = toBase.value === "all";
});

/* SWAP WITH ANIMATION */
function swapBases() {
  if (toBase.value === "all") return;

  const from = document.getElementById("fromBase");
  const to = document.getElementById("toBase");
  const fromField = document.getElementById("fromField");
  const toField = document.getElementById("toField");

  fromField.classList.add("swap-anim");
  toField.classList.add("swap-anim");

  setTimeout(() => {
    [from.value, to.value] = [to.value, from.value];
    fromField.classList.remove("swap-anim");
    toField.classList.remove("swap-anim");
  }, 300);
}

/* VALIDATION */
function isValid(num, base) {
  const patterns = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-fA-F]+$/
  };
  return patterns[base].test(num);
}

function formatResult(value, base) {
  return `( ${value} )<sub>${base}</sub>`;
}

/* CONVERT */
function convert() {
  const number = document.getElementById("numberInput").value.trim();
  const fromBase = document.getElementById("fromBase").value;
  const toBaseValue = toBase.value;

  if (!number || !isValid(number, fromBase)) {
    showToast("Invalid number for selected base");
    return;
  }

  const decimal = parseInt(number, fromBase);
  let output = "";

  if (toBaseValue === "all") {
    output += `Binary: ${formatResult(decimal.toString(2), 2)}<br>`;
    output += `Decimal: ${formatResult(decimal.toString(10), 10)}<br>`;
    output += `Octal: ${formatResult(decimal.toString(8), 8)}<br>`;
    output += `Hexadecimal: ${formatResult(decimal.toString(16).toUpperCase(), 16)}`;
  } else {
    output = formatResult(decimal.toString(toBaseValue).toUpperCase(), toBaseValue);
  }

  resultBox.innerHTML = output;
  resultSection.style.display = "block";

  resultSection.classList.add("glow");
  setTimeout(() => resultSection.classList.remove("glow"), 1200);

  resultSection.scrollIntoView({ behavior: "smooth" });
}

/* COPY */
function copyResult() {
  const text = resultBox.innerText.trim();
  if (!text) return;

  const temp = document.createElement("textarea");
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);

  copyBtn.classList.add("copied");
  showToast("Result copied!");

  setTimeout(() => copyBtn.classList.remove("copied"), 1500);
}


const logoImg = document.querySelector(".logo img");

logoImg.addEventListener("click", () => {
  logoImg.classList.remove("ripple");
  void logoImg.offsetWidth;
  logoImg.classList.add("ripple");
});
