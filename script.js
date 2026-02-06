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
//see how box closed on new calculation 
function resetSeeHow() {
  const howBox = document.getElementById("howBox");
  const seeHowBtn = document.getElementById("seeHowBtn");

  if (!howBox || !seeHowBtn) return;

  if (howBox.style.display === "block") {
    howBox.classList.add("closing");

    setTimeout(() => {
      howBox.style.display = "none";
      howBox.classList.remove("closing");
      seeHowBtn.classList.remove("open");
    }, 300);
  }
}


/* CONVERT */
function convert() {
  resetSeeHow();
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


document.addEventListener("click", event => {
  const link = event.target.closest("a");

  if (!link) return;

  const isExternal = link.href.startsWith("http") &&
                     !link.href.includes(window.location.origin);

  if (isExternal) {
    event.preventDefault();
    window.open(link.href, "_system");
  }
});

//see how button and logic 
/* ================================
   SEE HOW — FINAL FIX (WORKING)
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const seeHowBtn = document.getElementById("seeHowBtn");
  const howBox = document.getElementById("howBox");

  if (!seeHowBtn || !howBox) {
    console.error("See How elements not found");
    return;
  }

  howBox.style.display = "none";

  const DIGITS = "0123456789ABCDEF";

  function charToValue(c) {
    return DIGITS.indexOf(c.toUpperCase());
  }

  function valueToChar(v) {
    return DIGITS[v];
  }

  function explainToDecimal(num, base) {
    let html = `<strong>${base}-base → Decimal</strong><br><br>`;
    let sum = 0;

    const digits = num.toUpperCase().split("").reverse();

    digits.forEach((d, i) => {
      const val = charToValue(d);
      const part = val * Math.pow(base, i);
      sum += part;

      html += `
        <div class="step-row">
          (${d} × ${base}<sup>${i}</sup>) = <span class="hl">${part}</span>
        </div>
      `;
    });

    html += `<br><strong>Decimal = ${sum}<sub>10</sub></strong><br><br>`;
    return { sum, html };
  }

  function explainFromDecimal(decimal, base) {
    let html = `<strong>Decimal → ${base}-base</strong><br><br>`;
    let n = decimal;
    let result = "";

    if (n === 0) {
      return { result: "0", html };
    }

    while (n > 0) {
      const rem = n % base;
      const ch = valueToChar(rem);

      html += `
        <div class="step-row">
          ${n} ÷ ${base} = ${Math.floor(n / base)}
          <span class="remainder">${ch}</span>
        </div>
      `;

      result = ch + result;
      n = Math.floor(n / base);
    }

    html += `<br><strong>Result = ${result}<sub>${base}</sub></strong>`;
    return { result, html };
  }

  function buildExplanation(number, fromBase, toBase) {
    let html = "";
    let decimal = number;

    if (fromBase !== "10") {
      const toDec = explainToDecimal(number, parseInt(fromBase));
      html += toDec.html;
      decimal = toDec.sum;
    }

    if (toBase !== "10") {
      const fromDec = explainFromDecimal(decimal, parseInt(toBase));
      html += fromDec.html;
    }

    if (fromBase === toBase) {
      html = `<strong>No conversion needed.</strong><br>
              ${number}<sub>${fromBase}</sub>`;
    }

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
      howBox.style.display = "none";
      seeHowBtn.classList.remove("open");
    } else {
      howBox.innerHTML = buildExplanation(number, fromBase, toBaseValue);
      howBox.style.display = "block";
      seeHowBtn.classList.add("open");

      // layered animation
      requestAnimationFrame(() => {
        howBox.querySelectorAll(".step-row").forEach((row, i) => {
          setTimeout(() => row.classList.add("active"), i * 120);
        });
      });
    }
  });
});
