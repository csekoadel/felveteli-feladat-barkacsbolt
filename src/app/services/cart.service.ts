import { Service,signal } from "@angular/core";
import { CartItem } from "../models/cart-item";
import { Tool } from "../models/tool";


@Service()
export class CartService {
    readonly items = signal<CartItem[]>([]);
    clear() : void{
        this.items.set([]);
    }
    remove(id: string): void {
        this.items.update((old) => old.filter((item) => item.toolId !== id));
    }
    add(tool: Tool, quantity: number): void {
    this.items.update((old) => {
    const exists = old.some((item) => item.toolId === tool.id);

    if (exists) {
      return old.map((item) =>
        item.toolId === tool.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    }

    return [...old, { name: tool.name, toolId: tool.id, quantity: quantity}];
  });
}
}