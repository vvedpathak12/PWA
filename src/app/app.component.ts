import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subscription, switchMap } from 'rxjs';
import { UpdatePWAService } from './core/services/update-pwa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pwa';
  isOnline: boolean;
  isNewVersionAvailable: boolean = false;
  newVersionSubscription: Subscription | undefined;
  private initialLoad = true; // Track if it's the first load
  private userConfirmedUpdate: boolean = false; // Track if the user confirmed the update

  constructor(private swUpdate: SwUpdate, public updateService: UpdatePWAService) {
    this.isOnline = false;
    // this.checkForUpdate();

    // // Check for updates every hour
    // interval(4 * 60 * 60 * 1000).pipe(
    //   switchMap(() => {
    //     this.checkForUpdate();
    //     return [];
    //   })
    // ).subscribe();
  }

  ngOnInit(): void {
    // this.updateOnlineStatus();

    // window.addEventListener('online', this.updateOnlineStatus.bind(this));
    // window.addEventListener('offline', this.updateOnlineStatus.bind(this));
  }

  // private updateOnlineStatus(): void {
  //   this.isOnline = window.navigator.onLine;
  //   console.info(`isOnline=[${this.isOnline}]`);
  // }

  private updateOnlineStatus(): void {
    const previousStatus = this.isOnline; // Keep track of previous status
    this.isOnline = window.navigator.onLine; // Update current status

    console.info(`isOnline=[${this.isOnline}]`);

    // Show an alert only if the user comes online after being offline
    if (!this.initialLoad && !previousStatus && this.isOnline) {
      // const userConfirmed = confirm('You are back online. Would you like to reload the page?');
      // if (userConfirmed) {
      //   window.location.reload(); // Reload the application
      // }
      window.location.reload();
    }
    // Disable initialLoad after the first check
    this.initialLoad = false;
  }

  // checkForUpdate(): void {
  //   this.newVersionSubscription?.unsubscribe(); // Unsubscribe from any previous subscriptions

  //   if (!this.swUpdate.isEnabled) {
  //     return; // Exit if service worker is not enabled
  //   }

  //   this.newVersionSubscription = this.swUpdate.versionUpdates.subscribe(evt => {
  //     switch (evt.type) {
  //       case 'VERSION_DETECTED':
  //         // New version is being downloaded
  //         break;
  //       case 'VERSION_READY':
  //         // New version is ready to be activated
  //         this.isNewVersionAvailable = true;
  //         this.promptUserToReload();
  //         break;
  //       case 'VERSION_INSTALLATION_FAILED':
  //         // Handle installation failure
  //         alert(`Failed to install app version: ${evt.error}`);
  //         break;
  //     }
  //   });
  // }

  // promptUserToReload(): void {
  //   // Prompt the user to reload the application
  //   const userConfirmed = confirm('A new version of the app is available. Reload now?');
  //   if (userConfirmed) {
  //     this.swUpdate.activateUpdate().then(() => {
  //       window.location.reload(); // Reload the application
  //     });
  //   }
  // }

  // checkForUpdate(): void {
  //   this.newVersionSubscription?.unsubscribe(); // Unsubscribe from any previous subscriptions

  //   if (!this.swUpdate.isEnabled) {
  //     return; // Exit if service worker is not enabled
  //   }

  //   this.newVersionSubscription = this.swUpdate.versionUpdates.subscribe(evt => {
  //     switch (evt.type) {
  //       case 'VERSION_DETECTED':
  //         // New version is being downloaded
  //         break;
  //       case 'VERSION_READY':
  //         // New version is ready to be activated
  //         this.isNewVersionAvailable = true;
  //         if (!this.userConfirmedUpdate) {
  //           this.promptUserToReload();
  //         }
  //         break;
  //       case 'VERSION_INSTALLATION_FAILED':
  //         // Handle installation failure
  //         alert(`Failed to install app version: ${evt.error}`);
  //         break;
  //     }
  //   });
  // }

  checkForUpdate(): void {
    this.newVersionSubscription?.unsubscribe(); // Unsubscribe from any previous subscriptions

    if (!this.swUpdate.isEnabled) {
      return; // Exit if service worker is not enabled
    }

    this.newVersionSubscription = this.swUpdate.versionUpdates.subscribe(evt => {
      console.log(evt);
      switch (evt.type) {
        case 'VERSION_DETECTED':
          // New version is being downloaded
          console.log(`Downloading new app version: ${evt.version.hash}`);
          break;
        case 'VERSION_READY':
          console.log(`Current app version: ${evt.currentVersion.hash}`);
          console.log(`New app version ready for use: ${evt.latestVersion.hash}`);
          // New version is ready to be activated
          this.isNewVersionAvailable = true;
          this.promptUserToReload();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          // Handle installation failure
          alert(`Failed to install app version: ${evt.error}`);
          break;
      }
    });
  }

  promptUserToReload(): void {
    // Prompt the user to reload the application
    const userConfirmed = confirm('A new version of the app is available. Reload now?');
    if (userConfirmed) {
      // this.userConfirmedUpdate = true; // Set the flag to true
      this.swUpdate.activateUpdate().then(() => {
        window.location.reload(); // Reload the application
      });
    }
  }

  ngOnDestroy(): void {
    this.updateService.unsubscribeFromUpdates(); // Clean up subscriptions
  }
}
