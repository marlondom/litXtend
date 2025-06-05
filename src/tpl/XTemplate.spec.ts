// npx vitest run src/tpl/XTemplate.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';

import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';

import { stripExpressionMarkers } from '@lit-labs/testing';
import { html } from 'lit-html';

import XTemplate from './XTemplate';

describe('XTemplate', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('render() deve inserir conteúdo no DOM', () => {
    const tpl = new XTemplate((data: { msg: string }) => html`<p>${data.msg}</p>`);
    tpl.render({ msg: 'Olá' }, container);
    const cleanedResult = stripExpressionMarkers(container.innerHTML.trim());
    expect(cleanedResult).toBe('<p>Olá</p>');
  });

  it('renders correctly into the DOM', async () => {
    document.body.innerHTML = '<div id="test-container"></div>';
    const container = document.getElementById('test-container')!;
  
    const tpl = new XTemplate(({ name }: { name: string }) =>
      html`<p>Hello, ${name}</p>`
    );
  
    tpl.render({ name: 'Kai' }, container);
  
    // Aguarda o elemento aparecer
    const result = await screen.findByText('Hello, Kai');
    expect(result).toBeInTheDocument();
  });

  it('applyTemplate() deve retornar HTML como string', () => {
    const tpl = new XTemplate((data: { nome: string }) => html`<div>${data.nome}</div>`);
    const htmlStr = tpl.applyTemplate({ nome: 'Kai' });
    const cleanedResult = stripExpressionMarkers(htmlStr.trim());
    expect(cleanedResult).toBe('<div>Kai</div>');
  });

  it('getTemplate() deve retornar TemplateResult', () => {
    const tpl = new XTemplate((data: { valor: number }) => html`<span>${data.valor}</span>`);
    const result = tpl.getTemplate({ valor: 123 });
    expect(result).toBeTruthy();
    expect(typeof result.values?.[0]).toBe('number');
  });

  it('renderToString() deve lançar erro', () => {
    const tpl = new XTemplate(() => html`<div>Test</div>`);
    expect(() => tpl.renderToString({})).toThrow();
  });
});
