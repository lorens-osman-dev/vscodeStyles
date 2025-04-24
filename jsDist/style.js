// src/ts/style.ts
//! go to house
document.addEventListener("DOMContentLoaded", () => {
  const commentColor = "blue";
  const editorSelector = ".monaco-editor";
  function highlightCommentLines(targetNode) {
    if (!(targetNode instanceof Element || targetNode instanceof Document || targetNode instanceof DocumentFragment)) {
      console.warn("Target node for highlightCommentLines is not an Element, Document, or DocumentFragment.");
      return;
    }
    const viewLines = targetNode.querySelectorAll(".view-line");
    viewLines.forEach((line) => {
      const firstInnerSpan = line.querySelector("span > span");
      if (firstInnerSpan) {
        const isComment = (firstInnerSpan.textContent ?? "").trim().startsWith("//");
        const commentType = getCommentType(firstInnerSpan.textContent ?? "");
        const allInnerSpans = line.querySelectorAll("span > span");
        allInnerSpans.forEach((innerSpan) => {
          if (isComment) {
            if (innerSpan.style.color !== commentColor) {
              if (commentType) {
                innerSpan.classList.add(commentType);
              }
            }
          } else {
            if (innerSpan.style.color === commentColor) {
              innerSpan.style.color = "";
            }
          }
        });
      }
    });
  }
  const targetEditor = document.querySelector(editorSelector) || document.body;
  const config = { childList: true, subtree: true };
  const callback = (mutationsList, observer2) => {
    highlightCommentLines(targetEditor);
  };
  const observer = new MutationObserver(callback);
  if (targetEditor instanceof Node) {
    observer.observe(targetEditor, config);
  } else {
    console.error("Could not find a valid target node to observe.");
  }
  highlightCommentLines(targetEditor);
});
var commentTypes = {
  qusestitMark: "?",
  dash: "-",
  equal: "=",
  underscore: "_",
  sayMark: ":",
  dot: ".",
  sharp: "#"
};
function getCommentType(commentTextOp) {
  const trimmed = commentTextOp.trim();
  if (commentTextOp === "" || commentTextOp.trim() === "" || commentTextOp.trim().length < 3) {
    return;
  }
  if (trimmed.length < 3)
    return;
  const thirdChar = trimmed[2];
  for (const [key, value] of Object.entries(commentTypes)) {
    if (thirdChar === value) {
      return key;
    }
  }
  return;
}
