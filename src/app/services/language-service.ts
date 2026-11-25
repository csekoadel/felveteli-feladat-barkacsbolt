import { Service, inject, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Language } from "../enums/language";

@Service()
export class LanguageService {
    private readonly translate = inject(TranslateService);
    readonly currentLanguage = signal<Language>(Language.HU);

    setLanguage(language: Language):void{
        this.translate.use(language);
        this.currentLanguage.set(language);
    }

}
