import { Routes } from '@angular/router';
import { StockList } from './pages/stock-list/stock-list.component';
import { AddTool } from './pages/add-tool/add-tool.component';


export const routes: Routes = [
    { path: '', redirectTo: 'stock-list', pathMatch: 'full' },
    { path: 'stock-list', component : StockList},
    { path : 'add-tool', component: AddTool},
    { path: '**', redirectTo: 'stock-list' },
];
