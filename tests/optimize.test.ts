import { describe, it, expect } from "vitest";
import { getLinearSyntax, getOptimizedPoints, toFixed } from "../src/mod";

describe("getOptimizedPoints", () => {
  it('test getOptimizedPoints readme example', () => {
    const testData: [number, number][] = [[0, 0], [0.1, 0.2], [0.5, 1], [0.9, 0.2], [1, 0]];
    const expectedResult = [[0, 0], [0.5, 1], [1, 0]];

    const result = getOptimizedPoints(testData, 0.1, 2);
    expect(result).toEqual(expectedResult)
  });
  it('optimize basic points', () => {
    const testData: [number, number][] = [[0, 0], [0.5, 1], [1, 0]];
    const expectedResult = [[0, 0], [0.5, 1], [1, 0]];

    const result = getOptimizedPoints(testData, 0.1, 2);
    expect(result).toEqual(expectedResult)
  });
  it('returns an empty array when given an empty array', () => {
    const testData: [number, number][] = [];
    const result = getOptimizedPoints(testData, 0.1, 2);
    expect(result).toEqual([]);
  });

  it('returns single point array when given a single point array', () => {
    const testData: [number, number][] = [[0, 0]];
    const result = getOptimizedPoints(testData, 0.1, 2);
    expect(result).toEqual([[0, 0]]);
  });

  it('returns the same array when points are already simplified', () => {
    const testData: [number, number][] = [[0, 0], [1, 1], [2, 0]];
    const result = getOptimizedPoints(testData, 0.1, 2);
    expect(result).toEqual([[0, 0], [1, 1], [2, 0]]);
  });

  it('simplifies the points correctly', () => {
    const testData: [number, number][] = [[0, 0], [0.5, 0.001], [1, 0]];
    const result = getOptimizedPoints(testData, 0.01, 2);
    expect(result).toEqual([[0, 0], [1, 0]]);
  });

  it('rounds the point values correctly', () => {
    const testData: [number, number][] = [[0, 0], [0.333333333, 1], [0.666666666, 0], [1, 0]];
    const result = getOptimizedPoints(testData, 0.01, 2);
    expect(result).toEqual([[0, 0], [0.33, 1], [0.67, 0], [1, 0]]);
  });

  it('handles large datasets correctly', () => {
    // Generate a large dataset of points
    const largeData: [number, number][] = Array.from({ length: 10000 }, (_, i) => [i * 0.0001, Math.sin(i * 0.0001)]);

    // Perform simplification and rounding
    const result = getOptimizedPoints(largeData, 0.01, 2)!;

    // Expect the resulting data to be significantly smaller, but not empty
    expect(result.length).toBeLessThan(largeData.length);
    expect(result.length).toBeGreaterThan(0);

    // Check that the first and last points are preserved
    expect(result[0]).toEqual([0, 0]);
    expect(result[result.length - 1]).toEqual([1, toFixed(Math.sin(1), 2)]);
  });

  it('preserves points when tolerance is set to 0', () => {
    const testData: [number, number][] = [[0, 0], [0.5, 0.2], [1, 0]];
    const result = getOptimizedPoints(testData, 0, 2);
    expect(result).toEqual([[0, 0], [0.5, 0.2], [1, 0]]);
  });

  it('handles null values gracefully', () => {
    const result = getOptimizedPoints(null, 0.1, 2);
    expect(result).toBeNull();
  });

  it('does not round x values to less than 2 decimal places', () => {
    const testData: [number, number][] = [[0, 0], [0.333333333, 1], [0.666666666, 0], [1, 0]];
    const result = getOptimizedPoints(testData, 0.01, 1);
    expect(result).toEqual([[0, 0], [0.33, 1], [0.67, 0], [1, 0]]);
  });
})



/**
 * 
 * 
 * getLinearSyntax
 * 
 *
 * 
 */
describe('getLinearSyntax', () => {
  it('returns an empty array when input is null', () => {
    const result = getLinearSyntax(null, 2);
    expect(result).toEqual([]);
  });

  it('test example from readme', () => {
    const result = getLinearSyntax([[0, 0], [0.1, 0.2], [0.5, 1], [0.9, 0.2], [1, 0]], 2);
    expect(result).toEqual([
      '0',
      '0.2 10%',
      '1',
      '0.2 90%',
      '0',
    ]);
  });  

  it('formats single point correctly', () => {
    const singlePoint: [number, number][] = [[0.5, 0.2]];
    const result = getLinearSyntax(singlePoint, 2);
    expect(result).toEqual(["0.2 50%"]);
  });

  it('formats multiple points correctly', () => {
    const multiplePoints: [number, number][] = [[0, 0], [0.5, 1], [1, 0.5]];
    const result = getLinearSyntax(multiplePoints, 2);
    expect(result).toEqual(["0", "1", "0.5"]);
  });

  it('preserves order of points with distinct y values', () => {
    const testData: [number, number][] = [[0, 0], [0.33, 0.2], [0.67, 0.8], [1, 0.5]];
    const result = getLinearSyntax(testData, 2);
    expect(result).toEqual(["0", "0.2", "0.8", "0.5"]);
  });

  it('preserves order of points with same y values', () => {
    const testData: [number, number][] = [[0, 0.2], [0.33, 0.2], [0.67, 0.2], [1, 0.2]];
    const result = getLinearSyntax(testData, 2);
    expect(result).toEqual(["0.2 0% 100%"]);
  });

  it('handles datasets with random y values correctly', () => {
    // Generate a large dataset of points with random y values
    const largeData: [number, number][] = Array.from({ length: 10000 }, (_, i) => [i * 0.0001, Math.random()]);

    // Perform conversion to linear syntax
    const result = getLinearSyntax(largeData, 2);

    // Expect the resulting string to contain all points
    expect(result.length).toBe(largeData.length);

    // Check that the first and last points are preserved and correctly formatted
    expect(result[0]).toEqual(toFixed(largeData[0][1], 2).toString());
    expect(result[largeData.length - 1]).toEqual(toFixed(largeData[largeData.length - 1][1], 2) + " 100%");
  });

  it('preserves order of points when rounding is applied', () => {
    const testData: [number, number][] = [[0, 0.333333333], [0.33, 0.666666666], [0.67, 0.111111111], [1, 0.999999999]];
    const result = getLinearSyntax(testData, 2);
    expect(result).toEqual(["0.33", "0.67", "0.11", "1"]);
  });
});
