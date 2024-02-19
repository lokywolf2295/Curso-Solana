import { Component } from '@angular/core';

@Component({
  selector: 'heavy-settings-page',
  template: `
    <div class="flex justify-center items-center">
      <section class="px-24 py-32 bg-white bg-opacity-5">
        <p class="text-center text-3xl">Settings</p>
      </section>
    </div>
  `,
  standalone: true,
})
export class SettingsPageComponent {}
