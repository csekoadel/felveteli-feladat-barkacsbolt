import { Category } from "../enums/category";
import { ToolName } from "../enums/tool-name";

export type GroupedCatalog = Record <Category,ToolName[]>
