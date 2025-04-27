/**
 * Highlights tabs with a colored close icon based on tab label color.
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

  const tabs: NodeListOf<HTMLElement> = targetNode.querySelectorAll<HTMLElement>(".tab");

  tabs.forEach((tab: HTMLElement, index: number) => {
    const tab_label = tab.querySelector<HTMLElement>(".monaco-icon-label-container");
    const close_icon = tab.querySelector<HTMLElement>(".codicon-close");

    if (tab_label && close_icon) {
      const tab_label_color = window.getComputedStyle(tab_label).color;

      // Generate a unique class per tab to avoid conflicts
      const uniqueClass = `dynamic-close-icon-${index}`;

      // Add the unique class to the close icon
      close_icon.classList.add(uniqueClass);

      // Create a new style element only once
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
