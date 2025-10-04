// libs/shared/utils/src/lib/router/use-query-params-signal.ts

import { inject, computed, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

type ParamParsers<T> = {
    [K in keyof T]: (val: string | null) => T[K];
};

export function useQueryParamsSignal<T extends Record<string, any>>(
    parsers: ParamParsers<T>
): Signal<T> {
    const route = inject(ActivatedRoute);

    const queryParamMapSignal = toSignal(route.queryParamMap, {
        initialValue: route.snapshot.queryParamMap,
    });

    return computed(() => {
        const map = queryParamMapSignal()!;
        const result: Partial<T> = {};

        for (const key in parsers) {
            const raw = map.get(key);
            result[key] = parsers[key](raw);
        }

        return result as T;
    });
}
