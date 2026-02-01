function base32tohex(base32) {
  let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  base32 = base32.replace(/=+$/, "");
  for (let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += val.toString(2).padStart(5, '0');
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    let chunk = bits.substr(i, 4);
    hex += parseInt(chunk, 2).toString(16);
  }
  return hex;
}

function gen() {
  let key = document.getElementById("secret").value.trim();
  if (!key) return;

  let epoch = Math.floor(Date.now() / 1000);
  let time = Math.floor(epoch / 30).toString(16).padStart(16, '0');
  let hmac = CryptoJS.HmacSHA1(CryptoJS.enc.Hex.parse(time), CryptoJS.enc.Hex.parse(base32tohex(key)));
  let offset = hmac.words[hmac.words.length - 1] & 0xf;
  let code = (hmac.words[offset] & 0x7fffffff) % 1000000;

  code = code.toString().padStart(6, "0");

  document.getElementById("code").innerText = code;
  navigator.clipboard.writeText(code);
  document.getElementById("msg").innerText = "Code copied ✅";
}

setInterval(()=>{
  let t = 30 - Math.floor(Date.now()/1000)%30;
  document.getElementById("time").innerText = t;
},1000);