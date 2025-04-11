// ==UserScript==
// @name        Wolfram to Desmos
// @namespace   bub
// @version     0.1.0-alpha
// @author      bub
// @description Paste converter from Wolfram to Desmos
// @grant       none
// @match       https://*.desmos.com/calculator*
// @downloadURL https://raw.githubusercontent.com/llbub/wolfram-to-desmos/main/main.user.js
// @updateURL   https://raw.githubusercontent.com/llbub/wolfram-to-desmos/main/main.user.js
// ==/UserScript==

(function() {
    'use strict';
    function convert(wolfram) {
        return wolfram
            .replace(/\\?(sqrt)\((.+?)\)/g, '\\$1{$2}')
            .replace(/log\(([^,]+?)\)/g, '\\log\\left($1\\right)')
            .replace(/log\((.+?), (.+?)\)/g, '\\log_$1\\left($2\\right)')
            .replace(/\\?(sin|cos|tan|csc|sec|cot|arcsin|arccos|arctan|arccsc|arcsec|arccot|arg)\((.+?)\)/g, '\\$1\\left($2\\right)')
            .replace(/\\?(floor|ceil)\((.+?)\)/g, '\\operatorname{$1}\\left($2\\right)')
            .replace(/\s*(=|\+|-)\s*/g, '$1')
            .replaceAll('π', '\\pi')
            .replaceAll('∞', '\\infty')
            .replace(/sum_\((.+?)\)\^(.+?)\s/g, '\\sum_{$1}^{$2} ')
            .replace(/(?<!\\left)\((.+)\)\/\((.+?)\)/g, '\\frac{$1}{$2}')
            .replace(/(?<=\b)([^\\\(\)\[\]\+\-\*\s]+)\/([^\\\(\)\[\]\+\-\*\s]+)(?=\b)/g, '\\frac{$1}{$2}')
            .replace(/(?:\\left)?([\(\[])/g, '\\left$1')
            .replace(/(?:\\right)?([\)\]])/g, '\\right$1');
    }

    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'v') {
            e.preventDefault();
            const text = convert(await navigator.clipboard.readText());
            console.log(text);
            const exprs = Calc.getExpressions();
            const index = exprs.find((e) => e.id === Calc.selectedExpressionId);
            Calc.setExpression({
                id: 'paste',
                latex: text
            });
        }
    });
})();
