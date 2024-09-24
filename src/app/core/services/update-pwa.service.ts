import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdatePWAService {
  isNewVersionAvailable: boolean = false;
  private newVersionSubscription: Subscription | undefined;
  private initialLoad = true;
  public isOnline: boolean = false;

  constructor(private swUpdate: SwUpdate) {
    this.checkForUpdate();
    this.updateOnlineStatus();
    window.addEventListener('online', this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));
  }

  private updateOnlineStatus(): void {
    const previousStatus = this.isOnline;
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);

    // Handle the case when the user comes online after being offline
    if (!this.initialLoad && !previousStatus && this.isOnline) {
      window.location.reload();
    }
    this.initialLoad = false;
  }

  checkForUpdate(): void {
    if (!this.swUpdate.isEnabled) {
      debugger
      return;
    }

    this.newVersionSubscription?.unsubscribe();

    this.newVersionSubscription = this.swUpdate.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          // this.isNewVersionAvailable = true;
          // this.promptUserToReload();
          // Check if there are significant changes before prompting
          if (this.hasSignificantChanges(evt.latestVersion.hash)) {
            this.isNewVersionAvailable = true;
            this.promptUserToReload();
          }
          break;
        case 'VERSION_INSTALLATION_FAILED':
          alert(`Failed to install app version: ${evt.error}`);
          break;
      }
    });
  }

  promptUserToReload(): void {
    const userConfirmed = confirm('A new version of the app is available. Reload now?');
    if (userConfirmed) {
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload();
      });
    }
  }

  unsubscribeFromUpdates(): void {
    this.newVersionSubscription?.unsubscribe();
  }

  private hasSignificantChanges(newVersionHash: string): boolean {
  const lastKnownVersion = localStorage.getItem('lastKnownVersion');

  // Compare hashes or versions
  if (lastKnownVersion !== newVersionHash) {
    localStorage.setItem('lastKnownVersion', newVersionHash);
    return true; // Significant change detected
  }

  return false; // No significant change
}
}
