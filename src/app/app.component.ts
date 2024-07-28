import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subscription, timer } from 'rxjs';

type Player = 1 | 2;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  currentPlayer: Player = 1;

  winner: Player | null = null;

  subscription?: Subscription;

  gameover: boolean = true;

  timeToGameOver: number = 0;
  seconds: number = 0;

  ngOnInit(): void {
    this.gameover = true;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get notCurrentPlayer(): Player {
    return this.currentPlayer === 1 ? 2 : 1;
  }

  skip(player: 1 | 2) {
    if (this.currentPlayer === player) {
      this.currentPlayer = this.notCurrentPlayer;
    }
  }

  start(): void {
    this.timeToGameOver = this.getRandomNumber(3, 5);
    this.seconds = 0;
    this.winner = null;

    this.subscription = timer(0, 1000).subscribe(() => {
      console.warn("running timer", this.timeToGameOver - this.seconds);
      if (this.seconds > this.timeToGameOver) {
        this.endGame();
        this.subscription?.unsubscribe();
      } else {
        this.seconds++;
      }
    });

    this.gameover = false;
  }

  private endGame() {
    this.gameover = true;
    this.winner = this.notCurrentPlayer;
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
