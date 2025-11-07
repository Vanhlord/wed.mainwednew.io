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
  const cleanText = removeVietnameseTones(text.toLowerCase());
  return cleanText.split('').map(c => sgaMap[c] || c).join('');
}

function sgaToText(sga) {
  const reverse = Object.fromEntries(Object.entries(sgaMap).map(([k, v]) => [v, k]));
  // Sắp xếp theo độ dài giảm dần để ưu tiên ký tự dài
  const sortedKeys = Object.keys(reverse).sort((a, b) => b.length - a.length);
  let result = '';
  let i = 0;
  while (i < sga.length) {
    let found = false;
    for (let key of sortedKeys) {
      if (sga.startsWith(key, i)) {
        result += reverse[key];
        i += key.length;
        found = true;
        break;
      }
    }
    if (!found) {
      result += sga[i];
      i++;
    }
  }
  return result;
}


// ===== ASCII =====
document.getElementById('textToAscii').addEventListener('click', () => {
  const input = document.getElementById('asciiInput').value.trim();
  if (!input) return document.getElementById('asciiOutput').innerText = '⚠️ Nhập chữ vô đi nè!';
  document.getElementById('asciiOutput').innerText = textToASCII(input);
});

document.getElementById('asciiToText').addEventListener('click', () => {
  const input = document.getElementById('asciiInput').value.trim();
  if (!input) return document.getElementById('asciiOutput').innerText = '⚠️ Nhập mã ASCII vô đi nha!';
  try {
    document.getElementById('asciiOutput').innerText = asciiToText(input);
  } catch {
    document.getElementById('asciiOutput').innerText = '❌ Sai định dạng ASCII rồi á!';
  }
});

// ===== HEX =====
document.getElementById('textToHex').addEventListener('click', () => {
  const input = document.getElementById('hexInput').value.trim();
  if (!input) return document.getElementById('hexOutput').innerText = '⚠️ Nhập chữ vô đi nè!';
  document.getElementById('hexOutput').innerText = textToHex(input);
});

document.getElementById('hexToText').addEventListener('click', () => {
  const input = document.getElementById('hexInput').value.trim();
  if (!input) return document.getElementById('hexOutput').innerText = '⚠️ Nhập mã hex vô đi nha!';
  try {
    document.getElementById('hexOutput').innerText = hexToText(input);
  } catch {
    document.getElementById('hexOutput').innerText = '❌ Sai định dạng hex rồi á!';
  }
});

// ===== BASE64 =====
document.getElementById('textToBase64').addEventListener('click', () => {
  const input = document.getElementById('base64Input').value.trim();
  if (!input) return document.getElementById('base64Output').innerText = '⚠️ Nhập chữ vô đi nè!';
  try {
    document.getElementById('base64Output').innerText = textToBase64(input);
  } catch {
    document.getElementById('base64Output').innerText = '❌ Lỗi chuyển đổi Base64!';
  }
});

document.getElementById('base64ToText').addEventListener('click', () => {
  const input = document.getElementById('base64Input').value.trim();
  if (!input) return document.getElementById('base64Output').innerText = '⚠️ Nhập mã Base64 vô đi nha!';
  try {
    document.getElementById('base64Output').innerText = base64ToText(input);
  } catch {
    document.getElementById('base64Output').innerText = '❌ Sai định dạng Base64 rồi á!';
  }
});



// ===== ROT13 =====
document.getElementById('textToRot13').addEventListener('click', () => {
  const input = document.getElementById('rot13Input').value.trim();
  if (!input) return document.getElementById('rot13Output').innerText = '⚠️ Nhập chữ vô đi nè!';
  document.getElementById('rot13Output').innerText = rot13(input);
});

document.getElementById('rot13ToText').addEventListener('click', () => {
  const input = document.getElementById('rot13Input').value.trim();
  if (!input) return document.getElementById('rot13Output').innerText = '⚠️ Nhập mã ROT13 vô đi nha!';
  document.getElementById('rot13Output').innerText = rot13(input);
});

// ===== ATBASH =====
document.getElementById('textToAtbash').addEventListener('click', () => {
  const input = document.getElementById('atbashInput').value.trim();
  if (!input) return document.getElementById('atbashOutput').innerText = '⚠️ Nhập chữ vô đi nè!';
  document.getElementById('atbashOutput').innerText = atbash(input);
});

document.getElementById('atbashToText').addEventListener('click', () => {
  const input = document.getElementById('atbashInput').value.trim();
  if (!input) return document.getElementById('atbashOutput').innerText = '⚠️ Nhập mã Atbash vô đi nha!';
  document.getElementById('atbashOutput').innerText = atbash(input);
});

// ===== SGA =====
document.getElementById('textToSGA').addEventListener('click', () => {
  const input = document.getElementById('sgaInput').value.trim();
  if (!input) return document.getElementById('sgaOutput').innerText = '⚠️ Nhập chữ vô đi nè!';
  document.getElementById('sgaOutput').innerText = textToSGA(input);
});

document.getElementById('sgaToText').addEventListener('click', () => {
  const input = document.getElementById('sgaInput').value.trim();
  if (!input) return document.getElementById('sgaOutput').innerText = '⚠️ Nhập mã SGA vô đi nha!';
  document.getElementById('sgaOutput').innerText = sgaToText(input);
});


