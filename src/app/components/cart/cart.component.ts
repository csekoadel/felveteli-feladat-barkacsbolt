import { Component,inject,signal,output } from "@angular/core";
import { ToolApi } from "../../services/tool-api.service";
import { CartService } from "../../services/cart.service";
import { Purchase } from "../../models/purchase";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  selector: "app-cart",
  styleUrl: "./cart.component.scss",
  templateUrl: "./cart.component.html",
})
export class Cart {
  private readonly toolApi = inject(ToolApi);
  protected readonly cartService = inject(CartService);
  protected readonly message = signal<string | null>(null);
  readonly purchased = output<void>();
  

  protected buy(): void{
    const purchase : Purchase ={
      items: this.cartService.items().map((item) => ({toolId: item.toolId, quantity: item.quantity})),
    };
    this.toolApi.purchase(purchase).subscribe({
      next: ()  => {
        this.cartService.clear();
        this.message.set('CART.SUCCESS');
        this.purchased.emit();
      },
      error: () => {
        this.message.set('ERRORS.INSUFFICIENT_STOCK')
      }
    })
  }
}
