import { SuperComponent, RelationsOptions } from '../common/src/index';
export default class TabPanel extends SuperComponent {
    relations: RelationsOptions;
    properties: import("./type").TdTabPanelProps;
    data: {
        prefix: string;
        classPrefix: string;
        active: boolean;
        hide: boolean;
        id: string;
    };
    setId(id: any): void;
    observers: {
        label(): void;
    };
    getComputedName(): string;
    update(): void;
    render(active: Boolean, parent: any): void;
}
