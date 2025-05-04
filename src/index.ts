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

import Button from './litext/widgets/Button';

(function main() {
  const template = html`
    <template id='container'></template>
  `;

  render(template, window.document.body);

  const button = new Button({
    text: 'Click me',
    onClick: () => {
      console.log('Button clicked');
    },
  });

  button.renderTo('container');
})();
