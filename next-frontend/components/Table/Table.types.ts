import { GridCallbackDetails, GridColDef, GridRowsProp, GridSortModel } from "@mui/x-data-grid";

export type MuiTableProps = {
    columns: GridColDef[],
    rows: readonly any[],
    sortModel?: GridSortModel,
    onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails<any>) => void,
    loading?: boolean,
  }
  