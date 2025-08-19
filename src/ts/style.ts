import highlightCommentLines from "./highlightCommentLines";
import tabsDot from "./tabsDot";

let call_oserver_nmber = 0;
document.addEventListener("DOMContentLoaded", () => {
  // Define the target class for the editor container (adjust if needed)
  const editorSelector: string = ".view-lines"; // Common class for Monaco Editor, adjust if yours is different
  // const editorSelector: string = ".monaco-editor"; // Common class for Monaco Editor, adjust if yours is different

  // --- MutationObserver Setup ---

  // Select the target node to observe (the editor container)
  // Fallback to document.body if the specific selector isn't found
  // Use type assertion as we provide a fallback guarantee
  const targetEditor: Element | Document = document.querySelector(editorSelector) || document.body;

  // Options for the observer (watch for additions/removals of nodes in the subtree)
  const config: MutationObserverInit = { childList: true, subtree: true };

  // Callback function to execute when mutations are observed
  const callback: MutationCallback = (mutationsList: MutationRecord[], observer: MutationObserver) => {
    // For simplicity, re-run highlighting on the whole editor on any change.
    // Optimization: Could iterate through mutationsList and target only changed nodes.
    highlightCommentLines(targetEditor);
    tabsDot(targetEditor);
    call_oserver_nmber++;
    // console.log(" call_oserver_nmber:", call_oserver_nmber);
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
  tabsDot(targetEditor);
  // Optional: Disconnect the observer when it's no longer needed
  // observer.disconnect();
});
