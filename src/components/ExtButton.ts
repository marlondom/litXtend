// src/components/ExtButton.ts

import XTemplate from '../tpl/XTemplate';
import { ExtComponent } from '../core/ExtComponent';
import { html } from 'lit-html';

interface ExtButtonConfig {
  renderTo: HTMLElement;
  text: string;
  onClick?: (event: MouseEvent) => void;
}

export class ExtButton extends ExtComponent<{ text: string }> {
  private onClickHandler?: (event: MouseEvent) => void;

  constructor(config: ExtButtonConfig) {
    const tpl = new XTemplate(({ text }: { text: string }) => html`
      <button class="ext-btn">${text}</button>
    `);

    super({ renderTo: config.renderTo, tpl });
    this.onClickHandler = config.onClick;

    this.render({ text: config.text });
    this.attachEvents();
  }

  private attachEvents(): void {
    const btn = this.el.querySelector('button');
    if (btn && this.onClickHandler) {
      btn.addEventListener('click', this.onClickHandler);
    }
  }

  setText(newText: string): void {
    this.render({ text: newText });
    this.attachEvents(); // Reanexar eventos após render
  }
}

export default ExtButton;
