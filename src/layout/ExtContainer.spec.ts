// npx vitest run src/layout/ExtContainer.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ExtContainer } from './ExtContainer';
import { ExtButton } from '../components/ExtButton';

describe('ExtContainer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('deve renderizar os itens filhos', () => {
    const btn1 = new ExtButton({ renderTo: document.createElement('div'), text: 'A' });
    const btn2 = new ExtButton({ renderTo: document.createElement('div'), text: 'B' });

    const cont = new ExtContainer({
      renderTo: container,
      layout: 'hbox',
      items: [btn1, btn2]
    });

    expect(cont.el.contains(btn1.el)).toBe(true);
    expect(cont.el.contains(btn2.el)).toBe(true);
  });

  it('deve aplicar a classe de layout correta', () => {
    const cont = new ExtContainer({ renderTo: container, layout: 'vbox' });
    expect(cont.el.classList.contains('layout-vbox')).toBe(true);
  });

  it('deve permitir adicionar itens dinamicamente', () => {
    const cont = new ExtContainer({ renderTo: container });
    const btn = new ExtButton({ renderTo: document.createElement('div'), text: 'Novo' });
    cont.add(btn);
    expect(cont.el.contains(btn.el)).toBe(true);
  });

  it('deve aplicar atributos de alinhamento e justificação', () => {
    const cont = new ExtContainer({
      renderTo: container,
      align: 'center',
      justify: 'space-between'
    });

    expect(cont.el.getAttribute('align')).toBe('center');
    expect(cont.el.getAttribute('justify')).toBe('space-between');
  });
});
