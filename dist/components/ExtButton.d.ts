import { ExtComponent } from '../core/ExtComponent';
interface ExtButtonConfig {
    renderTo: HTMLElement;
    text: string;
    onClick?: (event: MouseEvent) => void;
}
export declare class ExtButton extends ExtComponent<{
    text: string;
}> {
    private onClickHandler?;
    constructor(config: ExtButtonConfig);
    private attachEvents;
    setText(newText: string): void;
}
export default ExtButton;
