import { TemplateResult } from 'lit-html';
/**
 * Tipo auxiliar para aceitar tanto função de template quanto resultado direto
 */
type LitTemplate<T = any> = ((data: T) => TemplateResult) | TemplateResult;
/**
 * Um helper moderno para manipulação de DOM usando lit-html.
 * Substitui Ext.DomHelper com uma abordagem declarativa.
 */
export declare class DomHelper {
    /**
     * Insere um template lit-html como fragmento preservando o conteúdo existente (compatível com Ext.DomHelper.append)
     * @param target Elemento onde inserir
     * @param template Função que retorna TemplateResult ou o próprio TemplateResult
     * @param data Dados opcionais para template
     */
    static append<T = any>(target: HTMLElement, template: LitTemplate<T>, data?: T): void;
    /**
     * Sobrescreve completamente o conteúdo do elemento
     * Usa render diretamente para aproveitar o comportamento declarativo do lit-html
     */
    static overwrite<T = any>(target: HTMLElement, template: LitTemplate<T>, data?: T): void;
    /**
     * Cria um fragmento de DOM sem inserir
     * (pode ser usado para testes ou pré-processamento)
     */
    static createFragment<T = any>(template: LitTemplate<T>, data?: T): DocumentFragment;
}
export {};
