import { Component, output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  addTaskClicked = output<void>();

  onAddClick() {
    this.addTaskClicked.emit();
  }
}
