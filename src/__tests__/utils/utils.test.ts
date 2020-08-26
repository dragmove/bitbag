import { gt, lt } from '../../utils/utils';

describe('gt', () => {
  const isGreaterThanZero: (rhs: number) => boolean = gt(0);

  test('should return true when we input a bigger number', () => {
    expect(isGreaterThanZero(1)).toEqual(true);
    expect(isGreaterThanZero(99)).toEqual(true);
  });

  test('should return false when we input a smaller number', () => {
    expect(isGreaterThanZero(-1)).toEqual(false);
    expect(isGreaterThanZero(-99)).toEqual(false);
  });

  test('should return false when we input the same number', () => {
    expect(isGreaterThanZero(0)).toEqual(false);
  });
});

describe('lt', () => {
  const isSmallerThanZero: (rhs: number) => boolean = lt(0);

  test('should return true when we input a smaller number', () => {
    expect(isSmallerThanZero(-1)).toEqual(true);
    expect(isSmallerThanZero(-99)).toEqual(true);
  });

  test('should return false when we input a bigger number', () => {
    expect(isSmallerThanZero(1)).toEqual(false);
    expect(isSmallerThanZero(99)).toEqual(false);
  });

  test('should return false when we input the same number', () => {
    expect(isSmallerThanZero(0)).toEqual(false);
  });
});
