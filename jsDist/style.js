// src/ts/highlightCommentLines.ts
var commentColor = "teal";
var commentTypes = {
  qusestitMark: "?",
  dash: "-",
  equal: "=",
  underscore: "_",
  sayMark: ":",
  dot: ".",
  sharp: "#",
  imark: "!"
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

// src/ts/tabsDot.ts
function tabsDot(targetNode) {
  if (!(targetNode instanceof Element || targetNode instanceof Document || targetNode instanceof DocumentFragment)) {
    console.warn("Target node for tabsDot is not an Element, Document, or DocumentFragment.");
    return;
  }
  const tabs = targetNode.querySelectorAll(".tab");
  tabs.forEach((tab, index) => {
    const tab_label = tab.querySelector(".monaco-icon-label-container");
    const close_icon = tab.querySelector(".codicon-close");
    if (tab_label && close_icon) {
      const tab_label_color = window.getComputedStyle(tab_label).color;
      const uniqueClass = `dynamic-close-icon-${index}`;
      close_icon.classList.add(uniqueClass);
      const style = document.createElement("style");
      style.textContent = `
        .${uniqueClass}::before {
          color: ${tab_label_color};
        }
      `;
      document.head.appendChild(style);
    }
  });
}

// src/ts/style.ts
document.addEventListener("DOMContentLoaded", () => {
  const editorSelector = ".monaco-editor";
  const targetEditor = document.querySelector(editorSelector) || document.body;
  const config = { childList: true, subtree: true };
  const callback = (mutationsList, observer2) => {
    highlightCommentLines(targetEditor);
    tabsDot(targetEditor);
  };
  const observer = new MutationObserver(callback);
  if (targetEditor instanceof Node) {
    observer.observe(targetEditor, config);
  } else {
    console.error("Could not find a valid target node to observe.");
  }
  highlightCommentLines(targetEditor);
  tabsDot(targetEditor);
});
