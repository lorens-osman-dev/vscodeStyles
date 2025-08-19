/**
 * Highlights tabs with a colored close icon based on tab label color using CSS attr().
 * @param {Node} targetNode - The node to scan (usually the editor container or document body).
 */
export default function tabsDot(targetNode: Node): void {
  if (
    !(
      targetNode instanceof Element ||
      targetNode instanceof Document ||
      targetNode instanceof DocumentFragment
    )
  ) {
    console.warn("Target node for tabsDot is not an Element, Document, or DocumentFragment.");
    return;
  }

  const tabs = targetNode.querySelectorAll<HTMLElement>(".tab");

  tabs.forEach((tab: HTMLElement) => {
    const tab_label = tab.querySelector<HTMLElement>(".monaco-icon-label-container");
    const close_icon = tab.querySelector<HTMLElement>(".codicon-close");

    if (tab_label && close_icon) {
      // Get the computed color of tab_label
      const tab_label_color = window.getComputedStyle(tab_label).color;
      console.log(" tab_label_color:", tab_label_color);
      // Set the color as a data attribute on the close icon
      close_icon.setAttribute("data-label-color", tab_label_color);
    }
  });
}
