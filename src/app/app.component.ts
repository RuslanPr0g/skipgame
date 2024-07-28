import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
  private rPressTimes: number[] = [];
  private lPressTimes: number[] = [];
  rBlocked = false;
  lBlocked = false;

  blur: boolean = false;

  currentPlayer: Player = 1;

  winner: Player | null = null;

  restartEnabled: boolean = true;

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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const now = Date.now();

    if (event.key === ' ' || event.key === 'Enter') {
      if (this.gameover) {
        this.start();
      }
      return;
    }

    const variation = this.getRandomNumber(1, 100000);

    if (
      (((event.key === 'r' || event.key === '1') && this.currentPlayer === 1) ||
        ((event.key === 'b' || event.key === '2') &&
          this.currentPlayer === 2)) &&
      variation % 2 === 0
    ) {
      this.blur = true;
      setTimeout(() => (this.blur = false), 300);
      return;
    }

    if (event.key === 'r' || event.key === '1') {
      if (this.rBlocked) {
        console.log('Key "r" is temporarily blocked.');
        return;
      }

      this.trackKeyPress('r', this.rPressTimes, now);

      this.skip(1);
    } else if (event.key === 'b' || event.key === '2') {
      if (this.lBlocked) {
        console.log('Key "l" is temporarily blocked.');
        return;
      }

      this.trackKeyPress('l', this.lPressTimes, now);

      this.skip(2);
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
    this.timeToGameOver = this.getRandomNumber(5, 20);
    this.seconds = 0;
    this.winner = null;

    this.subscription = timer(0, 1000).subscribe(() => {
      console.warn('running timer', this.timeToGameOver - this.seconds);
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
    this.restartEnabled = false;
    this.rBlocked = false;
    this.lBlocked = false;
    this.rPressTimes = [];
    this.lPressTimes = [];
    setTimeout(() => (this.restartEnabled = true), 2000);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private trackKeyPress(key: 'r' | 'l', pressTimes: number[], now: number) {
    pressTimes = pressTimes.filter((time) => now - time <= 1000);
    pressTimes.push(now);

    if (pressTimes.length > 3) {
      console.log(
        `Key "${key}" is pressed too frequently, it will be blocked for 500ms.`
      );
      if (key === 'r') {
        this.rBlocked = true;
      } else if (key === 'l') {
        this.lBlocked = true;
      }
      setTimeout(() => {
        if (key === 'r') {
          this.rBlocked = false;
        } else if (key === 'l') {
          this.lBlocked = false;
        }
        console.log(`Key "${key}" is now unblocked.`);
      }, 2000);

      pressTimes = [];
    }

    if (key === 'r') {
      this.rPressTimes = pressTimes;
    } else if (key === 'l') {
      this.lPressTimes = pressTimes;
    }
  }
}
