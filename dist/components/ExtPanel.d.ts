import '../styles/ext-panel.styl';
import { ExtContainer } from '../layout/ExtContainer';
import { ExtComponent } from '../core/ExtComponent';
interface ExtPanelConfig {
    renderTo: HTMLElement;
    title?: string;
    layout?: 'hbox' | 'vbox';
    align?: 'start' | 'center' | 'end';
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    items?: (ExtComponent | HTMLElement)[];
    autoRender?: boolean;
}
export declare class ExtPanel extends ExtContainer {
    private headerEl?;
    constructor(config: ExtPanelConfig);
}
export default ExtPanel;
