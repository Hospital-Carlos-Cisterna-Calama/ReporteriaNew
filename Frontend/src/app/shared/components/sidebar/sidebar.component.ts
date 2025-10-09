import { Component, input, output, computed } from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import type { LucideIconData } from 'lucide-angular';

export interface SidebarItem {
  title: string;
  icon: string;
  description: string;
  id?: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly title = input('REPORTES');
  readonly subtitle = input('');
  readonly items = input<SidebarItem[]>([]);
  readonly selectedItemId = input<string | null>(null);
  readonly isOpen = input(true);
  readonly icons = input<Record<string, LucideIconData>>({});

  readonly toggleSidebar = output<void>();
  readonly selectItem = output<string>();

  readonly chevronIcons = { ChevronLeft, ChevronRight };
  readonly itemCount = computed(() => this.items().length);

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onSelectItem(itemTitle: string): void {
    this.selectItem.emit(itemTitle);
  }
}
