# Versão em inglês

O jogo é escrito em português. `js/en.js` traz o dicionário português → inglês e `js/i18n.js` troca as frases na tela e no canvas quando o idioma é inglês.

- `en1.txt` a `en4.txt`: uma frase por linha, `português => inglês`.
- `python3 tools/i18n/ext.py site` (de fora da pasta site) lista as frases do código em `segs.json`, para achar o que falta traduzir.
- `python3 tools/i18n/build.py .` (de dentro de site, na pasta tools/i18n) gera `js/en.js`.
