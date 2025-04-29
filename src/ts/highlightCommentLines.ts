// Define the color for comments
const commentColor: string = "teal";

// Comment type indicators mapped by symbolic character
const commentTypes = {
  questionMark: "?",
  dash: "-",
  equal: "=",
  underscore: "_",
  colon: ":",
  dot: ".",
  sharp: "#",
  imark: "!",
  plus: "+",
  startRegion: "//#region",
  endRegion: "//#endregion",
};

// Counter for how many times highlighting function is triggered

/**
 * Detects the comment type from a line of code based on a specific character pattern.
 * Supports region markers and symbolic comment prefixes.
 *
 * @param commentTextOp - A full comment line (e.g., "//- some comment")
 * @returns The key of the detected comment type or `undefined` if not matched.
 */
function getCommentType(commentTextOp: string): string | undefined {
  const trimmed = commentTextOp.trim();

  if (trimmed.length < 3) return;

  // Handle special region markers
  if (trimmed.startsWith(commentTypes.startRegion)) return "startRegion";
  if (trimmed.startsWith(commentTypes.endRegion)) return "endRegion";

  const thirdChar = trimmed[2];

  // Match symbolic comment types by their corresponding symbol
  for (const [key, symbol] of Object.entries(commentTypes)) {
    if (thirdChar === symbol) {
      return key;
    }
  }

  return;
}
/**
 * Finds lines starting with '//' and highlights all inner spans within that line.
 * @param {Node} targetNode - The node to scan (usually the editor container or document body).
 */
let call_highlightCommentLines_nmber = 0;
export default function highlightCommentLines(targetNode: Node): void {
  call_highlightCommentLines_nmber++;
  // console.log(" call_highlightCommentLines_nmber:", call_highlightCommentLines_nmber);

  // Ensure the targetNode has the querySelectorAll method (like Element or Document)
  if (
    !(
      targetNode instanceof Element ||
      targetNode instanceof Document ||
      targetNode instanceof DocumentFragment
    )
  ) {
    console.warn("Target node for highlightCommentLines is not an Element, Document, or DocumentFragment.");
    return;
  }

  // Select all elements with the class 'view-line' within the target node
  const viewLines: NodeListOf<HTMLElement> = targetNode.querySelectorAll<HTMLElement>(".view-line");

  viewLines.forEach((line: HTMLElement) => {
    // Find the first inner span (span > span) within the current line
    const firstInnerSpan: HTMLElement | null = line.querySelector<HTMLElement>("span > span");

    // Check if the first inner span exists
    if (firstInnerSpan) {
      // Check if its trimmed text content starts with '//'
      const isComment: boolean = (firstInnerSpan.textContent ?? "").trim().startsWith("//");
      const commentType = getCommentType(firstInnerSpan.textContent ?? "");
      // Find ALL inner spans within this line
      const allInnerSpans: NodeListOf<HTMLElement> = line.querySelectorAll<HTMLElement>("span > span");

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
