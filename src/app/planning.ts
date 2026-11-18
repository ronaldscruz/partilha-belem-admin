export interface Stock {
  meat: number;
  cheese: number;
  water: number;
  drinks: number;
}

export interface Campaign {
  id: string;
  date: string;
  minutes: number;
  people: number;
}

export function kitCapacity(stock: Stock): number {
  return Math.min(
    stock.meat + stock.cheese,
    stock.water,
    Math.floor((stock.water + stock.drinks) / 2),
  );
}

export function campaignCoverage(stock: Stock, campaigns: readonly Campaign[]) {
  const remaining = { ...stock };
  const ordered = [...campaigns].sort((first, second) => first.date.localeCompare(second.date));

  return ordered.map((campaign) => {
    const covered = kitCapacity(remaining) >= campaign.people;
    if (covered) {
      const meat = Math.min(remaining.meat, campaign.people);
      const drinks = Math.min(remaining.drinks, campaign.people);
      remaining.meat -= meat;
      remaining.cheese -= campaign.people - meat;
      remaining.water -= campaign.people * 2 - drinks;
      remaining.drinks -= drinks;
    }
    return { ...campaign, covered };
  });
}
