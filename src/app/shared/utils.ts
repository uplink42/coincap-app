import { Asset } from '../models';

export const applySearchAndPaginationToResults = (
  searchTerm: string,
  availableAssets: Asset[],
  pageIndex: number,
  itemsPerPage: number
) => {
  let filteredAvailableAssets = [...availableAssets];
  if (searchTerm !== '') {
    filteredAvailableAssets = availableAssets.filter((asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const currentPage = [
    ...filteredAvailableAssets.slice(
      itemsPerPage * pageIndex,
      itemsPerPage * (pageIndex + 1)
    ),
  ];

  return { assets: currentPage, total: filteredAvailableAssets };
};
