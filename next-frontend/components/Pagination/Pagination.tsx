import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import { PaginationProps } from "./Pagination.types"

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
    return <MuiPagination shape="rounded" count={totalPages} page={currentPage} onChange={onChange} />
};

export default Pagination;
