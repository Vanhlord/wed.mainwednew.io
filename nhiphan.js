// ------------------- NHỊ PHÂN -------------------
const input = document.getElementById('inputText');
const output = document.getElementById('output');

function textToBinary(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

function binaryToText(binary) {
  const bytes = binary.split(' ').map(b => parseInt(b, 2));
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

document.getElementById('convertToBinary').addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return output.innerText = '⚠️ Nhập chữ vô đi nè!';
  output.innerText = textToBinary(text);
});

document.getElementById('convertToText').addEventListener('click', () => {
  const binary = input.value.trim();
  if (!binary) return output.innerText = '⚠️ Nhập mã nhị phân vô đi nha!';
  try {
    output.innerText = binaryToText(binary);
  } catch {
    output.innerText = '❌ Sai định dạng nhị phân rồi á!';
  }
});


// ------------------- MORSE -------------------
const morseInput = document.getElementById('morseInput');
const morseOutput = document.getElementById('morseOutput');

const morseCode = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
  'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const textToMorse = (text) => {
  const cleanText = removeVietnameseTones(text.toUpperCase());
  return cleanText.split('').map(ch => morseCode[ch] || '').join(' ');
};

const morseToText = (morse) => {
  const reverseMap = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));
  return morse.trim().split(' ').map(code => reverseMap[code] || '').join('');
};

document.getElementById('textToMorse').addEventListener('click', () => {
  const text = morseInput.value.trim();
  if (!text) return morseOutput.innerText = '⚠️ Nhập chữ vô đi nè!';
  morseOutput.innerText = textToMorse(text);
});

document.getElementById('morseToText').addEventListener('click', () => {
  const code = morseInput.value.trim();
  if (!code) return morseOutput.innerText = '⚠️ Nhập mã Morse vô đi nha!';
  morseOutput.innerText = morseToText(code);
});


// ------------------- CÁC LOẠI MÃ KHÁC -------------------

// ===== ASCII =====
function textToASCII(text) {
  return text.split('').map(c => c.charCodeAt(0)).join(' ');
}
function asciiToText(ascii) {
  return ascii.split(' ').map(c => String.fromCharCode(c)).join('');
}

// ===== HEX =====
function textToHex(text) {
  return text.split('').map(c => c.charCodeAt(0).toString(16)).join(' ');
}
function hexToText(hex) {
  return hex.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
}

// ===== BASE64 ===== (phiên bản chuẩn không lỗi)
function textToBase64(text) {
  return btoa(new TextEncoder().encode(text).reduce((a, b) => a + String.fromCharCode(b), ''));
}
function base64ToText(b64) {
  return new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)));
}

// ===== CAESAR CIPHER =====
function caesarEncrypt(text, shift = 3) {
  return text.replace(/[a-z]/gi, c => {
    const base = c === c.toLowerCase() ? 97 : 65;
    return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base);
  });
}
function caesarDecrypt(text, shift = 3) {
  return caesarEncrypt(text, 26 - shift);
}

// ===== ROT13 =====
function rot13(text) {
  return text.replace(/[a-z]/gi, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// ===== ATBASH =====
function atbash(text) {
  return text.replace(/[a-z]/gi, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(25 - (c.charCodeAt(0) - base) + base);
  });
}

// ===== SGA (Standard Galactic Alphabet – Enchant Minecraft) =====
const sgaMap = {
  a: 'ᔑ', b: 'ʖ', c: 'ᓵ', d: '↸', e: 'ᒷ', f: '⎓', g: '⊣',
  h: '⍑', i: '╎', j: '⋮', k: 'ꖌ', l: 'ꖎ', m: 'ᒲ', n: 'リ',
  o: '𝙹', p: '!¡', q: 'ᑑ', r: '∷', s: 'ᓭ', t: 'ℸ', u: '⚍',
  v: '⍊', w: '∴', x: '·/', y: '||', z: '⨅'
};

function textToSGA(text) {
  return text.toLowerCase().split('').map(c => sgaMap[c] || c).join('');
}

function sgaToText(sga) {
  const reverse = Object.fromEntries(Object.entries(sgaMap).map(([k, v]) => [v, k]));
  let result = '';
  for (let symbol of sga.split('')) {
    result += reverse[symbol] || symbol;
  }
  return result;
}


// ===== GẮN VÀO NÚT XỬ LÝ =====
function encode(type) {
  let input = document.getElementById(`${type}Input`).value;
  let output = '';

  switch(type) {
    case 'ascii': output = textToASCII(input); break;
    case 'hex': output = textToHex(input); break;
    case 'base64': output = textToBase64(input); break;
    case 'caesar':
      const shiftE = parseInt(document.getElementById('shiftValue').value || 3);
      output = caesarEncrypt(input, shiftE);
      break;
    case 'rot13': output = rot13(input); break;
    case 'atbash': output = atbash(input); break;
    case 'sga': output = textToSGA(input); break;
  }

  document.getElementById(`${type}Output`).value = output;
}

function decode(type) {
  let input = document.getElementById(`${type}Output`).value;
  let output = '';

  switch(type) {
    case 'ascii': output = asciiToText(input); break;
    case 'hex': output = hexToText(input); break;
    case 'base64': output = base64ToText(input); break;
    case 'caesar':
      const shiftD = parseInt(document.getElementById('shiftValue').value || 3);
      output = caesarDecrypt(input, shiftD);
      break;
    case 'rot13': output = rot13(input); break;
    case 'atbash': output = atbash(input); break;
    case 'sga': output = sgaToText(input); break;
  }

  document.getElementById(`${type}Input`).value = output;
}


// ===== COPY NÚT (phiên bản hiện đại) =====
async function copyText(id) {
  const text = document.getElementById(id).value;
  try {
    await navigator.clipboard.writeText(text);
    alert("✨ Đã copy xong rồi đó nha!");
  } catch (err) {
    alert("❌ Không thể copy, thử lại đi nè!");
  }
}


