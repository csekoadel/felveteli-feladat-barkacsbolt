import { Component, inject, signal,computed } from "@angular/core";
import { ToolApi } from "../../services/tool-api.service";
import { TranslatePipe } from '@ngx-translate/core';
import { Tool } from "../../models/tool";
import { ToolName } from "../../enums/tool-name";
import { Category } from "../../enums/category";
import { CartService } from "../../services/cart.service";

@Component({
  imports: [TranslatePipe],
  selector: "app-stock-list",
  styleUrl: "./stock-list.component.scss",
  templateUrl: "./stock-list.component.html",
})
export class StockList {
  private readonly toolApi = inject(ToolApi);
  protected readonly tools = signal<Tool[]>([]);
  protected readonly message = signal<string | null>(null);
  protected readonly filterCategory = signal<Category | null>(null);
  protected readonly filterTool = signal<ToolName|null>(null);
  protected readonly categories = Object.values(Category);
  protected readonly toolNames =Object.values(ToolName);
  protected readonly cartService = inject(CartService);
  constructor() {
  this.loadTools();
}

  protected loadTools(): void {
    this.toolApi.getTools().subscribe({
      next: (response)=> this.tools.set(response),
    })
  }
  protected increaseStock(id: string, quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return;
  }
  this.toolApi.addStock(id, quantity).subscribe({
    next: () => this.loadTools(),
  });
  
  }
  protected removeTool(id:string):void{
    this.toolApi.deleteTool(id).subscribe({
      next: () => {
        this.message.set(null);
      this.loadTools();
    },
    error: () =>{
      this.message.set('ERRORS.STOCK_NOT_EMPTY');
    },
  });
  }
  protected readonly filteredTools = computed(() =>{
    const category = this.filterCategory();
    const tool = this.filterTool();
    return this.tools().filter((item) =>(!category || item.category === category) && (!tool || item.name === tool));
  })
  protected onFilterCategoryChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  this.filterCategory.set(value as Category);
  }
  protected onFilterToolChange(event:Event):void{
    const value = (event.target as HTMLSelectElement).value;
    this.filterTool.set(value as ToolName);
  }
  protected addToCart(tool: Tool, quantity: number): void{
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > tool.stock) {
      return;

  }
    this.cartService.add(tool,quantity);
  }

}
