import { TemplateResult } from 'lit-html';
export default class XTemplate<TContext = unknown> {
    private templateFn;
    constructor(templateFn: (context: TContext) => TemplateResult);
    /**
     * Renderiza o template no container DOM fornecido
     */
    render(context: TContext, container: HTMLElement): void;
    /**
     * renderToString ainda não implementado (requere lit-ssr)
     */
    renderToString(_context: TContext): string;
    overwrite(container: HTMLElement, context: TContext): void;
    applyTemplate(context: TContext): string;
}
