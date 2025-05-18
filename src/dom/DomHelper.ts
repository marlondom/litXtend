// src/dom/DomHelper.ts

import { render, TemplateResult } from 'lit-html';

/**
 * Tipo auxiliar para aceitar tanto função de template quanto resultado direto
 */
type LitTemplate<T = any> = ((data: T) => TemplateResult) | TemplateResult;

/**
 * Um helper moderno para manipulação de DOM usando lit-html.
 * Substitui Ext.DomHelper com uma abordagem declarativa.
 */
export class DomHelper {
  /**
   * Insere um template lit-html como fragmento preservando o conteúdo existente (compatível com Ext.DomHelper.append)
   * @param target Elemento onde inserir
   * @param template Função que retorna TemplateResult ou o próprio TemplateResult
   * @param data Dados opcionais para template
   */
  static append<T = any>(
    target: HTMLElement,
    template: LitTemplate<T>,
    data?: T
  ): void {
    const tpl = typeof template === 'function' ? template(data as T) : template;
    const container = document.createElement('div');
    render(tpl, container);
    Array.from(container.childNodes).forEach((n) => target.appendChild(n.cloneNode(true)));
  }

  /**
   * Sobrescreve completamente o conteúdo do elemento
   * Usa render diretamente para aproveitar o comportamento declarativo do lit-html
   */
  static overwrite<T = any>(
    target: HTMLElement,
    template: LitTemplate<T>,
    data?: T
  ): void {
    target.innerHTML = ''; // limpa o conteúdo anterior
    const tpl = typeof template === 'function' ? template(data as T) : template;
    render(tpl, target);
  }

  /**
   * Cria um fragmento de DOM sem inserir
   * (pode ser usado para testes ou pré-processamento)
   */
  static createFragment<T = any>(
    template: LitTemplate<T>,
    data?: T
  ): DocumentFragment {
    const tpl = typeof template === 'function' ? template(data as T) : template;
    const container = document.createElement('div');
    render(tpl, container);
    const frag = document.createDocumentFragment();
    Array.from(container.childNodes).forEach((n) => frag.appendChild(n));
    return frag;
  }
}
