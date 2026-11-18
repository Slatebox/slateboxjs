import React from 'react';
import { type ListeningRoomModel } from './listeningRoom';
export interface ListeningRoomBoardProps {
    value: ListeningRoomModel;
    onChange?: (next: ListeningRoomModel) => void;
    readOnly?: boolean;
}
export declare function ListeningRoomBoard({ value, onChange, readOnly }: ListeningRoomBoardProps): React.JSX.Element;
