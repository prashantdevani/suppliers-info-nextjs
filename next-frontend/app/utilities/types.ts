interface IMetaData {
    total_count: number;
    total_page: number;
    limit: number;
    page: number;
    next_page: string | null;
    prev_page: string | null;
}
