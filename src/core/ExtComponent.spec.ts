// npx vitest run src/core/ExtComponent.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { html } from 'lit-html';
import XTemplate from '../tpl/XTemplate';
import { ExtComponent } from './ExtComponent';

describe('ExtComponent', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('deve renderizar usando XTemplate', () => {
    const tpl = new XTemplate((data: { msg: string }) => html`<p>${data.msg}</p>`);
    const comp = new ExtComponent({ renderTo: container, tpl });

    comp.render({ msg: 'Olá mundo' });
    const content = comp.el.textContent ?? '';
    expect(content.trim()).toBe('Olá mundo');
  });

  it('deve lançar erro se tentar render sem template', () => {
    const comp = new ExtComponent({ renderTo: container });
    expect(() => comp.render({})).toThrow();
  });

  it('deve ser removido do DOM com destroy()', () => {
    const tpl = new XTemplate(() => html`<p>Item</p>`);
    const comp = new ExtComponent({ renderTo: container, tpl });
    comp.render({});

    expect(container.contains(comp.el)).toBe(true);
    comp.destroy();
    expect(container.contains(comp.el)).toBe(false);
  });
});
