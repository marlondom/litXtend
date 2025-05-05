import { describe, it, expect } from 'vitest';

import '@testing-library/jest-dom';
import { screen } from '@testing-library/dom';
import { html } from 'lit-html';
import { stripExpressionMarkers } from '@lit-labs/testing';

it('applyTemplate returns correct HTML string without markers', () => {
  const tpl = new XTemplate((data: { msg: string }) => html`<span>${data.msg}</span>`);
  const result = tpl.applyTemplate({ msg: 'Olá' });
  const cleanedResult = stripExpressionMarkers(result);

  expect(cleanedResult).toBe('<span>Olá</span>');
});
import XTemplate from '../src/tpl/XTemplate';

describe('XTemplate', () => {
  it('renders correctly into the DOM', () => {
    document.body.innerHTML = '<div id="test-container"></div>';

    const tpl = new XTemplate((data: { name: string }) => html`<p>Hello, ${data.name}</p>`);
    tpl.overwrite(document.getElementById('test-container')!, { name: 'Kai' });

    expect(screen.getByText('Hello, Kai')).toBeInTheDocument();
  });

  it('applyTemplate returns correct HTML string', () => {
    const tpl = new XTemplate((data: { msg: string }) => html`<span>${data.msg}</span>`);
    const result = tpl.applyTemplate({ msg: 'Olá' });
    const cleanedResult = stripExpressionMarkers(result);

    expect(cleanedResult).toBe('<span>Olá</span>');  });
});
