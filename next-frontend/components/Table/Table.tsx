import * as React from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridRowsProp, GridSortModel } from '@mui/x-data-grid';
import { MuiTableProps } from './Table.types';

export default function MuiTable({ columns, rows, sortModel, onSortModelChange, loading }: MuiTableProps) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        sortingMode="server"
        loading={loading}
        localeText={{ noRowsLabel: 'No data'} }
      />
    </div>
  );
}
