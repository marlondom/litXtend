// src/layout/ExtContainer.ts

import { ExtComponent } from '../core/ExtComponent';

interface BorderItem {
  region: 'north' | 'south' | 'east' | 'west' | 'center';
  el: HTMLElement;
  collapsible?: boolean;
  collapsed?: boolean;
  split?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

interface ExtContainerConfig {
  renderTo: HTMLElement;
  layout?: 'hbox' | 'vbox' | 'fit' | 'border';
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  items?: (ExtComponent | HTMLElement | BorderItem)[];
  autoRender?: boolean;
}

export class ExtContainer extends ExtComponent {
  private layoutType: 'hbox' | 'vbox' | 'fit' | 'border';
  private items: (ExtComponent | HTMLElement | BorderItem)[];

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

    if (this.layoutType === 'fit') {
      const item = this.items[0];
      if (item instanceof ExtComponent) {
        this.el.appendChild(item.el);
      } else if (item instanceof HTMLElement) {
        this.el.appendChild(item);
      }
    } else if (this.layoutType === 'border') {
      for (const item of this.items) {
        if (typeof item === 'object' && 'region' in item && item.el instanceof HTMLElement) {
          item.el.classList.add(`region-${item.region}`);

          if (item.collapsible) {
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = item.collapsed ? '➕' : '➖';
            toggleBtn.className = 'collapse-toggle';
            toggleBtn.addEventListener('click', () => {
              item.collapsed = !item.collapsed;
              item.el.classList.toggle('collapsed', item.collapsed);
              toggleBtn.textContent = item.collapsed ? '➕' : '➖';
            });
            item.el.prepend(toggleBtn);
          }

          if (item.collapsed) {
            item.el.classList.add('collapsed');
          }

          this.el.appendChild(item.el);

          if (item.split) {
            const splitter = document.createElement('div');
            splitter.className = 'splitter';
            splitter.addEventListener('mousedown', (e) => this.initSplit(e, item));
            this.el.appendChild(splitter);
          }
        }
      }
    } else {
      for (const item of this.items) {
        if (item instanceof ExtComponent) {
          this.el.appendChild(item.el);
        } else if (item instanceof HTMLElement) {
          this.el.appendChild(item);
        }
      }
    }

    if (!this.renderTo.contains(this.el)) {
      this.renderTo.appendChild(this.el);
    }
  }

  private initSplit(e: MouseEvent, item: BorderItem) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.el.offsetWidth;
    const startHeight = item.el.offsetHeight;

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (item.region === 'west' || item.region === 'east') {
        const dx = moveEvent.clientX - startX;
        let newWidth = item.region === 'west' ? startWidth + dx : startWidth - dx;
        if (item.minWidth) newWidth = Math.max(newWidth, item.minWidth);
        if (item.maxWidth) newWidth = Math.min(newWidth, item.maxWidth);
        item.el.style.width = `${newWidth}px`;
      } else if (item.region === 'north' || item.region === 'south') {
        const dy = moveEvent.clientY - startY;
        let newHeight = item.region === 'north' ? startHeight + dy : startHeight - dy;
        if (item.minHeight) newHeight = Math.max(newHeight, item.minHeight);
        if (item.maxHeight) newHeight = Math.min(newHeight, item.maxHeight);
        item.el.style.height = `${newHeight}px`;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  add(item: ExtComponent | HTMLElement | BorderItem): void {
    this.items.push(item);
    this.render();
  }

  setLayout(layout: 'hbox' | 'vbox' | 'fit' | 'border'): void {
    this.el.classList.remove(`layout-${this.layoutType}`);
    this.layoutType = layout;
    this.el.classList.add(`layout-${this.layoutType}`);
    this.render();
  }
}

export default ExtContainer;
