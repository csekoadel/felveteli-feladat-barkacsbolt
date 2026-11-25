import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './components/language-switcher/language-switcher.component';

@Component({
  imports: [RouterOutlet, LanguageSwitcher],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {
}
