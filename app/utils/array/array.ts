export const shuffle = <T ,>(items: Array<T>): Array<T> => {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = shuffledItems[index];

    shuffledItems[index] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = currentItem;
  }

  return shuffledItems;
};

export const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
    const seenIds = new Set<string>();

    return items.filter((item) => {
        if (seenIds.has(item.id)) {
            return false;
        }

        seenIds.add(item.id);
        return true;
    });
};