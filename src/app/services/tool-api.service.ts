import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from 'rxjs';
import { Tool } from "../models/tool";
import { API_BASE_URL } from "../constants/api-url";
import { GroupedCatalog } from "../models/grouped-catalog";
import { NewTool } from "../models/new-tool";

@Service()
export class ToolApi {
    private readonly http = inject(HttpClient);

    getTools(): Observable<Tool[]>{
        return this.http.get<Tool[]>(`${API_BASE_URL}/tools`);
    }
    getGroupedCatalog(): Observable<GroupedCatalog>{
        return this.http.get<GroupedCatalog>(`${API_BASE_URL}/tools/grouped`);
    }

   createTool(newTool: NewTool): Observable<Tool> {
        return this.http.post<Tool>(`${API_BASE_URL}/tools`, newTool);
    }

    addStock(id: string, quantity:number):Observable<Tool>{
        return this.http.post<Tool>(`${API_BASE_URL}/tools/${id}/stock`, { quantity });
    }
    deleteTool(id: string):Observable<void>{
        return this.http.delete<void>(`${API_BASE_URL}/tools/${id}`);
    }
}
