import {FormControl} from '@angular/forms';

export default class Utils {

    static sortTable(sortingColumn, tableData, sortType) {
        tableData.sort((a, b) => {
            if(sortType == "asc"){
            return (a[sortingColumn] > b[sortingColumn])
                    ? 1
                    : -1;
            }else{
                return (a[sortingColumn] < b[sortingColumn])
                    ? 1
                    : -1;
            }
        })
        return tableData;
    }
}
