import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { Observable } from 'rxjs';
import { Tool } from "../models/tool";
import { API_BASE_URL } from "../constants/api-url";

@Service()
export class ToolApi {
    private readonly http = inject(HttpClient);

    getTools(): Observable<Tool[]>{
        return this.http.get<Tool[]>(`${API_BASE_URL}/tools`)
    }
}
