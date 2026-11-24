import { Component, inject } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { ToolApi } from "../../services/tool-api.service";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  selector: "app-stock-list",
  styleUrl: "./stock-list.component.scss",
  templateUrl: "./stock-list.component.html",
})
export class StockList {
  private readonly toolApi = inject(ToolApi);
  protected readonly tools = toSignal (this.toolApi.getTools(), {initialValue : []})
}
