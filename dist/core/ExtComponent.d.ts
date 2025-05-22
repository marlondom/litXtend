import XTemplate from '../tpl/XTemplate';
interface ExtComponentConfig<T = any> {
    renderTo: HTMLElement;
    tpl?: XTemplate<T>;
    autoRender?: boolean;
}
export declare class ExtComponent<T = any> {
    el: HTMLElement;
    renderTo: HTMLElement;
    tpl?: XTemplate<T>;
    constructor(config: ExtComponentConfig<T>);
    render(data: T): void;
    destroy(): void;
}
export default ExtComponent;
