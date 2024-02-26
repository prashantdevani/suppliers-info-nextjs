"use client";
import styles from './page.module.css'
import SearchInput from '../components/SearchInput/SearchInput'
import Pagination from '../components/Pagination/Pagination'
import { useEffect, useState } from 'react';
import MuiTable from '../components/Table/Table';
import useApi from './hooks/useApi';
import { GridSortModel } from '@mui/x-data-grid';
import React from 'react';
import Rating from '@mui/material/Rating';
import { ActivityApiResponse } from './api/activities/route';

interface IActivityUseApi {
  loading: boolean,
  error: string,
  data: ActivityApiResponse | null,
  refetch: () => void,
}

export default function Home() {
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortModel, setSortModel] = React.useState<GridSortModel>([{ field: "title", sort: "asc" }]);

  const { loading, error, data, refetch }: IActivityUseApi = useApi({
    axiosConfig: {
      url: "/api/activities", params: {
        page: currentPage,
        limit: 5,
        sort: sortModel?.[0]?.field,
        sort_order: sortModel?.[0]?.sort,
        search: search
      }
    }
  })

  useEffect(() => {
    refetch()
  }, [currentPage, sortModel, search]);


  const rows = data?.data || [];

  const searchHandler = (e) => {
    setSearch(e?.target?.value ?? '')
    setCurrentPage(1);
  }

  const onPageChangeHandler = (e, page) => {
    setCurrentPage(page);
  }

  const onSortModalChangeHandler = (newSortModel) => {
    setSortModel(newSortModel);
    setCurrentPage(1);
  }

  const columns = [
    { field: 'title', headerName: 'Title', width: 400 },
    {
      field: 'price', headerName: 'Price', width: 100, renderCell: (rowData) => {
        return <b>${rowData?.data?.currency ?? ''}{rowData.value}</b>
      }
    },
    { field: 'supplierName', sortKey: 'price', headerName: 'Supplier Name', width: 200 },
    { field: 'supplierAddress', headerName: 'Supplier Address', width: 300 },
    {
      field: 'rating', headerName: 'Rating', width: 200, renderCell: (rowData) => <Rating
        name="supplier-rating"
        value={rowData.value}
        readOnly
      />
    },
    {
      field: 'specialOffer', headerName: 'Special Offer', width: 100, renderCell: (rowData) => {
        return <b>{rowData.value ? 'yes' : 'No'}</b>
      }
    },
  ]

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {error && <div className={styles.errorMessage}> We are unable to fetch the requested information at this time. Please try again later. </div>}
        <SearchInput onChange={searchHandler} placeholder='Search by title name...' />
        <MuiTable rows={rows}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={onSortModalChangeHandler}
          loading={loading} />
        {data && <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.total_page}
          onChange={onPageChangeHandler} />
        }
      </div>
    </main >
  )
}



