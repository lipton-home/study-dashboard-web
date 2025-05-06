export interface Pagination<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
        sort: Sort;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    number: number;
    size: number;
    numberOfElements: number;
    sort: Sort;
    empty: boolean;
}

interface Sort {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
}