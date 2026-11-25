import { Component, computed, inject, signal } from "@angular/core";
import { ToolApi } from "../../services/tool-api.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { Category } from "../../enums/category";
import { GroupedCatalog } from "../../models/grouped-catalog";
import { TranslatePipe } from "@ngx-translate/core";

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
  protected readonly categories = Object.values(Category);


  protected readonly availableTools = computed (() =>{
    const category = this.selectedCategory();
    const catalog = this.catalog();

    if(category && catalog){
      return catalog[category];
    }
    return [];
  });

  protected onCategoryChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  this.selectedCategory.set(value as Category);
  }

}
