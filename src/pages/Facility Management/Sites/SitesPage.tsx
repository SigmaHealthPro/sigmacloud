import React from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Button, { IButtonProps } from '../../../components/ui/Button';



const SitesPage = ({...props}) => {
    const [siteData, setSiteData] = useState([]);
    const {id}=props;
  useEffect(() => {
    fetchSiteData();
  }, []);
  const fetchSiteData = async () => {
    try {
      const response = await fetch('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Site/searchsite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          "sitepinnumber": null,
          "keyword": null,
          "facilityid": id,
          "facility_name": null,
          "pagenumber": 1,
          "pagesize": 100,
          "site_name": null,
          "site_type": null,
          "parent_site": null,
          "address": null,
          "city": null,
          "state": null,
          "userid": null,
          "usertype": null,
          "orderby": null
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSiteData(data);
    } catch (error) {
      console.error('There was a problem fetching the data: ', error);
    }
  };

  const siteColumns = [
    { field: 'siteName', headerName: 'Site Name', width: 200 },
    { field: 'siteType', headerName: 'Site Type', width: 150 },
    { field: 'parentSite', headerName: 'Parent Site', width: 200 },
    { field: 'siteContactPerson', headerName: 'Contact Person', width: 200 },
    { field: 'facilityName', headerName: 'Facility Name', width: 200 },
    { field: 'cityName', headerName: 'City', width: 150 },
    { field: 'stateName', headerName: 'State', width: 150 },
    { field: 'zipCode', headerName: 'Zip Code', width: 130 },
    // Add more columns as needed
  ];
  return (
    <>
		<div className='flex items-center justify-between mb-4'>
        <div className='text-4xl font-semibold'>Sites</div>
        {/* Add your button here */}
        <Button variant='solid'  icon='HeroPlus'>
              New
            </Button>
      </div>
									
										<div style={{ height: 400, width: '100%' }}>
            <DataGrid
			className={props.classes.root}
              rows={siteData}
              columns={siteColumns}
              checkboxSelection
			  sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#e5e7eb' },
        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
        },}}
            />
			</div>
									</>
  )
}

export default SitesPage