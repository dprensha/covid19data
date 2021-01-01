import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { constants, formatHelpers } from "../../../Utilities"
import { DataGrid } from "../../../Controls";
import styles from './DataTable.module.scss'

const propTypes = {

}

class DataTable extends PureComponent {
    constructor(props) {
        super(props);
    }

    generateTableRow(){

    }
    
    getRatio(value, outOf) {
      if(value === 0) {
        return "";
      }

      else {
        return ` (1 in ${formatHelpers.addThousandSeparators(Math.round(outOf/value), true, true)})`
      }
    }

    render() {
      const data = [];      

      Object.keys(this.props.entity.children).forEach((key, index) => {
        const item = this.props.entity.children[key],
        active = item.yActive[item.yActive.length - 1],
        activePerCapita = active / item.population * 1000,
        activeChangeSevenDay = (active - item.yActive[item.yActive.length - 1 - 7]) / item.yActive[item.yActive.length - 1 - 7] * 100,
        activeChangeFourteenDay = (active - item.yActive[item.yActive.length - 1 - 14]) / item.yActive[item.yActive.length - 1 - 14] * 100,
        totalPerCapita = item.yConfirmed[item.yConfirmed.length - 1] / item.population * 1000,
        total = item.yConfirmed[item.yConfirmed.length - 1],
        deathsPerCapita = item.yDeaths[item.yDeaths.length - 1] / item.population * 100000,
        deaths = item.yDeaths[item.yDeaths.length - 1],
        mortalityRate = item.yDeaths[item.yDeaths.length - 1] / item.yConfirmed[item.yConfirmed.length - 1] * 100;

        data.push({
          id: index,
          name: item.title,
          population: item.population,
          activePerCapita: isNaN(activePerCapita) ? null : activePerCapita,
          activePerCapitaRatio: isNaN(1000/activePerCapita) ? null : Math.round(1000/activePerCapita),
          active:  isNaN(active) ? null : active,
          activeChangeSevenDay: isNaN(activeChangeSevenDay) ? null : activeChangeSevenDay,
          activeChangeFourteenDay: isNaN(activeChangeFourteenDay) ? null : activeChangeFourteenDay,
          totalPerCapita: isNaN(totalPerCapita) ? null : totalPerCapita,
          total: isNaN(total) ? null : total,
          deathsPerCapita: isNaN(deathsPerCapita) ? null : deathsPerCapita,
          deaths: isNaN(deaths) ? null : deaths,
          mortalityRate: isNaN(mortalityRate) ? null : mortalityRate,
          positivityRate: 0,
          pctVaccinatedOneDose: 0,
          pctVaccinatedAllDoses: 0,
          vaccinesAllocated: 0,
          vaccinesAdministered: 0,
          vaccinationRegimensCompleted: 0
        })
      });

      const sortModel = [
        {
          field: 'activePerCapita',
          sort: 'desc',
        },
      ];

        const columns = [
            { field: 'rowIndex', headerName: 'Rank', width: 70, valueGetter: (params) => params.rowIndex + 1, sortable: false, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'name', headerName: 'Name', width: 130, headerClassName: styles.header, cellClassName: styles.value, type: 'string' },
            //{ field: 'population', headerName: 'Population', width: 130 },
            { field: 'activePerCapita', headerName: 'Active per 1,000', width: 150, valueFormatter: (params) => `${formatHelpers.addThousandSeparators(params.value, false)}${this.getRatio(params.value, 1000)}`, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'active', headerName: 'Active', width: 130, valueFormatter: (params) => formatHelpers.addThousandSeparators(params.value, true), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'activeChangeSevenDay', headerName: '% Change (7-Day)', width: 130, valueFormatter: (params) => formatHelpers.formatPercentage(params.value), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'activeChangeFourteenDay', headerName: '% Change (14-Day)', width: 140, valueFormatter: (params) => formatHelpers.formatPercentage(params.value), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'totalPerCapita', headerName: 'Total per 1,000', width: 130, valueFormatter: (params) => `${formatHelpers.addThousandSeparators(params.value, false)}${this.getRatio(params.value, 1000)}`, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'total', headerName: 'Total', width: 130, valueFormatter: (params) => formatHelpers.addThousandSeparators(params.value, true), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'deathsPerCapita', headerName: 'Deaths per 100,000', width: 150, valueFormatter: (params) => `${formatHelpers.addThousandSeparators(params.value, false)}${this.getRatio(params.value, 100000)}`, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'deaths', headerName: 'Deaths', width: 130, valueFormatter: (params) => formatHelpers.addThousandSeparators(params.value, true), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            { field: 'mortalityRate', headerName: 'Mortality Rate', width: 130, valueFormatter: (params) => formatHelpers.formatPercentage(params.value), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
            // {
            //   field: 'fullName',
            //   headerName: 'Full name',
            //   description: 'This column has a value getter and is not sortable.',
            //   sortable: true,
            //   width: 160,
            //   valueGetter: (params) =>
            //     `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
            // },
          ];
        

          return (
            <div style={{ height: 800, width: '100%' }}>
              <DataGrid 
                rows={data}
                columns={columns}
                pageSize={20}
                rowHeight={30}
                sortModel={sortModel}
                checkboxSelection 
              />
            </div>
          );

        // return (
        //     <div>
        //         <div>
        //             Hot Spot Ranking
        //   </div>
        //         <table>
        //             <tbody>
        //                 <tr className={styles.noBorder}>
        //                     <th width="50">Rank</th>
        //                     <th width="120">State/County</th>
        //                     <th width="150">Active Cases Per 1,000</th>
        //                     <th width="100">Active Cases </th>
        //                     <th width="100">Total Cases</th>
        //                     <th width="150">Total Cases Per 1,000</th>
        //                     <th width="100">Deaths</th>
        //                     <th width="150">Deaths Cases Per 100,000</th>
        //                     <th width="100">Mortality Rate</th>
        //                     <th width="150">New Cases per 100 Tests</th>
        //                     <th width="150">Vaccines Allocated</th>
        //                     <th width="150">Vaccines Administered</th>
        //                     <th width="190">Vaccination Regimens Completed</th>
        //                 </tr>
        //                 <tr className={styles.noBorder}>
        //                     <td>1</td>
        //                     <td>Tennessee</td>
        //                     <td>16.08</td>
        //                 </tr>
        //                 <tr>
        //                     <td>2</td>
        //                     <td>California</td>
        //                     <td>14.45</td>
        //                 </tr>
        //                 <tr>
        //                     <td>3</td>
        //                     <td>Arizona</td>
        //                     <td>11.8</td>
        //                 </tr>
        //                 <tr>
        //                     <td>4</td>
        //                     <td>Rhode Island</td>
        //                     <td>10.64</td>
        //                 </tr>
        //                 <tr>
        //                     <td>5</td>
        //                     <td>Oklahoma</td>
        //                     <td>10.49</td>
        //                 </tr>
        //             </tbody>
        //         </table>
        //     </div>
        // )
    }
}

DataTable.propTypes = propTypes;
export default DataTable;