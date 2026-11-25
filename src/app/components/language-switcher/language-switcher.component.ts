import { Component,inject } from "@angular/core";
import { LanguageService } from "../../services/language-service";
import { Language } from "../../enums/language";

@Component({
  imports: [],
  selector: "app-language-switcher",
  styleUrl: "./language-switcher.component.scss",
  templateUrl: "./language-switcher.component.html",
})
export class LanguageSwitcher {
  protected readonly languageService = inject(LanguageService);
  protected readonly  Language = Language;
}
