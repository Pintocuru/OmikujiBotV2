// jest.config.ts
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';

// tsconfig.json から paths の設定を取得
const paths = tsconfig.compilerOptions.paths;

const config: Config = {
 preset: 'ts-jest',
 testEnvironment: 'node',
 rootDir: '.',
 testMatch: ['<rootDir>/tests/**/*.test.ts'],
 // pathsToModuleNameMapper を使って moduleNameMapper を生成
 moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
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
