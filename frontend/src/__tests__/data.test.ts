import { services } from '../data';

// Simple test for data
describe('Data', () => {
  it('should have correct number of services', () => {
    expect(services).toHaveLength(5);
  });

  it('should have valid service structure', () => {
    const service = services[0];
    expect(service).toHaveProperty('id');
    expect(service).toHaveProperty('title');
    expect(service).toHaveProperty('slug');
    expect(service).toHaveProperty('icon');
    expect(service).toHaveProperty('shortDesc');
    expect(service).toHaveProperty('features');
    expect(Array.isArray(service.features)).toBe(true);
  });
});
