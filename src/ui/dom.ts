type Child = Node | string | null | false;

export const h = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  children: readonly Child[] = [],
): HTMLElementTagNameMap[K] => {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children.filter((child): child is Node | string => Boolean(child)));
  return element;
};
