import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentMove: { Player: 1 | 2 } = { Player: 1 };

  skip(player: 1 | 2) {
    if (this.currentMove.Player === player) {
      this.currentMove = {
        Player: this.currentMove.Player === 1 ? 2 : 1,
      };
    }
  }
}
