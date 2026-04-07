import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  private isGuest: boolean = true;
  OnchangeGuestStatus(isGuest: boolean) {
    this.isGuest = isGuest;
  }
  getGuestStatus(): boolean {
    return this.isGuest;
  }
}
