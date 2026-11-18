import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { campaignCoverage, kitCapacity, type Campaign, type Stock } from './planning';

interface PlanningState {
  campaigns: Campaign[];
  stock: Stock;
}

type Page = 'home' | 'campaigns' | 'stock' | 'coverage';
const storageKey = 'partilha-belem-admin.v1';
const emptyStock: Stock = { meat: 0, cheese: 0, water: 0, drinks: 0 };

function readState(): PlanningState {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored) as PlanningState;
  } catch {
    // A blocked or unavailable local store should still allow opening the preview.
  }
  return { campaigns: [], stock: { ...emptyStock } };
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
})
export class App {
  readonly page = signal<Page>('home');
  readonly state = signal(readState());
  readonly message = signal('');
  readonly error = signal(false);
  readonly capacity = computed(() => kitCapacity(this.state().stock));
  readonly coverage = computed(() => campaignCoverage(this.state().stock, this.state().campaigns));
  readonly stockItems = [
    { key: 'meat', label: 'Sanduíches de carne' },
    { key: 'cheese', label: 'Sanduíches de queijo' },
    { key: 'water', label: 'Águas' },
    { key: 'drinks', label: 'Outras bebidas' },
  ] as const;
  readonly availableStockItems = computed(() =>
    this.stockItems.filter(({ key }) => this.state().stock[key] === 0),
  );

  campaignDate = '';
  campaignMinutes: number | null = null;
  campaignPeople: number | null = null;
  stockItemDraft: keyof Stock = 'meat';
  stockQuantityDraft: number | null = null;
  editingStock = false;

  navigate(page: Page): void {
    this.message.set('');
    this.page.set(page);
  }

  openCampaign(dialog: HTMLDialogElement): void {
    this.message.set('');
    this.campaignDate = '';
    this.campaignMinutes = this.campaignPeople = null;
    dialog.showModal();
  }

  saveCampaign(dialog: HTMLDialogElement): void {
    const { campaignDate: date, campaignMinutes: minutes, campaignPeople: people } = this;
    if (!date || minutes === null || people === null || !Number.isSafeInteger(minutes)
        || !Number.isSafeInteger(people) || minutes < 1 || people < 1) {
      this.notify('Informe a data, a duração e a meta com valores válidos.', true);
      return;
    }
    const campaign: Campaign = { id: crypto.randomUUID(), date, minutes, people };
    const saved = this.persist({
      ...this.state(),
      campaigns: [...this.state().campaigns, campaign],
    }, 'Campanha registrada.');
    if (saved) dialog.close();
  }

  undoCampaign(campaign: Campaign): void {
    const date = this.formatDate(campaign.date);
    if (!window.confirm(`Desfazer o cadastro da campanha de ${date}?`)) return;

    const state = this.state();
    this.persist({
      ...state,
      campaigns: state.campaigns.filter(({ id }) => id !== campaign.id),
    }, 'Cadastro da campanha desfeito.');
  }

  openStock(dialog: HTMLDialogElement, item?: keyof Stock): void {
    this.message.set('');
    this.editingStock = item !== undefined;
    const [available] = this.availableStockItems();
    this.selectStockItem(item ?? available?.key ?? 'meat');
    dialog.showModal();
  }

  selectStockItem(item: keyof Stock): void {
    this.stockItemDraft = item;
    this.stockQuantityDraft = this.state().stock[item] || null;
  }

  saveStock(dialog: HTMLDialogElement): void {
    const quantity = this.stockQuantityDraft;
    if (quantity === null || !Number.isSafeInteger(quantity) || quantity < 1) {
      this.notify('Informe uma quantidade inteira maior que zero.', true);
      return;
    }
    if (this.updateStock(this.stockItemDraft, quantity, 'Estoque atualizado.')) dialog.close();
  }

  removeStockItem(item: keyof Stock, label: string): void {
    if (!window.confirm(`Remover ${label.toLowerCase()} do estoque?`)) return;
    this.updateStock(item, 0, 'Item removido do estoque.');
  }

  private updateStock(item: keyof Stock, quantity: number, message: string): boolean {
    const state = this.state();
    return this.persist({ ...state, stock: { ...state.stock, [item]: quantity } }, message);
  }

  formatDate(value: string): string {
    return value.split('-').reverse().join('/');
  }

  private persist(next: PlanningState, message: string): boolean {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      this.state.set(next);
      this.notify(message, false);
      return true;
    } catch {
      this.notify('Não foi possível salvar neste navegador.', true);
      return false;
    }
  }

  private notify(message: string, error: boolean): void {
    this.error.set(error);
    this.message.set(message);
  }
}
