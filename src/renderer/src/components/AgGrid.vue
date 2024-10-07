<template>
  <div class="ag-grid-container">
    <div class="button-container">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        style="display: none"
        accept=".xlsx, .xls"
      />
      <ifx-button
        type="button"
        :disabled="false"
        variant="secondary"
        size="m"
        target="_blank"
        theme="default"
        full-width="false"
        @click="triggerFileInput"
      >
        Import Excel
      </ifx-button>
      <ifx-button
        type="button"
        :disabled="false"
        variant="secondary"
        size="m"
        target="_blank"
        theme="default"
        full-width="false"
        @click="exportExcel"
      >
        Export Excel
      </ifx-button>
    </div>
    <ag-grid-vue
      id="myGrid"
      :row-data="rowData"
      :column-defs="colDefs"
      :default-col-def="defaultColDef"
      class="ag-theme-alpine"
      :row-selection="'multiple'"
      style="width: 100%; height: 100%"
      :pagination="true"
      :pagination-page-size="paginationPageSize"
      :pagination-page-size-selector="paginationPageSizeSelector"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script>
import { ref, shallowRef, onMounted } from 'vue';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import * as XLSX from 'xlsx';

export default {
  name: 'AgGrid',
  components: {
    AgGridVue,
  },
  setup() {
    const gridApi = shallowRef(null);
    const rowData = ref([]);
    const colDefs = ref([]);
    const defaultColDef = ref({
      filter: 'agTextColumnFilter',
      floatingFilter: false,
      sortable: true,
      resizable: false,
      editable: true,
      flex: 1,
    });
    const paginationPageSize = ref(25);
    const paginationPageSizeSelector = ref([25, 50, 75]);

    const onGridReady = (params) => {
      gridApi.value = params.api;
    };

    const convertDataToWorkbook = (dataRows) => {
      const data = new Uint8Array(dataRows);
      const arr = [];
      for (let i = 0; i < data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      return XLSX.read(bstr, { type: 'binary' });
    };

    const populateGrid = (workbook) => {
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const newRowData = [];
      const headers = [];
      let rowIndex = 1;

      // Read headers from the first row
      for (let colIndex = 0; worksheet[`${String.fromCharCode(65 + colIndex)}${rowIndex}`]; colIndex++) {
        // Ensure header is read as a string
        const header = String(worksheet[`${String.fromCharCode(65 + colIndex)}${rowIndex}`]?.v || `Column${colIndex + 1}`);
        headers.push(header);
      }

      // Set dynamic column definitions based on headers
      colDefs.value = headers.map(header => ({
        field: header
      }));

      rowIndex++;
      while (worksheet[`A${rowIndex}`]) {
        const row = {};
        for (let colIndex = 0; colIndex < headers.length; colIndex++) {
          const columnKey = String.fromCharCode(65 + colIndex) + rowIndex;
          row[headers[colIndex]] = worksheet[columnKey]?.v || null;
        }
        newRowData.push(row);
        rowIndex++;
      }

      rowData.value = newRowData;
      saveDataToLocalStorage();
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          populateGrid(workbook);
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const triggerFileInput = () => {
      const fileInput = document.querySelector('input[type="file"]');
      fileInput.click();
    };

    const exportExcel = () => {
      const workbook = XLSX.utils.book_new();
      const worksheetData = [colDefs.value.map(col => col.field)];
      rowData.value.forEach(row => {
        const rowValues = [];
        colDefs.value.forEach(col => {
          rowValues.push(row[col.field]);
        });
        worksheetData.push(rowValues);
      });
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, 'exported_data.xlsx');
    };

    const saveDataToLocalStorage = () => {
      localStorage.setItem('rowData', JSON.stringify(rowData.value));
      localStorage.setItem('colDefs', JSON.stringify(colDefs.value));
    };

    const loadDataFromLocalStorage = () => {
      const storedRowData = localStorage.getItem('rowData');
      const storedColDefs = localStorage.getItem('colDefs');
      if (storedRowData) {
        rowData.value = JSON.parse(storedRowData);
      }
      if (storedColDefs) {
        colDefs.value = JSON.parse(storedColDefs);
      }
    };

    onMounted(() => {
      loadDataFromLocalStorage();
    });

    return {
      rowData,
      colDefs,
      defaultColDef,
      paginationPageSize,
      paginationPageSizeSelector,
      onGridReady,
      handleFileUpload,
      triggerFileInput,
      exportExcel,
    };
  },
};
</script>

<style lang="scss">
@import '@ifxglobal/vue-cli-plugin-grid-theme/gridTheme.scss';

.header {
  font: $ifxHeadingHeading04;
}
.ag-grid-container {
  margin-top: 2rem;
  height: calc(100vh - 89px);
}
.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  justify-content: flex-end;
}
</style>
