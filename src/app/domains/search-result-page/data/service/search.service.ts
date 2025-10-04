import { computed, Injectable, signal } from '@angular/core';
import { IProduct } from 'src/app/domains/home/data/model/home.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  data = signal<IProduct[]>([]);
  query = signal<string>('');
  private categoryId = signal<number | null>(null);

  setQuery(q: string) {
    this.query.set(q);
  }

  setData(products: IProduct[]) {
    this.data.set(products);
  }

  setCategory(id: number | null) {
    this.categoryId.set(id);
  }

  filteredProducts = computed(() => {
    const q = this.query().toLowerCase();
    const cat = this.categoryId();

    // if (!q) return this.data();
    return this.data().filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      const matchesCategory = !cat || p.categoryId === cat;
      return matchesQuery && matchesCategory;
    });
  });
}
