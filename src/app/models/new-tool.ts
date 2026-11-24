import { ToolName } from "../enums/tool-name";
import { Category } from "../enums/category";

export interface NewTool {
    name: ToolName;
    category : Category;
    stock: number;
}
