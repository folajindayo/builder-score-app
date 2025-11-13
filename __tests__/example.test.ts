/**
 * Example test to verify Jest and Testing Library setup
 */
describe('Jest Configuration', () => {
  it('should run basic tests', () => {
    expect(true).toBe(true);
  });

  it('should handle arithmetic operations', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });

  it('should work with objects', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj).toHaveProperty('name');
    expect(obj.value).toBe(42);
  });
});

