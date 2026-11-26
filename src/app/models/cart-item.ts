import { ToolName } from "../enums/tool-name";

export interface CartItem {
    name:ToolName;
    toolId: string;
    quantity: number;
}
