// src/components/ExtButtonElement.ts

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ExtButton } from './ExtButton';

@customElement('ext-button')
export class ExtButtonElement extends LitElement {
  @property({ type: String }) label = 'Botão';

  private extButton?: ExtButton;

  firstUpdated() {
    this.extButton = new ExtButton({
      renderTo: this.shadowRoot as unknown as HTMLElement,
      text: this.label,
      onClick: (e) => this.dispatchEvent(new CustomEvent('ext-click', {
        detail: { originalEvent: e },
        bubbles: true,
        composed: true
      }))
    });
  }

  updated(changed: Map<string, any>) {
    if (changed.has('label') && this.extButton) {
      this.extButton.setText(this.label);
    }
  }

  createRenderRoot() {
    return this.attachShadow({ mode: 'open' });
  }

  render() {
    return html``; // o conteúdo é gerenciado pela instância ExtButton
  }
}
