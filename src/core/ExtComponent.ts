// src/core/ExtComponent.ts

import XTemplate from '../tpl/XTemplate';

interface ExtComponentConfig<T = any> {
  renderTo: HTMLElement;
  tpl?: XTemplate<T>;
  autoRender?: boolean;
}

export class ExtComponent<T = any> {
  el: HTMLElement;
  renderTo: HTMLElement;
  tpl?: XTemplate<T>;

  constructor(config: ExtComponentConfig<T>) {
    this.renderTo = config.renderTo;
    this.tpl = config.tpl;
    this.el = document.createElement('div');

    if (config.autoRender) {
      this.render({} as T); // render vazio inicial se desejar
    }
  }

  render(data: T): void {
    if (!this.tpl) {
      throw new Error('ExtComponent: nenhum template (tpl) definido para renderização.');
    }
    this.tpl.render(data, this.el);
    if (!this.renderTo.contains(this.el)) {
      this.renderTo.appendChild(this.el);
    }
  }

  destroy(): void {
    if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}

export default ExtComponent;
