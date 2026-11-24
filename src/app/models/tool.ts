import { Category } from "../enums/category";
import { ToolName } from "../enums/tool-name";

export interface Tool {
    name : ToolName;
    category: Category;
    stock: number;
    id: string;
}
