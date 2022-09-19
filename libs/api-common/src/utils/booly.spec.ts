import { booly } from '@cm/api-common';

describe('booly', () => {
  it('it stays undefined', () => {
    expect(booly(undefined)).toBeUndefined();
    expect(booly(null)).toBeUndefined();
    expect(booly()).toBeUndefined();
  });

  it('it evaluates to true for truthy values', () => {
    expect(booly('true')).toBeTruthy();
    expect(booly('TRUE')).toBeTruthy();
    expect(booly('true ')).toBeTruthy();
    expect(booly('1')).toBeTruthy();
    expect(booly('on')).toBeTruthy();
    expect(booly('YES')).toBeTruthy();
    expect(booly(true)).toBeTruthy();
    expect(booly(1)).toBeTruthy();
  });

  it('it evaluates to false for falsy values', () => {
    expect(booly('FALSE')).toBeFalsy();
    expect(booly('false')).toBeFalsy();
    expect(booly('0')).toBeFalsy();
    expect(booly('off')).toBeFalsy();
    expect(booly('no')).toBeFalsy();
    expect(booly('NO ')).toBeFalsy();
    expect(booly(false)).toBeFalsy();
    expect(booly(0)).toBeFalsy();
  });

  it('it skips unknowns', () => {
    expect(booly('dafuq am i')).toBeUndefined();
    expect(booly(2)).toBeUndefined();
  });
});
