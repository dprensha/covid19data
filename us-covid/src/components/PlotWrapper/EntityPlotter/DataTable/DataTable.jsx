import React, { Component } from "react";
import PropTypes from "prop-types";
import { constants, formatHelpers } from "../../../Utilities"
import { DataGrid } from "../../../Controls";
import styles from './DataTable.module.scss'
import './DataTable.css';

const propTypes = {
  entity: PropTypes.object,
  isMobile: PropTypes.bool,
  title: PropTypes.string
}

class DataTable extends Component {
  constructor(props) {
    super(props);
  }

  handleRowClick(event) {
    const element = document.getElementById(`${event.row.navigableTitle}`);
    window.scrollTo(0, element.offsetTop - 120);
  }

  getRatio(value, outOf) {
    if (value === 0 || (outOf / value) < 2) {
      return "";
    }

    else {
      return ` (1 in ${formatHelpers.addThousandSeparators(Math.round(outOf / value), true, true)})`
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if(this.props.title !== nextProps.title) {
  //     return true;
  //   }
  // }

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
        mortalityRate = item.yDeaths[item.yDeaths.length - 1] / item.yConfirmed[item.yConfirmed.length - 1] * 100,
        //pctVaccinatedOneDose = item.vaccinationData ? item.vaccinationData.totalPeopleVaccinatedOneDose[item.vaccinationData.totalPeopleVaccinatedOneDose.length - 1] / item.population * 100 : null,
        pctVaccinatedAllDoses = item.vaccinationData ? item.vaccinationData.totalPeopleVaccinatedAllDoses[item.vaccinationData.totalPeopleVaccinatedAllDoses.length - 1] / item.population * 100 : null,
        vaccinesAllocated = item.vaccinationData ? item.vaccinationData.allocatedTotal[item.vaccinationData.allocatedTotal.length - 1] : null,
        vaccinesAdministered = item.vaccinationData ? item.vaccinationData.administeredTotal[item.vaccinationData.administeredTotal.length - 1] : null,
        vaccinationRegimensCompleted = item.vaccinationData ? item.vaccinationData.totalPeopleVaccinatedAllDoses[item.vaccinationData.totalPeopleVaccinatedAllDoses.length - 1] : null;

      if (!item.title.startsWith("Unassigned") && !item.title.startsWith("Out of")) {
        data.push({
          id: index,
          name: item.title,
          navigableTitle: item.navigableTitle,
          population: item.population,
          activePerCapita: isNaN(activePerCapita) ? null : activePerCapita,
          activePerCapitaRatio: isNaN(1000 / activePerCapita) ? null : Math.round(1000 / activePerCapita),
          active: isNaN(active) ? null : active,
          activeChangeSevenDay: isNaN(activeChangeSevenDay) ? null : activeChangeSevenDay,
          activeChangeFourteenDay: isNaN(activeChangeFourteenDay) ? null : activeChangeFourteenDay,
          totalPerCapita: isNaN(totalPerCapita) ? null : totalPerCapita,
          total: isNaN(total) ? null : total,
          deathsPerCapita: isNaN(deathsPerCapita) ? null : deathsPerCapita,
          deaths: isNaN(deaths) ? null : deaths,
          mortalityRate: isNaN(mortalityRate) ? null : mortalityRate,
          //positivityRate: 0,
          //pctVaccinatedOneDose: isNaN(pctVaccinatedOneDose) ? null : pctVaccinatedOneDose,
          pctVaccinatedAllDoses: isNaN(pctVaccinatedAllDoses) ? null : pctVaccinatedAllDoses,
          vaccinesAllocated: vaccinesAllocated,
          vaccinesAdministered: vaccinesAdministered,
          vaccinationRegimensCompleted: vaccinationRegimensCompleted
        });
      }

    });

    const sortModel = [
      {
        field: 'activePerCapita',
        sort: 'desc',
      },
    ];

    const showVaccinationData = this.props.entity.children[Object.keys(this.props.entity.children)[0]].vaccinationData !== undefined;

    let columns = [
      { field: 'rowIndex', headerName: 'Rank', width: 60, valueGetter: (params) => params.rowIndex + 1, sortable: false, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
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
      { field: 'mortalityRate', headerName: 'Mortality Rate', width: 130, valueFormatter: (params) => formatHelpers.formatPercentage(params.value), headerClassName: styles.header, cellClassName: styles.value, type: 'number' }
    ];

    if (showVaccinationData) {
      columns = columns.concat([
        //{ field: 'pctVaccinatedOneDose', headerName: '% Vacc. (1 Dose)', width: 150, valueFormatter: (params) => `${params.value === null ? "" : formatHelpers.formatPercentage(params.value, false)}${params.value === null ? "" : this.getRatio(params.value, 100)}`, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
        { field: 'pctVaccinatedAllDoses', headerName: '% Vacc. (All Doses)', width: 150, valueFormatter: (params) => `${params.value === null ? "" : formatHelpers.formatPercentage(params.value, false)}${params.value === null ? "" : this.getRatio(params.value, 100)}`, headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
        { field: 'vaccinesAllocated', headerName: 'Vacc. Allocated', width: 130, valueFormatter: (params) => formatHelpers.addThousandSeparators(params.value, true), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
        { field: 'vaccinesAdministered', headerName: 'Vacc. Administered', width: 140, valueFormatter: (params) => formatHelpers.addThousandSeparators(params.value, true), headerClassName: styles.header, cellClassName: styles.value, type: 'number' },
        { field: 'vaccinationRegimensCompleted', headerName: 'Vacc. Regimens Completed', width: 200, valueFormatter: (params) => formatHelpers.addThousandSeparators(params.value, true), headerClassName: styles.header, cellClassName: styles.value, type: 'number' }
      ]);
    }


    return (
      <div className={showVaccinationData ? styles.containerFullWidth : styles.container}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={this.props.isMobile ? 10 : 20}
          rowHeight={33}
          sortModel={sortModel}
          rowsPerPageOptions={[10, 20, 50, 100, 200]}
          autoHeight={true}
          onRowClick={this.handleRowClick}
        />
      </div>
    );
  }
}

DataTable.propTypes = propTypes;
export default DataTable;