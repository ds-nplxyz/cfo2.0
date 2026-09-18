export function encodeDocumentPath(path) {
  return encodeURIComponent(path);
}

export function chooseEditorMode(path, content) {
  const advanced = /```(?:mermaid|sql|plantuml)|:::|\$\$/.test(content) || /\.(sql|mmd)$/i.test(path);
  return advanced ? 'raw' : 'visual';
}
