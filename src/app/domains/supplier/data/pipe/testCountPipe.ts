import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'testCount',
    standalone: true
})
export class ItemCountPipe implements PipeTransform {
    transform(categoryId: number | undefined, selectedCategoryList: any[]): number {
        console.log('calling pipe', categoryId, selectedCategoryList);

        if (!selectedCategoryList || !categoryId) return 0;

        return selectedCategoryList.reduce((count, category) => {
            return category.categoryId === categoryId
                ? count + (category.itemList?.length || 0)
                : count;
        }, 0);
    }
}