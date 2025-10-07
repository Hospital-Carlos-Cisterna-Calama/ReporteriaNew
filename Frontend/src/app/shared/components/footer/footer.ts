import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AppIconComponent } from '../ui/app-icon/app-icon.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // #region Constants
  readonly year = new Date().getFullYear();
  readonly appVersion = environment.appVersion;
  readonly envName = environment.production ? 'PROD' : 'DEV';
  readonly envClass = environment.production ? 'bg-emerald-600' : 'bg-amber-700';
  // #endregion

  // #region Handlers
  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' as ScrollBehavior });
  }

  getAngularVersion(): string {
    return '20.x';
  }
  // #endregion
}
