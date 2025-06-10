import './styles/ext-container.styl';
import { ExtContainer } from './layout/ExtContainer';

import './styles/ext-button.styl';
import { ExtButton } from './components/ExtButton';

import { setupResponsiveClass } from './utils/responsive';
import ExtPanel from './components/ExtPanel';

// Inicializa classe de responsividade
setupResponsiveClass();

function createWrapper(title: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.style.border = '1px solid #ccc';
  wrapper.style.margin = '8px';
  wrapper.style.padding = '8px';
  const label = document.createElement('h4');
  label.textContent = title;
  wrapper.appendChild(label);
  document.body.appendChild(wrapper);
  return wrapper;
}

const hboxWrapper = createWrapper('HBox Layout');
const hbox = new ExtContainer({
  renderTo: hboxWrapper,
  layout: 'hbox',
  items: [
    new ExtButton({ renderTo: document.createElement('div'), text: 'HBotão 1' }),
    new ExtButton({ renderTo: document.createElement('div'), text: 'HBotão 2' }),
    new ExtButton({ renderTo: document.createElement('div'), text: 'HBotão 3' })
  ],
  align: 'center',
  justify: 'space-around'
});

const vboxWrapper = createWrapper('VBox Layout');
const vbox = new ExtContainer({
  renderTo: vboxWrapper,
  layout: 'vbox',
  items: [
    new ExtButton({ renderTo: document.createElement('div'), text: 'VBotão 1' }),
    new ExtButton({ renderTo: document.createElement('div'), text: 'VBotão 2' }),
    new ExtButton({ renderTo: document.createElement('div'), text: 'VBotão 3' })
  ],
  align: 'center',
  justify: 'center'
});

const fitWrapper = createWrapper('Fit Layout');
fitWrapper.style.height = '200px';

const fitContainer = new ExtContainer({
  renderTo: fitWrapper,
  layout: 'fit',
  items: [
    new ExtButton({ renderTo: document.createElement('div'), text: 'FitBotão' })
  ]
});

// ---------------------------------------------------------------------------------------------------

const borderWrapper = createWrapper('Border Layout');
borderWrapper.style.height = '300px';
borderWrapper.style.position = 'relative';

const westPanel = document.createElement('div');
westPanel.textContent = 'West Panel';
westPanel.style.background = '#eee';

const centerPanel = document.createElement('div');
centerPanel.textContent = 'Center Panel';
centerPanel.style.background = '#ddd';

const borderContainer = new ExtContainer({
  renderTo: borderWrapper,
  layout: 'border',
  items: [
    { region: 'west', el: westPanel, split: true, collapsible: true, minWidth: 50, maxWidth: 200 },
    { region: 'center', el: centerPanel }
  ]
});
borderContainer.el.style.height = '80%';

// ---------------------------------------------------------------------------------------------------

const panelWrapper = createWrapper('Panel');

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
  renderTo: panelWrapper,
  title: 'Formulário de Ação',
  layout: 'vbox',
  align: 'center',
  justify: 'center',
  items: [saveBtn, cancelBtn]
});
