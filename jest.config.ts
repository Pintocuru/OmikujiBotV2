// jest.config.ts
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';
import baseConfig from '../../jest.config.base.ts';

// tsconfig.json から paths の設定を取得
const paths = tsconfig.compilerOptions.paths;

const config: Config = {
 ...baseConfig,
 rootDir: '.',
 testMatch: ['<rootDir>/tests/**/*.test.ts'],
 // pathsToModuleNameMapper を使って moduleNameMapper を生成
 moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' })
};

export default config;
