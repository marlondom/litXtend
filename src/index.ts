// import { html } from 'lit-html';
// import XTemplate from './tpl/XTemplate.js';

// import ExtButton from "./components/ExtButton";
// import ExtContainer from "./layout/ExtContainer";

// const myTpl = new XTemplate((data: { name: string; items: string[] }) => html`
//   <div>
//     <h2>Hello, ${data.name}</h2>
//     <ul>
//       ${data.items.map(item => html`<li>${item}</li>`)}
//     </ul>
//   </div>
// `);

// const data = {
//   name: 'Kai',
//   items: ['Magic', 'Adventure', 'Friendship']
// };

// // Ensure the container is not null before calling overwrite
// const container = document.getElementById('app');
// if (container) {
//   myTpl.overwrite(container, data);
// } else {
//   console.error('Container with id "app" not found.');
// }

// ----------------------------------------------------------------

// import XTemplate from './tpl/XTemplate';
// import { html } from 'lit-html';
// import { ExtComponent } from './core/ExtComponent';

// const comp = new ExtComponent({
//   renderTo: document.body,
//   tpl: new XTemplate((data: { name: string }) => html`<div>Hello ${data.name}</div>`),
//   autoRender: true,
// });
// comp.render({ name: 'Kai' });

// ----------------------------------------------------------------

// import { ExtButton } from './components/ExtButton';
// import './styles/ext-button.styl';


// const firstButton = new ExtButton({
//   renderTo: document.body,
//   text: 'Clique aqui',
//   onClick: () => alert('Botão clicado!'),
// });

// const secondButton = new ExtButton({
//   renderTo: document.body,
//   text: 'Clique aqui',
//   onClick: () => firstButton.setText('Botão clicado!'),
// });

// ----------------------------------------------------------------

// new ExtContainer({
//   renderTo: document.body,
//   layout: 'hbox',
//   items: [
//     new ExtButton({ text: 'Salvar' }),
//     new ExtButton({ text: 'Cancelar' })
//   ]
// });

// ----------------------------------------------------------------

import './styles/ext-panel.styl';
import './styles/ext-container.styl';
import './styles/ext-button.styl';

import { ExtPanel } from './components/ExtPanel';
import { ExtButton } from './components/ExtButton';

// Cria dois botões
const saveBtn = new ExtButton({
  renderTo: document.createElement('div'), // será movido
  text: 'Salvar',
  onClick: () => alert('Salvo com sucesso!')
});

const cancelBtn = new ExtButton({
  renderTo: document.createElement('div'), // será movido
  text: 'Cancelar',
  onClick: () => alert('Cancelado.')
});

// Cria o painel com os botões dentro
new ExtPanel({
  renderTo: document.body,
  title: 'Formulário de Ação',
  layout: 'vbox',
  align: 'center',
  justify: 'center',
  items: [saveBtn, cancelBtn]
});
