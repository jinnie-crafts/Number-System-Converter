/* ==========================
   GLOBAL CONSTANTS
========================== */

const DIGITS = "0123456789ABCDEF";

/* ==========================
   DOM REFERENCES
========================== */

const resultSection = document.getElementById("resultSection");
const resultBox = document.getElementById("resultBox");
const themeToggle = document.getElementById("themeToggle");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");
const toBase = document.getElementById("toBase");

/* ==========================
   THEME
========================== */

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

/* ==========================
   TOAST
========================== */

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* ==========================
   SWAP DISABLE
========================== */

toBase.addEventListener("change", () => {
  swapBtn.disabled = toBase.value === "all";
});

/* ==========================
   SWAP BASES
========================== */

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

/* ==========================
   VALIDATION (FIXED)
========================== */

function isValid(num, base) {
  const patterns = {
    2: /^[01]+(\.[01]+)?$/,
    8: /^[0-7]+(\.[0-7]+)?$/,
    10: /^[0-9]+(\.[0-9]+)?$/,
    16: /^[0-9a-fA-F]+(\.[0-9a-fA-F]+)?$/
  };
  return patterns[base].test(num);
}

/* ==========================
   NUMBER PARSING
========================== */

function parseNumber(input) {
  const [integer, fraction = ""] = input.toUpperCase().split(".");
  return { integer, fraction };
}

/* ==========================
   BASE → DECIMAL (FRACTION SAFE)
========================== */

function toDecimal(input, base) {
  const { integer, fraction } = parseNumber(input);
  let value = 0;

  for (let i = 0; i < integer.length; i++) {
    value +=
      DIGITS.indexOf(integer[i]) *
      Math.pow(base, integer.length - 1 - i);
  }

  for (let i = 0; i < fraction.length; i++) {
    value +=
      DIGITS.indexOf(fraction[i]) *
      Math.pow(base, -(i + 1));
  }

  return value;
}

/* ==========================
   DECIMAL → BASE (FRACTION SAFE)
========================== */

function fromDecimal(decimal, base, precision = 7) {
  let intPart = Math.floor(decimal);
  let fracPart = decimal - intPart;

  let intResult = "";
  if (intPart === 0) intResult = "0";
  while (intPart > 0) {
    intResult = DIGITS[intPart % base] + intResult;
    intPart = Math.floor(intPart / base);
  }

  let fracResult = "";
  let count = 0;
  while (fracPart > 0 && count < precision) {
    fracPart *= base;
    const digit = Math.floor(fracPart);
    fracResult += DIGITS[digit];
    fracPart -= digit;
    count++;
  }

  return fracResult ? `${intResult}.${fracResult}` : intResult;
}

/* ==========================
   RESULT FORMAT
========================== */

function formatResult(value, base) {
  return `( ${value} )<sub>${base}</sub>`;
}

/* ==========================
   RESET SEE HOW
========================== */

function closeSeeHow(animated = true) {
  const howBox = document.getElementById("howBox");
  const seeHowBtn = document.getElementById("seeHowBtn");

  if (!howBox || !seeHowBtn) return;
  if (howBox.style.display !== "block") return;

  if (animated) {
    howBox.classList.add("closing");
    setTimeout(() => {
      howBox.style.display = "none";
      howBox.classList.remove("closing");
      seeHowBtn.classList.remove("open");
    }, 300);
  } else {
    howBox.style.display = "none";
    seeHowBtn.classList.remove("open");
  }
}

function resetSeeHow() {
  closeSeeHow(true);
}

/* ==========================
   CONVERT
========================== */

function convert() {
  resetSeeHow();

  const number = document.getElementById("numberInput").value.trim();
  const fromBase = document.getElementById("fromBase").value;
  const toBaseValue = toBase.value;

  if (!number || !isValid(number, fromBase)) {
    showToast("Invalid number for selected base");
    return;
  }

  const decimal = toDecimal(number, parseInt(fromBase));
  let output = "";

  if (toBaseValue === "all") {
    output += `Binary: ${formatResult(fromDecimal(decimal, 2), 2)}<br>`;
    output += `Decimal: ${formatResult(decimal.toString(), 10)}<br>`;
    output += `Octal: ${formatResult(fromDecimal(decimal, 8), 8)}<br>`;
    output += `Hexadecimal: ${formatResult(fromDecimal(decimal, 16), 16)}`;
  } else {
    output = formatResult(
      fromDecimal(decimal, parseInt(toBaseValue)),
      toBaseValue
    );
  }

  resultBox.innerHTML = output;
  resultSection.style.display = "block";

  resultSection.classList.add("glow");
  setTimeout(() => resultSection.classList.remove("glow"), 1200);

  resultSection.scrollIntoView({ behavior: "smooth" });
}

/* ==========================
   COPY
========================== */

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

/* ==========================
   LOGO RIPPLE
========================== */

const logoImg = document.querySelector(".logo img");
if (logoImg) {
  logoImg.addEventListener("click", () => {
    logoImg.classList.remove("ripple");
    void logoImg.offsetWidth;
    logoImg.classList.add("ripple");
  });
}

/* ==========================
   EXTERNAL LINKS
========================== */

document.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link) return;

  const isExternal =
    link.href.startsWith("http") &&
    !link.href.includes(window.location.origin);

  if (isExternal) {
    event.preventDefault();
    window.open(link.href, "_system");
  }
});

/* ==========================
   SEE HOW EXPLANATION (PHASE 1 FIXED)
========================== */

document.addEventListener("DOMContentLoaded", () => {
  const seeHowBtn = document.getElementById("seeHowBtn");
  const howBox = document.getElementById("howBox");

  if (!seeHowBtn || !howBox) return;

  function explainIntegerPart(n, base) {
    if (n === 0) {
      return {
        steps: `<strong>Integer part:</strong><br>0<sub>${base}</sub><br><br>`,
        result: "0"
      };
    }

    let steps = `<strong>Integer part:</strong><br>`;
    let remainders = [];

    while (n > 0) {
      const r = n % base;
      steps += `${n} ÷ ${base} = ${Math.floor(n / base)} remainder <b>${r}</b><br>`;
      remainders.unshift(r);
      n = Math.floor(n / base);
    }

    steps += `<br>Integer result = ${remainders.join("")}<sub>${base}</sub><br><br>`;
    return { steps, result: remainders.join("") };
  }

  function explainFractionPart(frac, base, precision = 7) {
    let steps = `<strong>Fractional part:</strong><br>`;
    let digits = "";
    let count = 0;

    while (frac > 0 && count < precision) {
      const prev = frac;
      frac *= base;
      const digit = Math.floor(frac);
      steps += `${prev.toFixed(6)} × ${base} = ${frac.toFixed(6)} → <b>${digit}</b><br>`;
      digits += digit;
      frac -= digit;
      count++;
    }

    steps += `<br>Fraction result = .${digits}<br><br>`;
    return { steps, result: digits };
  }

  function explainDecimalToBase(decimal, base) {
  if (base === 10) {
    return `<strong>No conversion needed.</strong><br>${decimal}<sub>10</sub>`;
  }

  let html = `<strong>Decimal → ${base}-base</strong><br><br>`;

  const intPart = Math.floor(decimal);
  const fracPart = decimal - intPart;

  const intExp = explainIntegerPart(intPart, base);
  html += intExp.steps;

  let fracResult = "";
  if (fracPart > 0) {
    const fracExp = explainFractionPart(fracPart, base);
    fracResult = fracExp.result;
    html += fracExp.steps;
  }

  // 🔥 FINAL RESULT (NEW)
  const finalValue =
    fracResult
      ? `${intExp.result}.${fracResult}`
      : intExp.result;

  html += `
    <div class="final-result">
      Final Result = 
      <span class="final-value">
        ( ${finalValue} )<sub>${base}</sub>
      </span>
    </div>
  `;

  return html;
}


  seeHowBtn.addEventListener("click", () => {
    const number = document.getElementById("numberInput").value.trim();
    const fromBase = document.getElementById("fromBase").value;
    const toBaseValue = document.getElementById("toBase").value;

    if (!number) {
      howBox.innerHTML = "Enter a number first.";
      howBox.style.display = "block";
      return;
    }

    const open = howBox.style.display === "block";

    if (open) {
      closeSeeHow(true);
    } else {
      const decimal = toDecimal(number, parseInt(fromBase));
      howBox.innerHTML = explainDecimalToBase(decimal, parseInt(toBaseValue));
      howBox.style.display = "block";
      seeHowBtn.classList.add("open");

      requestAnimationFrame(() => {
        howBox.querySelectorAll(".step-row").forEach((row, i) => {
          setTimeout(() => row.classList.add("active"), i * 120);
        });
      });
    }
  });
});
