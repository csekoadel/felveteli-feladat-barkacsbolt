import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { TranslatePipe } from "@ngx-translate/core";
import { LanguageSwitcher } from "../language-switcher/language-switcher.component";

@Component({
  imports: [RouterLink, RouterLinkActive,TranslatePipe,LanguageSwitcher],
  selector: "app-navbar",
  styleUrl: "./navbar.component.scss",
  templateUrl: "./navbar.component.html",
})
export class Navbar {}
