import {Component, HostListener, OnInit} from '@angular/core';
import {Router,NavigationEnd} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'pwa';

    deferredPrompt: any;
    showButton = false;

    @HostListener('window:beforeinstallprompt', ['$event'])
    onbeforeinstallprompt(e: any) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.

        this.deferredPrompt = e;

        if (e && !this.isInstalled()) return this.showButton = true;
        return this.showButton = false;
    }

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.router.events.subscribe((evt: any) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }

            window.scrollTo(0, 0);

            // console.log(evt.url, 'sini'); // => check route validity if menu not listed on ngrx
        });
    }

    isInstalled() {
        // For Android
        if (window.matchMedia('(display-mode: standalone)').matches) return true

        // If neither is true, it's not installed
        return false
    }

    addToHomeScreen() {
        // hide our user interface that shows our A2HS button
        this.showButton = false;
        // Show the prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice
            .then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                this.deferredPrompt = null;
            });
    }
}
