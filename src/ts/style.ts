// hgaksdh ahsdkasjhdkajs ajsdalskjdaklsjdklasd klasdjlaskdşlaskdşalskd kasdşalsdş[ajsdlkaskjd askjd] (aklsdlaskdlaksd)
//- go to house

//! go to house

//? go to house

//_ go to house

//: go to house

//= go to house

//# go to house asd  [âßd d [  [âßd [ as8d   âß  ]]]]

document.addEventListener("DOMContentLoaded", () => {
  // Define the color for comments
  const commentColor: string = "blue";
  // Define the target class for the editor container (adjust if needed)
  const editorSelector: string = ".monaco-editor"; // Common class for Monaco Editor, adjust if yours is different

  /**
   * Finds lines starting with '//' and highlights all inner spans within that line.
   * @param {Node} targetNode - The node to scan (usually the editor container or document body).
   */
  function highlightCommentLines(targetNode: Node): void {
    // Ensure the targetNode has the querySelectorAll method (like Element or Document)
    if (
      !(
        targetNode instanceof Element ||
        targetNode instanceof Document ||
        targetNode instanceof DocumentFragment
      )
    ) {
      console.warn(
        "Target node for highlightCommentLines is not an Element, Document, or DocumentFragment.",
      );
      return;
    }

    // Select all elements with the class 'view-line' within the target node
    const viewLines: NodeListOf<HTMLElement> =
      targetNode.querySelectorAll<HTMLElement>(".view-line");

    viewLines.forEach((line: HTMLElement) => {
      // Find the first inner span (span > span) within the current line
      const firstInnerSpan: HTMLElement | null =
        line.querySelector<HTMLElement>("span > span");

      // Check if the first inner span exists
      if (firstInnerSpan) {
        // Check if its trimmed text content starts with '//'
        const isComment: boolean = (firstInnerSpan.textContent ?? "")
          .trim()
          .startsWith("//");
        const commentType = getCommentType(firstInnerSpan.textContent ?? "");
        // Find ALL inner spans within this line
        const allInnerSpans: NodeListOf<HTMLElement> =
          line.querySelectorAll<HTMLElement>("span > span");

        // Iterate through all inner spans in the line
        allInnerSpans.forEach((innerSpan: HTMLElement) => {
          if (isComment) {
            // If it's a comment line, set the color if it's not already set
            if (innerSpan.style.color !== commentColor) {
              //innerSpan.style.color = commentColor;
              if (commentType) {
                innerSpan.classList.add(commentType);
              }
            }
          } else {
            // If it's NOT a comment line, *reset* the color
            // only if it was previously set to the comment color by this script.
            // This prevents overriding other syntax highlighting.
            if (innerSpan.style.color === commentColor) {
              innerSpan.style.color = ""; // Reset to default/inherited color
            }
          }
        });
      }
    });
  }

  // --- MutationObserver Setup ---

  // Select the target node to observe (the editor container)
  // Fallback to document.body if the specific selector isn't found
  // Use type assertion as we provide a fallback guarantee
  const targetEditor: Element | Document =
    document.querySelector(editorSelector) || document.body;

  // Options for the observer (watch for additions/removals of nodes in the subtree)
  const config: MutationObserverInit = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback: MutationCallback = (
    mutationsList: MutationRecord[],
    observer: MutationObserver,
  ) => {
    // For simplicity, re-run highlighting on the whole editor on any change.
    // Optimization: Could iterate through mutationsList and target only changed nodes.
    highlightCommentLines(targetEditor);
  };

  // Create an observer instance linked to the callback function
  const observer: MutationObserver = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  // Ensure targetEditor is a Node before observing
  if (targetEditor instanceof Node) {
    observer.observe(targetEditor, config);
  } else {
    console.error("Could not find a valid target node to observe.");
  }

  // --- Initial Highlighting ---
  // Run the highlighting function once initially to style existing lines
  highlightCommentLines(targetEditor);

  // Optional: Disconnect the observer when it's no longer needed
  // observer.disconnect();
});
const commentTypes = {
  qusestitMark: "?",
  dash: "-",
  equal: "=",
  underscore: "_",
  sayMark: ":",
  dot: ".",
  sharp: "#",
};

/**
 * Detects comment type based on the third character of the comment.
 * @param commentTextOp - The full comment string (e.g., "//- my comment")
 * @returns {string | undefined} - Returns the key of the matched comment type or undefined.
 */
function getCommentType(commentTextOp: string): string | undefined {
  const trimmed = commentTextOp.trim();
  if (
    commentTextOp === "" ||
    commentTextOp.trim() === "" ||
    commentTextOp.trim().length < 3
  ) {
    return;
  }
  if (trimmed.length < 3) return;

  const thirdChar = trimmed[2];

  for (const [key, value] of Object.entries(commentTypes)) {
    if (thirdChar === value) {
      return key;
    }
  }

  return;
}
