/* eslint-disable prettier/prettier */
// Uncomment the code below and write your tests
// index.test.js
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(100);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError when withdrawing more than balance', () => {
    const account = getBankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const accountA = getBankAccount(50);
    const accountB = getBankAccount(100);

    expect(() => accountA.transfer(100, accountB)).toThrow(
      InsufficientFundsError,
    );
    expect(() => accountA.transfer(100, accountB)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(100);
    account.deposit(50);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(100);
    account.withdraw(40);
    expect(account.getBalance()).toBe(60);
  });

  test('should transfer money', () => {
    const accountA = getBankAccount(100);
    const accountB = getBankAccount(50);

    accountA.transfer(50, accountB);

    expect(accountA.getBalance()).toBe(50);
    expect(accountB.getBalance()).toBe(100);
  });
  test('fetchBalance should return number if request did not fail', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(80);

    const balance = await account.fetchBalance();
    expect(balance).toBe(80);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(90);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(90);
  });
  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
