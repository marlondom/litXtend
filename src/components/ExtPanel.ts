import '../styles/ext-panel.styl';

import { ExtContainer } from '../layout/ExtContainer';
import { ExtComponent } from '../core/ExtComponent';

interface ExtPanelConfig {
  renderTo: HTMLElement;
  title?: string;
  layout?: 'hbox' | 'vbox';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  items?: (ExtComponent | HTMLElement)[];
  autoRender?: boolean;
}

export class ExtPanel extends ExtContainer {
  private headerEl?: HTMLElement;

  constructor(config: ExtPanelConfig) {
    super(config);

    this.el.classList.add('ext-panel');

    if (config.title) {
      this.headerEl = document.createElement('div');
      this.headerEl.className = 'ext-panel-header';
      this.headerEl.textContent = config.title;
      this.el.prepend(this.headerEl);
    }
  }
}

export default ExtPanel;
