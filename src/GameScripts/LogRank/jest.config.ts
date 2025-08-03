// [packages] jest.config.ts
import type { Config } from 'jest';

const config: Config = {
 preset: 'ts-jest',
 testEnvironment: 'node',
 rootDir: '.',
 testMatch: ['<rootDir>/tests/**/*.test.ts'],
 moduleNameMapper: {
  '^@shared/(.*)$': '<rootDir>/../../shared/$1',
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@LogRank/(.*)$': '<rootDir>/../LogRank/src/$1'
 },
 transform: {
  '^.+\\.tsx?$': [
   'ts-jest',
   {
    tsconfig: '<rootDir>/tsconfig.jest.json'
   }
  ]
 },
 moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};

export default config;
