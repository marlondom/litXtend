// npx vitest run src/components/ExtPanel.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { stripExpressionMarkers } from '@lit-labs/testing';
import { ExtPanel } from './ExtPanel';
import { ExtButton } from './ExtButton';

describe('ExtPanel', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('deve renderizar o título corretamente', () => {
    const panel = new ExtPanel({
      renderTo: container,
      title: 'Meu Painel'
    });

    const header = panel.el.querySelector('.ext-panel-header');
    const headerText = header?.textContent ?? '';
    expect(stripExpressionMarkers(headerText.trim())).toBe('Meu Painel');
  });

  it('deve conter os componentes filhos', () => {
    const btn1 = new ExtButton({ renderTo: document.createElement('div'), text: 'Um' });
    const btn2 = new ExtButton({ renderTo: document.createElement('div'), text: 'Dois' });

    const panel = new ExtPanel({
      renderTo: container,
      items: [btn1, btn2]
    });

    expect(panel.el.contains(btn1.el)).toBe(true);
    expect(panel.el.contains(btn2.el)).toBe(true);
  });
});
