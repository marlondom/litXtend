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
  private regions: Partial<Record<BorderItem['region'], BorderItem>> = {};

  constructor(config: ExtContainerConfig) {
    super({ renderTo: config.renderTo });

    this.layoutType = config.layout || 'vbox';
    this.items = config.items || [];

    this.el.classList.add('ext-container');
    this.el.classList.add(`layout-${this.layoutType}`);
    this.el.style.position = 'relative';

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
    this.regions = {};

    if (this.layoutType === 'border') {
      for (const item of this.items) {
        if (typeof item === 'object' && 'region' in item && item.el instanceof HTMLElement) {
          item.el.classList.add(`region-${item.region}`);
          this.regions[item.region] = item;

          if (item.collapsible) {
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = item.collapsed ? '➕' : '➖';
            toggleBtn.className = 'collapse-toggle';
            toggleBtn.addEventListener('click', () => {
              item.collapsed = !item.collapsed;
              item.el.classList.toggle('collapsed', item.collapsed);
              toggleBtn.textContent = item.collapsed ? '➕' : '➖';
              this.reflowLayout();
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
      this.reflowLayout();
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

  private applyBorderLayout() {
    const containerWidth = this.el.clientWidth;
    const containerHeight = this.el.clientHeight;

    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    const { north, south, west, east, center } = this.regions;

    if (north && !north.collapsed) {
      const h = north.el.offsetHeight;
      Object.assign(north.el.style, {
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        height: `${h}px`
      });
      top += h;
    }

    if (south && !south.collapsed) {
      const h = south.el.offsetHeight;
      Object.assign(south.el.style, {
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        right: '0px',
        height: `${h}px`
      });
      bottom += h;
    }

    if (west && !west.collapsed) {
      let w = west.el.offsetWidth;
      west.el.style.width = `${w}px`;
      w = parseInt(west.el.style.width || '0', 10);
      if (!w) {
        w = 100; // fallback padrão para 100 se width não definido
      }
      Object.assign(west.el.style, {
        position: 'absolute',
        top: `${top}px`,
        bottom: `${bottom}px`,
        left: '0px',
        width: `${w}px`
      });
      left += w;
    }

    if (east && !east.collapsed) {
      const w = east.el.offsetWidth;
      Object.assign(east.el.style, {
        position: 'absolute',
        top: `${top}px`,
        bottom: `${bottom}px`,
        right: '0px',
        width: `${w}px`
      });
      right += w;
    }

    if (center) {
      Object.assign(center.el.style, {
        position: 'absolute',
        top: `${top}px`,
        bottom: `${bottom}px`,
        left: `${left}px`,
        right: `${right}px`
      });
    }
  }

  private reflowLayout() {
    this.applyBorderLayout();
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
      this.reflowLayout();
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
