const fs = require('fs');
const path = require('path');

function buildSingleHtml() {
  const distHtmlPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (!fs.existsSync(distHtmlPath)) {
    console.error('dist/index.html does not exist. Run vite build first.');
    process.exit(1);
  }

  const html = fs.readFileSync(distHtmlPath, 'utf8');

  // Extract <style> and other head elements
  const s_start = html.indexOf('<script');
  const s_tag_end = html.indexOf('>', s_start);
  const s_end = html.lastIndexOf('</script>');

  const headAndBefore = html.slice(0, s_start);
  let code = html.slice(s_tag_end + 1, s_end);
  const post = html.slice(s_end + 9);

  // Replace import.meta.url so it is a 100% standard JS script that does not require type="module"
  // (type="module" is blocked by Android Chrome on content:// and file:// URIs)
  code = code.replaceAll('import.meta.url', '(typeof document !== "undefined" ? document.baseURI : "")');

  // Encode the entire bundle into Base64 so that strings containing </html>, </body>, </script>
  // will NEVER be parsed by the browser HTML parser prematurely.
  const b64 = Buffer.from(code, 'utf8').toString('base64');

  const safeLauncher = `
    <script>
      (function() {
        try {
          var b64 = "${b64}";
          var bin = atob(b64);
          var bytes = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          var code = new TextDecoder("utf-8").decode(bytes);
          var s = document.createElement("script");
          s.text = code;
          document.body.appendChild(s);
        } catch (err) {
          console.error("Erro ao inicializar Sistema Fábrica PRO:", err);
          document.body.innerHTML = '<div style="padding:24px;font-family:sans-serif;background:#fee2e2;color:#991b1b;border-radius:12px;margin:20px;border:1px solid #f87171;">' +
            '<h2 style="margin:0 0 8px 0;font-size:18px;">Erro ao carregar o sistema</h2>' +
            '<p style="margin:0;font-size:14px;">' + (err && err.message ? err.message : String(err)) + '</p>' +
            '</div>';
        }
      })();
    </script>
  `;

  const finalHtml = headAndBefore + safeLauncher + post;

  const publicOut = path.join(__dirname, '..', 'public', 'sistema_fabrica_pro.html');
  fs.writeFileSync(publicOut, finalHtml, 'utf8');

  console.log('Build single HTML completed successfully!');
  console.log('Output size:', (finalHtml.length / 1024 / 1024).toFixed(2), 'MB');
}

buildSingleHtml();
