// npx vitest run src/components/ExtButton.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ExtButton } from './ExtButton';

describe('ExtButton', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('deve renderizar o texto corretamente', () => {
    const button = new ExtButton({ renderTo: container, text: 'Salvar' });
    const content = button.el.textContent ?? '';
    expect(content.trim()).toBe('Salvar');
  });

  it('deve disparar o evento de clique', () => {
    let clicado = false;
    const button = new ExtButton({
      renderTo: container,
      text: 'Clique',
      onClick: () => (clicado = true)
    });

    button.el.querySelector('button')?.click();

    expect(clicado).toBe(true);
  });

  it('deve atualizar o texto com setText()', () => {
    const button = new ExtButton({ renderTo: container, text: 'Original' });
    button.setText('Atualizado');
    const content = button.el.textContent ?? '';
    expect(content.trim()).toBe('Atualizado');
  });
});
