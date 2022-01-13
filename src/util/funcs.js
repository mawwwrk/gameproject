/**
 * @param {ResizeObserverEntry[]} entries
 */
export const resizeCallback = (entries) => {
  entries.forEach(
    (
      /** @type {{ contentRect: { width: any; height: any; }; target: any; }} */ entry
    ) => {
      let { width, height } = entry.contentRect;
      Object.assign(entry.target, { width, height });
    }
  );
};
