export const calculateReadingTime = (content: string, wordsPerMinute = 180) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
};
