import { useMemo } from 'react';
import { useLocation } from 'remix';

export function useResourcesSearchParams(): URLSearchParams {
  const location = useLocation();
  const searchParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const supported = ['list', 'q', 'category', 'platform', 'language'];

    for (const key of searchParams.keys()) {
      if (supported.includes(key)) {
        continue;
      }

      searchParams.delete(key);
    }

    return searchParams.toString();
  }, [location.search]);

  return searchParams;
}
