// Generating  unique light names for tests
export function createRandomLightName(): string {
  const random = Math.floor(100 + Math.random() * 900); 
  return `Test Light ${random}`;
}
