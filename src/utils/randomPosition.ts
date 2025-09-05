export function randomPosition(radius = 8): [number, number, number] {
  const r = radius;

  return [
    Math.random() * r - r / 2,
    Math.random() * r - r / 2,
    Math.random() * r - r / 2,
  ];
}
