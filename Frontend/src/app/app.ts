import { Component, signal, computed, inject } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Reporteria');
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private layoutData = signal<{ hideHeader?: boolean; hideFooter?: boolean }>({});

  readonly hideHeader = computed(() => !!this.layoutData().hideHeader);
  readonly hideFooter = computed(() => !!this.layoutData().hideFooter);

  constructor(){
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(()=> {
        const data = this.collectDeepestRouteData(this.route);
        const layout = (data && (data['layout'] as any)) || {};
        this.layoutData.set(layout);
      });
  }

  private collectDeepestRouteData(route: ActivatedRoute): any {
    let r: ActivatedRoute | null = route;
    while(r?.firstChild) r = r.firstChild;
    return r?.snapshot.data || {};
  }
}
