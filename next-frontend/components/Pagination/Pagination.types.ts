export type PaginationProps = {
    currentPage?: number, 
    totalPages?: number, 
    onChange?: (event: React.ChangeEvent<unknown>, page: number) => void,
}