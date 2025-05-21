import '../styles/ext-container.styl';

import { ExtComponent } from '../core/ExtComponent';

interface ExtContainerConfig {
  renderTo: HTMLElement;
  layout?: 'hbox' | 'vbox';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  items?: (ExtComponent | HTMLElement)[];
  autoRender?: boolean;
}

export class ExtContainer extends ExtComponent {
  private layoutType: 'hbox' | 'vbox';
  private items: (ExtComponent | HTMLElement)[];

  constructor(config: ExtContainerConfig) {
    super({ renderTo: config.renderTo });

    this.layoutType = config.layout || 'vbox';
    this.items = config.items || [];

    this.el.classList.add('ext-container');
    this.el.classList.add(`layout-${this.layoutType}`);

    if (config.align) {
      this.el.setAttribute('align', config.align);
    }
    if (config.justify) {
      this.el.setAttribute('justify', config.justify);
    }

    if (config.autoRender !== false) {
      this.render();
    }
  }

  render(): void {
    this.el.innerHTML = '';
    for (const item of this.items) {
      if (item instanceof ExtComponent) {
        this.el.appendChild(item.el);
      } else {
        this.el.appendChild(item);
      }
    }
    if (!this.renderTo.contains(this.el)) {
      this.renderTo.appendChild(this.el);
    }
  }

  add(item: ExtComponent | HTMLElement): void {
    this.items.push(item);
    this.render();
  }

  setLayout(layout: 'hbox' | 'vbox'): void {
    this.el.classList.remove(`layout-${this.layoutType}`);
    this.layoutType = layout;
    this.el.classList.add(`layout-${this.layoutType}`);
    this.render();
  }
}

export default ExtContainer;
