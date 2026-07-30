<%*
const activeFile = app.workspace.getActiveFile();
const content = await app.vault.read(activeFile);

// Odstráni frontmatter blok, zostane len telo článku
const body = content.replace(/^---[\s\S]*?---/, "").trim();

// Odstráni markdown syntax, nech ostane čistý text
function stripMarkdown(text) {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")           // obrázky
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")      // linky -> ponechá len text
    .replace(/^#{1,6}\s+/gm, "")                // nadpisy
    .replace(/(\*\*|__)(.*?)\1/g, "$2")          // tučné
    .replace(/(\*|_)(.*?)\1/g, "$2")             // kurzíva
    .replace(/`{1,3}[^`]*`{1,3}/g, "")           // kód
    .replace(/>\s?/g, "")                        // citácie
    .replace(/\n+/g, " ")
    .trim();
}

const plain = stripMarkdown(body);

// Skráti na ~160 znakov, ale nezoseká slovo napoly
function truncate(text, maxLen = 160) {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

const description = truncate(plain);

await app.fileManager.processFrontMatter(activeFile, (fm) => {
  fm.description = description;
});

new Notice("Description nastavený: " + description);
-%>