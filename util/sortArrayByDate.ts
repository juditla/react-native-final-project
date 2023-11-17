export default function sortArrayByDate(unsortedArray) {
  const sortedArray = unsortedArray.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return sortedArray;
}
