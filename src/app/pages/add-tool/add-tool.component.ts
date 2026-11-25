import { Component, computed, inject, signal } from "@angular/core";
import { ToolApi } from "../../services/tool-api.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Category } from "../../enums/category";
import { GroupedCatalog } from "../../models/grouped-catalog";
import { TranslatePipe } from "@ngx-translate/core";
import { ToolName } from "../../enums/tool-name";
import { Tool } from "../../models/tool";
import { NewTool } from "../../models/new-tool";

@Component({
  imports: [TranslatePipe],
  selector: "app-add-tool",
  styleUrl: "./add-tool.component.scss",
  templateUrl: "./add-tool.component.html",
})
export class AddTool {
  private readonly toolService = inject(ToolApi);
  protected readonly catalog = toSignal<GroupedCatalog>(this.toolService.getGroupedCatalog());
  protected readonly selectedCategory = signal<Category | null>(null);
  protected readonly selectedTool = signal<ToolName|null>(null);
  protected readonly quantity = signal<number>(1);
  protected readonly message = signal<string | null>(null);
  protected readonly categories = Object.values(Category);


  protected readonly availableTools = computed (() =>{
    const category = this.selectedCategory();
    const catalog = this.catalog();

    if(category && catalog){
      return catalog[category];
    }
    return [];
  });
  protected readonly canSave = computed(() => {
  const quantity = this.quantity();
  return !!this.selectedCategory() && !!this.selectedTool() && Number.isInteger(quantity) && quantity >= 1;
  });

  protected onCategoryChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  this.selectedCategory.set(value as Category);
  this.selectedTool.set(null);
  }
  protected onToolChange(event:Event):void{
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTool.set(value as ToolName);
  }
  protected onQuantityChange(event:Event):void{
    const value = (event.target as HTMLInputElement).value;
    this.quantity.set(Number(value));
  }
  protected save(): void{
    const category = this.selectedCategory();
    const tool =this.selectedTool();
    if(!this.canSave || !category || !tool){
      return;
    }
  
    const newTool: NewTool = {name: tool, category: category,stock:this.quantity()};

    this.toolService.createTool(newTool).subscribe({
      next:() =>{
        this.message.set('ADD_TOOL_PAGE.SUCCESS');
        this.selectedTool.set(null);
        this.quantity.set(1);
      },
      error: () =>{
        this.message.set('ERRORS.GENERIC');
      },
    });
  }

}
