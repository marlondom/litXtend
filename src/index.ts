// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use strict';

import { html, render } from 'lit-html'

// ################################################### \\

// --------------------------------------------------- \\
// ------------------- WIDGET ------------------------ \\
// --------- Pequeno programa informático ------------ \\
// -------- com funcionalidades específicas ---------- \\
// --------------------------------------------------- \\
import './playground/TableComponent';

(function main() {
  const template = html`
    <table-component></table-component>
  `;

  render(template, window.document.body);
})();
