import { LitElement } from 'lit';
export declare class ExtButtonElement extends LitElement {
    label: string;
    private extButton?;
    firstUpdated(): void;
    updated(changed: Map<string, any>): void;
    createRenderRoot(): ShadowRoot;
    render(): import("lit-html").TemplateResult<1>;
}
