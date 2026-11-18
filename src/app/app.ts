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

  campaignDate = '';
  campaignMinutes: number | null = null;
  campaignPeople: number | null = null;
  stockDraft: Record<keyof Stock, number | null> = { ...this.state().stock };

  navigate(page: Page): void {
    this.message.set('');
    this.page.set(page);
  }

  saveCampaign(): void {
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
    if (saved) {
      this.campaignDate = '';
      this.campaignMinutes = this.campaignPeople = null;
    }
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

  saveStock(): void {
    const { meat, cheese, water, drinks } = this.stockDraft;
    if (meat === null || cheese === null || water === null || drinks === null
        || [meat, cheese, water, drinks].some((value) => !Number.isSafeInteger(value) || value < 0)) {
      this.notify('Informe quantidades inteiras a partir de zero.', true);
      return;
    }
    this.persist({ ...this.state(), stock: { meat, cheese, water, drinks } }, 'Estoque atualizado.');
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
