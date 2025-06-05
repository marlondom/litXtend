// npx vitest run src/layout/ExtContainer.split.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { ExtContainer } from './ExtContainer';

describe('ExtContainer com split', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('deve permitir redimensionar região west', () => {
    const regionEl = document.createElement('div');
    regionEl.style.width = '100px';
    regionEl.textContent = 'West';

    const cont = new ExtContainer({
        renderTo: container,
        layout: 'border',
        items: [
        { region: 'west', el: regionEl, split: true, minWidth: 50, maxWidth: 200 },
        { region: 'center', el: document.createElement('div') }
        ]
    });

    const splitter = container.querySelector('.splitter')!;
    const startWidth = parseInt(regionEl.style.width, 10);

    // Simular eventos de arraste
    const mouseDownEvent = new MouseEvent('mousedown', { clientX: 100 });
    splitter.dispatchEvent(mouseDownEvent);

    const mouseMoveEvent = new MouseEvent('mousemove', { clientX: 70 }); // menor clientX
    window.dispatchEvent(mouseMoveEvent);

    const mouseUpEvent = new MouseEvent('mouseup');
    window.dispatchEvent(mouseUpEvent);

    const newWidth = parseInt(regionEl.style.width, 10);
    console.log('Start:', startWidth, 'New:', newWidth);
    expect(newWidth).not.toBe(startWidth);
    expect(newWidth).toBeGreaterThanOrEqual(50);
    expect(newWidth).toBeLessThanOrEqual(200);
  });


});
