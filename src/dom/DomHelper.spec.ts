// npx vitest run src/dom/DomHelper.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { html } from 'lit-html';
import { stripExpressionMarkers } from '@lit-labs/testing';
import { DomHelper } from './DomHelper';

describe('DomHelper', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  it('append() insere o conteúdo corretamente', () => {
    DomHelper.append(container, (data) => html`<p>${data.text}</p>`, {
      text: 'Hello',
    });

    DomHelper.append(container, (data) => html`<p>${data.text}</p>`, {
      text: 'World',
    });

    expect(stripExpressionMarkers(container.innerHTML)).toBe('<p>Hello</p><p>World</p>');
  });

  it('overwrite() substitui o conteúdo existente', () => {
    container.innerHTML = '<span>Velho</span>';

    DomHelper.overwrite(container, html`<div>Novo</div>`);

    expect(stripExpressionMarkers(container.innerHTML)).toBe('<div>Novo</div>');
  });

  it('createFragment() retorna fragmento DOM válido', () => {
    const frag = DomHelper.createFragment((data) => html`<li>${data.item}</li>`, {
      item: 'Teste',
    });

    const temp = document.createElement('ul');
    temp.appendChild(frag);

    expect(stripExpressionMarkers(temp.innerHTML)).toBe('<li>Teste</li>');
  });
});
