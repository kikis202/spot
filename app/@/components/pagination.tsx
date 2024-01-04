import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const createPaginationArray = (page: number, rangeMax: number) => {
  const rangeMin = 1;

  if (page < rangeMin) page = 1;
  if (page > rangeMax) page = rangeMax;

  // number of elements to show
  const windowSize = 5;

  // Calculate the start and end points of the pagination window
  let start = Math.max(page - 2, rangeMin);
  let end = Math.min(page + 2, rangeMax);

  // Adjust start and end to ensure the window size remains constant, if possible
  if (end - start + 1 < windowSize) {
    if (start === rangeMin) {
      end = Math.min(start + windowSize - 1, rangeMax);
    } else {
      start = Math.max(end - windowSize + 1, rangeMin);
    }
  }

  // Create and return the pagination array
  const paginationArray = [];
  for (let i = start; i <= end; i++) {
    paginationArray.push(i);
  }

  return paginationArray;
};

type PaginationProps = {
  currentPage: number;
  size: number;
  totalCount: number;
  searchParams: object;
};

const Paginator = ({
  currentPage,
  size = 10,
  totalCount,
  searchParams = {},
}: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / size);
  const paginationArray = createPaginationArray(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={{
                query: {
                  ...searchParams,
                  page: currentPage - 1,
                },
              }}
            />
          </PaginationItem>
        )}

        {currentPage - 2 > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {paginationArray.map((page) => (
          <PaginationItem key={page} className="here">
            <PaginationLink
              isActive={page === currentPage}
              href={{
                query: {
                  ...searchParams,
                  page: page,
                },
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {currentPage + 2 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={{
                query: {
                  ...searchParams,
                  page: currentPage + 1,
                },
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default Paginator;
