import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { constants } from "../../../Utilities"
import { Typography, Divider, Dialog, DialogActions, DialogContent, Button } from "../../../Controls";
import styles from './InfoDialog.module.scss'

const propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  displayDetails: PropTypes.object
}

class InfoDialog extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Dialog
        fullScreen={this.props.displayDetails.formFactor === constants.display.formFactors.MOBILE}
        open={this.props.isOpen}
        onClose={this.props.handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth={"lg"}
      >
        <Typography variant="h4" className={styles.mainTitle}>Thanks for stopping by!</Typography>
        <DialogContent>
          <Typography variant="h6">Please report any bugs, suggestions, or ideas to <a href="mailto:covid@prenshaw.com">covid@prenshaw.com</a></Typography>
          <p>I sincerely hope that you find this site useful for your own informational purposes. Any feedback is appreciated!</p>
          <div className={styles.divider}>
            <Divider />
          </div>
          <span>Data Sources:</span>
          <ul>
            <li>
              <a href="https://github.com/CSSEGISandData/COVID-19">COVID-19 Data Repository</a> by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University 
            </li>
            <li>
            <a href="https://github.com/govex/COVID-19/tree/master/data_tables/vaccine_data">Vaccine Data</a> from the Centers for Civic Impact
            </li>
            <li>
              US Census Bureau 2019 Population <a href="http://www2.census.gov/programs-surveys/popest/datasets/2010-2019/national/totals/nst-est2019-alldata.csv?#">Projections</a>
            </li>
            <li>
              World Bank <a href="https://data.worldbank.org/">Population Data</a>
            </li>
            <li>
              <a href="https://www.abs.gov.au/ausstats/abs@.nsf/mf/3101.0">Australian Bureau of Statistics </a> population data
            </li>
            <li>
              <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710000901">Statistics Canada Q2 2020 population estimates</a>
            </li>

          </ul>
          <div className={styles.divider}>
            <Divider />
          </div>
          <b>Note:</b> An "active" case is considered to be recovered (or, but hopefully not, a death) after 14 days of the originally reported date. <a href="https://www.cdc.gov/coronavirus/2019-ncov/hcp/disposition-in-home-patients.html">According to the CDC</a>, researchers have reported that people with mild to moderate COVID-19 remain infectious no longer than 10 days after their symptoms began, and those with more severe illness or those who are severely immunocompromised remain infectious no longer than 20 days after their symptoms began.
              </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.props.handleClose} color="primary">
            Close
                </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

InfoDialog.propTypes = propTypes;
export default InfoDialog;