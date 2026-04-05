import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlay {
  show = input(false);
}
