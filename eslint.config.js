import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  { ignores: ['dist'] }, //검사에서 제외할 폴더
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended], //기본 추천 규칙
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], //설정 적용할 파일 패턴
    languageOptions: {
      ecmaVersion: 2020, //ECMAScript 2020 문법까지 허용
      globals: globals.browser, //브라우저 환경의 전역 객체 사용 가능
    },
    plugins: {
      //사용할 ESLint 플러그인을 등록
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'prettier/prettier': 'error', //Prettier 규칙 위반 시 ESLint 오류로 표시
    },
  },
);
