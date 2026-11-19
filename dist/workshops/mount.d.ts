import { type WorkshopBoardProps } from './index';
import { type Workshop } from './model';
type MountOptions = Omit<WorkshopBoardProps, 'value' | 'onChange'> & {
    onChange?: WorkshopBoardProps['onChange'];
};
/** Mount a playable workshop from data in a plain DOM host. The owner persists committed changes. */
export declare function mountWorkshop(element: HTMLElement, initial: Workshop, options?: MountOptions): {
    update: (next: Workshop) => void;
    destroy(): void;
};
export {};
