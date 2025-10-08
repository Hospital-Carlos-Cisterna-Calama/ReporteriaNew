import { Component, input, output, computed } from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight, LucideIconData } from 'lucide-angular';

export interface SidebarItem {
  title: string;
  icon: string;
  description: string;
  id?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // Inputs
  readonly title = input<string>('REPORTES');
  readonly subtitle = input<string>('');
  readonly items = input<SidebarItem[]>([]);
  readonly selectedItemId = input<string | null>(null);
  readonly isOpen = input<boolean>(true);
  readonly icons = input<Record<string, LucideIconData>>({});

  // Outputs
  readonly toggleSidebar = output<void>();
  readonly selectItem = output<string>();

  // Iconos internos
  readonly chevronIcons = {
    ChevronLeft,
    ChevronRight
  };

  // Computed
  readonly itemCount = computed(() => this.items().length);

  onToggle() {
    this.toggleSidebar.emit();
  }

  onSelectItem(itemTitle: string) {
    this.selectItem.emit(itemTitle);
  }
}
