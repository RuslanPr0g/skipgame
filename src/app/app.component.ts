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
  private CAT_EMOJIS: string[] = [
    '😸', // Grinning Cat
    '😺', // Smiling Cat
    '😻', // Heart Eyes Cat
    '😽', // Kissing Cat
    '😼', // Smirking Cat
    '😹', // Cat with Tears of Joy
    '😿', // Crying Cat
    '😾', // Pouting Cat
    '🙀', // Weary Cat
    '😺', // Smiling Cat with Open Mouth
    '😸', // Grinning Cat with Smiling Eyes
    '😹', // Cat Face with Tears of Joy
    '😻', // Heart Eyes Cat
    '😽', // Kissing Cat Face
    '🙀', // Astonished Cat
    '😾', // Pouting Cat Face
    '😿', // Crying Cat Face
    '😺', // Smiling Cat Face with Open Mouth
    '😸', // Grinning Cat Face with Smiling Eyes
    '😹', // Cat Face with Tears of Joy
    '😻', // Heart Eyes Cat Face
    '😽', // Kissing Cat Face
    '😼', // Smirking Cat Face
    '🙀', // Fearful Cat Face
    '😿', // Crying Cat Face
    '😾', // Angry Cat Face
    '🙀', // Weary Cat Face
    '😺', // Smiling Cat Face with Open Mouth
    '😸', // Grinning Cat Face with Smiling Eyes
    '😻', // Cat Face with Heart Eyes
    '😽', // Kissing Cat Face
    '😾', // Pouting Cat Face
    '😿', // Crying Cat Face
    '😹',  // Cat Face with Tears of Joy
    '🙀', // Shocked Cat Face
  ];

  private rPressTimes: number[] = [];
  private lPressTimes: number[] = [];
  rBlocked = false;
  lBlocked = false;

  rCat: string = this.CAT_EMOJIS[0];
  bCat: string = this.CAT_EMOJIS[1];

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

    this.rCat = this.getRandomCat();
    this.bCat = this.getRandomCat();
  }

  private getRandomCat(): string {
    const variant = this.getRandomNumber(0, this.CAT_EMOJIS.length - 1);
    return this.CAT_EMOJIS[variant];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      if (this.gameover) {
        this.start();
      }
      return;
    }

    if (this.gameover) return;

    this.handleGameUpdate(event);
  }

  private handleGameUpdate(event: KeyboardEvent) {
    const now = Date.now();

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
