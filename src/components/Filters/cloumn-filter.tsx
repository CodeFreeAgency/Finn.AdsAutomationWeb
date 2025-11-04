import React, { useState, useEffect } from 'react';

// interface data {
//   List?: any;
//   MasterChecked?: boolean,
//   SelectedList?: any;
// }
function ColumnFilter(props) {
  const [List, setList] = useState<any>([]);
  const [MasterChecked, setMasterChecked] = useState<any>(false);
  const [SelectedList, setSelectedList] = useState<any>([]);
  
  useEffect(() => {
    console.log("column dropdown columnList: ", props.columnList);
    setList(props.columnList);
  },[props.columnList]);

  // Select/ UnSelect Table rows
  function onMasterCheck(e) {
    let tempList = List;
    // Check/ UnCheck All Items
    tempList.map((user:any) => (user.selected = e.target.checked));
    //Update State
    setList(tempList);
    setMasterChecked(e.target.checked);
    setSelectedList(List.filter((e:any) => e.selected));
  }

  // Update List Item's state and Master Checkbox State
  function onItemCheck(e, item) {
    let tempList = List;
    tempList.map((user:any) => {
      if (user.id === item.id) {
        user.selected = e.target.checked;
      }
      return user;
    });

    //To Control Master Checkbox State
    const totalItems = List.length;
    const totalCheckedItems = tempList.filter((e:any) => e.selected).length;

    // Update State
    setList(tempList);
    setMasterChecked(totalItems === totalCheckedItems);
    setSelectedList(List.filter((e:any) => e.selected));
  }

  // Event to get selected rows(Optional)
  function getSelectedRows() {
    setSelectedList(List.filter((e:any) => e.selected));
  }

  return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={MasterChecked}
                  id="mastercheck"
                  onChange={(e) => onMasterCheck(e)}
                />
              </th>
              <th scope="col">Column Name</th>
            </tr>
          </thead>
          <tbody>
            {List.map((columnFilter:any) => (
              <tr key={columnFilter.id} className={columnFilter.selected ? "selected" : ""}>
                <th scope="row">
                  <input
                    type="checkbox"
                    checked={columnFilter.selected}
                    className="form-check-input"
                    id="rowcheck{user.id}"
                    onChange={(e) => onItemCheck(e, columnFilter)}
                  />
                </th>
                <td>{columnFilter.displayName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}
export default ColumnFilter;