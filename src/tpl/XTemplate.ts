// src/tpl/XTemplate.ts

import { render, TemplateResult } from 'lit-html';

export default class XTemplate<TContext = unknown> {
  private templateFn: (context: TContext) => TemplateResult;

  constructor(templateFn: (context: TContext) => TemplateResult) {
    if (typeof templateFn !== 'function') {
      throw new Error('XTemplate espera uma função lit-html como template.');
    }
    this.templateFn = templateFn;
  }

  /**
   * Renderiza o template no container DOM fornecido
   */
  render(context: TContext, container: HTMLElement): void {
    this.overwrite(container, context);
  }

  /**
   * Retorna o TemplateResult gerado com o contexto atual
   */
  getTemplate(context: TContext): TemplateResult {
    return this.templateFn(context);
  }

  /**
   * renderToString ainda não implementado (requere lit-ssr)
   */
  renderToString(_context: TContext): string {
    throw new Error('renderToString requer lit-ssr e não está implementado.');
  }

  // Simula tpl.overwrite(el, data)
  overwrite(container: HTMLElement, context: TContext) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('É necessário fornecer um container DOM válido.');
    }
    const tpl = this.templateFn(context);
    render(tpl, container);
  }

  // Simula tpl.apply(data)
  applyTemplate(context: TContext) {
    // Para compatibilidade com comportamento antigo
    const container = document.createElement('div');
    render(this.templateFn(context), container);
    return container.innerHTML;
  }
}
