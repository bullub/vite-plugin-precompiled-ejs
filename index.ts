/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable no-null/no-null */
import { Plugin as VitePlugin } from 'vite';
import { compile } from 'ejs';
import { readFileSync } from 'fs';
import { transformSync } from '@babel/core';
import { default as blockScoping } from '@babel/plugin-transform-block-scoping';
import { default as destructuring } from '@babel/plugin-transform-destructuring';
import { default as forOf } from '@babel/plugin-transform-for-of';
import { default as shorthandProperties } from '@babel/plugin-transform-shorthand-properties';
import { default as spread } from '@babel/plugin-transform-spread';
import { default as templateLiterals } from '@babel/plugin-transform-template-literals';
import { default as arrowFunctions } from '@babel/plugin-transform-arrow-functions';
import { default as scopedFunctions } from '@babel/plugin-transform-block-scoped-functions';

export default function vitePluginPrecompiledEjs(): VitePlugin {
  let needSourceMap = true;
  return {
    name: 'precompiled-ejs',

    enforce: 'pre',

    config() {
      return {
        esbuild: {
          include: [/\.ts$/, /\.ejs$/]
        }
      }
    },

    load(id: string) {
      if (!id.endsWith('.ejs')) {
        return null;
      }

      const code = readFileSync(id).toString('utf-8');
      const template = compile(code, {
        filename: id,
        client: true,
        _with: false,
        debug: false,
        strict: true,
        rmWhitespace: true,
      });

      const exportTemplateCode = template.toString();
      return {
        moduleSideEffects: false,
        code: `/** eslint-disable */
export default ${exportTemplateCode};`,
      };
    },
    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
    },
    transform(code: string, id: string) {
      if (!id.endsWith('.ejs')) {
        return null;
      }

      const plugins = [
        // 块级作用域
        blockScoping,
        // 解构
        destructuring,
        // 支持for of语句
        forOf,
        // 支持 {someFun(){}} 格式语法
        shorthandProperties,
        // 支持 [...a, some]
        spread,
        // 支持模板字符串
        templateLiterals,
        // 支持箭头函数
        arrowFunctions,
        // 作用域函数
        scopedFunctions,
      ];

      const result = transformSync(code, {
        babelrc: false,
        ast: true,
        plugins,
        sourceMaps: needSourceMap,
        sourceFileName: id,
        configFile: false,
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}
