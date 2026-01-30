import { describe, it, expect, vi, beforeEach } from 'vitest';
import { objectsToCSV, exportOrdersToCSV, exportClientsToCSV } from '@/lib/csv';

describe('CSV Utilities', () => {
  describe('objectsToCSV', () => {
    it('converts simple objects to CSV', () => {
      const data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];

      const csv = objectsToCSV(data);

      expect(csv).toContain('name;age');
      expect(csv).toContain('Alice;30');
      expect(csv).toContain('Bob;25');
    });

    it('handles empty array', () => {
      const csv = objectsToCSV([]);
      expect(csv).toBe('');
    });

    it('escapes values with delimiter', () => {
      const data = [{ name: 'Test;Value', value: 'Normal' }];
      const csv = objectsToCSV(data);
      expect(csv).toContain('"Test;Value"');
    });

    it('escapes values with quotes', () => {
      const data = [{ name: 'Test "Quoted" Value' }];
      const csv = objectsToCSV(data);
      expect(csv).toContain('"Test ""Quoted"" Value"');
    });

    it('escapes values with newlines', () => {
      const data = [{ name: 'Line1\nLine2' }];
      const csv = objectsToCSV(data);
      expect(csv).toContain('"Line1\nLine2"');
    });

    it('handles null and undefined values', () => {
      const data = [{ name: null, value: undefined }];
      const csv = objectsToCSV(data as any);
      expect(csv).toContain('name;value');
      expect(csv).toContain(';'); // Empty values
    });

    it('uses custom delimiter', () => {
      const data = [{ a: 1, b: 2 }];
      const csv = objectsToCSV(data, { delimiter: ',' });
      expect(csv).toContain('a,b');
      expect(csv).toContain('1,2');
    });

    it('uses custom headers', () => {
      const data = [{ firstName: 'Alice', lastName: 'Smith' }];
      const csv = objectsToCSV(data, { headers: ['firstName'] });
      expect(csv).toContain('firstName');
      expect(csv).not.toContain('lastName');
    });
  });

  describe('exportOrdersToCSV', () => {
    // Mock URL.createObjectURL and other browser APIs
    beforeEach(() => {
      global.URL.createObjectURL = vi.fn(() => 'blob:test');
      global.URL.revokeObjectURL = vi.fn();
      global.Blob = vi.fn().mockImplementation((content) => ({
        content,
        type: 'text/csv;charset=utf-8',
      }));
    });

    it('is a function', () => {
      expect(typeof exportOrdersToCSV).toBe('function');
    });
  });

  describe('exportClientsToCSV', () => {
    beforeEach(() => {
      global.URL.createObjectURL = vi.fn(() => 'blob:test');
      global.URL.revokeObjectURL = vi.fn();
      global.Blob = vi.fn().mockImplementation((content) => ({
        content,
        type: 'text/csv;charset=utf-8',
      }));
    });

    it('is a function', () => {
      expect(typeof exportClientsToCSV).toBe('function');
    });
  });
});

describe('CSV Data Formatting', () => {
  it('formats prices correctly', () => {
    const data = [{ price: 2.5 }];
    const csv = objectsToCSV(data);
    expect(csv).toContain('2.5');
  });

  it('formats dates as strings', () => {
    const date = new Date('2024-01-15');
    const data = [{ date: date.toISOString() }];
    const csv = objectsToCSV(data);
    expect(csv).toContain('2024-01-15');
  });

  it('handles special French characters', () => {
    const data = [{ name: 'Café éléphant' }];
    const csv = objectsToCSV(data);
    expect(csv).toContain('Café éléphant');
  });
});
