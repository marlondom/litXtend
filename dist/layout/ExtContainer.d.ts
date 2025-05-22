import '../styles/ext-container.styl';
import { ExtComponent } from '../core/ExtComponent';
interface ExtContainerConfig {
    renderTo: HTMLElement;
    layout?: 'hbox' | 'vbox';
    align?: 'start' | 'center' | 'end';
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    items?: (ExtComponent | HTMLElement)[];
    autoRender?: boolean;
}
export declare class ExtContainer extends ExtComponent {
    private layoutType;
    private items;
    constructor(config: ExtContainerConfig);
    render(): void;
    add(item: ExtComponent | HTMLElement): void;
    setLayout(layout: 'hbox' | 'vbox'): void;
}
export default ExtContainer;
