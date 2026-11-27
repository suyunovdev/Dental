import { useCallback, useMemo, useState } from 'react';

export interface TableParams {
  page: number;
  pageSize: number;
  search: string;
}

export interface UseTableParamsOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  defaultSearch?: string;
}

/**
 * Jadval parametrlari (sahifalash va qidiruv)ni boshqaruvchi hook
 * Arxitektura talabi: sahifa raqami va qidiruv so'zi URL query string'da saqlanadi
 * (bemorlar yoki xizmatlar ro'yxatida "Orqaga" bosilganda holat yo'qolmaydi)
 */
export function useTableParams(options?: UseTableParamsOptions) {
  const defaultPage = options?.defaultPage ?? 1;
  const defaultPageSize = options?.defaultPageSize ?? 20;
  const defaultSearch = options?.defaultSearch ?? '';

  // URL dan parametrlarni o'qish (agar brauzer muhiti bo'lsa)
  const getUrlParams = (): TableParams => {
    if (typeof window === 'undefined') {
      return { page: defaultPage, pageSize: defaultPageSize, search: defaultSearch };
    }
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '', 10);
    const pageSize = parseInt(params.get('pageSize') || '', 10);
    const search = params.get('search') || '';

    return {
      page: !isNaN(page) && page > 0 ? page : defaultPage,
      pageSize: !isNaN(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : defaultPageSize,
      search: search || defaultSearch,
    };
  };

  const [params, setParamsState] = useState<TableParams>(getUrlParams);

  // URL ni xavfsiz yangilash
  const syncWithUrl = useCallback((newParams: TableParams) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);

    if (newParams.page > 1) {
      url.searchParams.set('page', String(newParams.page));
    } else {
      url.searchParams.delete('page');
    }

    if (newParams.pageSize !== defaultPageSize) {
      url.searchParams.set('pageSize', String(newParams.pageSize));
    } else {
      url.searchParams.delete('pageSize');
    }

    if (newParams.search.trim()) {
      url.searchParams.set('search', newParams.search.trim());
    } else {
      url.searchParams.delete('search');
    }

    window.history.replaceState({}, '', url.toString());
  }, [defaultPageSize]);

  const setPage = useCallback((page: number) => {
    setParamsState((prev) => {
      const next = { ...prev, page };
      syncWithUrl(next);
      return next;
    });
  }, [syncWithUrl]);

  const setPageSize = useCallback((pageSize: number) => {
    setParamsState((prev) => {
      // Sahifa hajmi o'zgarganda birinchi sahifaga qaytish standart amaliyot
      const next = { ...prev, page: 1, pageSize };
      syncWithUrl(next);
      return next;
    });
  }, [syncWithUrl]);

  const setSearch = useCallback((search: string) => {
    setParamsState((prev) => {
      // Qidiruv o'zgarganda birinchi sahifaga qaytish kerak
      const next = { ...prev, page: 1, search };
      syncWithUrl(next);
      return next;
    });
  }, [syncWithUrl]);

  const reset = useCallback(() => {
    const next = { page: defaultPage, pageSize: defaultPageSize, search: defaultSearch };
    setParamsState(next);
    syncWithUrl(next);
  }, [defaultPage, defaultPageSize, defaultSearch, syncWithUrl]);

  return {
    params,
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    setPage,
    setPageSize,
    setSearch,
    reset,
  };
}
