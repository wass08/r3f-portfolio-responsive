import { useState, useCallback, useMemo } from 'react';

/**
 * Hook for managing pagination of project items
 * @param {array} items - Array of items to paginate
 * @param {number} itemsPerPage - Items to display per page (default: 12)
 * @returns {object} - {displayItems, currentPage, totalPages, loadMore, hasMore, reset}
 */
export const usePagination = (items = [], itemsPerPage = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Memoize total pages to prevent unnecessary recalculations
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Memoize displayed items - only recalculate when currentPage or items changes
  const displayItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(0, endIndex); // Show all items from page 1 to current page
  }, [items, currentPage, itemsPerPage]);

  // Remaining items to load
  const remainingItems = useMemo(() => {
    return Math.max(0, items.length - displayItems.length);
  }, [items.length, displayItems.length]);

  // Check if more items available
  const hasMore = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  // Load next page
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  // Reset pagination
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    displayItems,
    currentPage,
    totalPages,
    loadMore,
    hasMore,
    remainingItems,
    reset,
  };
};

/**
 * Hook for managing filter + pagination together
 * @param {array} items - All items
 * @param {function} filterFn - Filter function that returns boolean
 * @param {number} itemsPerPage - Items per page
 * @returns {object} - Pagination state + filtered items
 */
export const useFilteredPagination = (items = [], filterFn = () => true, itemsPerPage = 12) => {
  const filteredItems = useMemo(() => {
    return items.filter(filterFn);
  }, [items, filterFn]);

  return usePagination(filteredItems, itemsPerPage);
};
