"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ejs_1 = require("ejs");
var fs_1 = require("fs");
var core_1 = require("@babel/core");
var plugin_transform_block_scoping_1 = __importDefault(require("@babel/plugin-transform-block-scoping"));
var plugin_transform_destructuring_1 = __importDefault(require("@babel/plugin-transform-destructuring"));
var plugin_transform_for_of_1 = __importDefault(require("@babel/plugin-transform-for-of"));
var plugin_transform_shorthand_properties_1 = __importDefault(require("@babel/plugin-transform-shorthand-properties"));
var plugin_transform_spread_1 = __importDefault(require("@babel/plugin-transform-spread"));
var plugin_transform_template_literals_1 = __importDefault(require("@babel/plugin-transform-template-literals"));
var plugin_transform_arrow_functions_1 = __importDefault(require("@babel/plugin-transform-arrow-functions"));
var plugin_transform_block_scoped_functions_1 = __importDefault(require("@babel/plugin-transform-block-scoped-functions"));
function vitePluginPrecompiledEjs() {
    var needSourceMap = true;
    return {
        name: 'precompiled-ejs',
        enforce: 'pre',
        config: function () {
            return {
                esbuild: {
                    include: [/\.ts$/, /\.ejs$/]
                }
            };
        },
        load: function (id) {
            if (!id.endsWith('.ejs')) {
                return null;
            }
            var code = fs_1.readFileSync(id).toString('utf-8');
            var template = ejs_1.compile(code, {
                filename: id,
                client: true,
                _with: false,
                debug: false,
                strict: true,
                rmWhitespace: true,
            });
            var exportTemplateCode = template.toString();
            return {
                moduleSideEffects: false,
                code: "/** eslint-disable */\nexport default " + exportTemplateCode + ";",
            };
        },
        configResolved: function (config) {
            needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
        },
        transform: function (code, id) {
            if (!id.endsWith('.ejs')) {
                return null;
            }
            var plugins = [
                // 块级作用域
                plugin_transform_block_scoping_1.default,
                // 解构
                plugin_transform_destructuring_1.default,
                // 支持for of语句
                plugin_transform_for_of_1.default,
                // 支持 {someFun(){}} 格式语法
                plugin_transform_shorthand_properties_1.default,
                // 支持 [...a, some]
                plugin_transform_spread_1.default,
                // 支持模板字符串
                plugin_transform_template_literals_1.default,
                // 支持箭头函数
                plugin_transform_arrow_functions_1.default,
                // 作用域函数
                plugin_transform_block_scoped_functions_1.default,
            ];
            var result = core_1.transformSync(code, {
                babelrc: false,
                ast: true,
                plugins: plugins,
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
exports.default = vitePluginPrecompiledEjs;
//# sourceMappingURL=index.js.map