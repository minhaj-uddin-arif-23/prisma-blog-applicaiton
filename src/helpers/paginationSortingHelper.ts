type Ioptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};
type IoptionsResult = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
};

const paginationSortingHelper = (options: Ioptions): IoptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 6;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  return {
    page,
    limit,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
