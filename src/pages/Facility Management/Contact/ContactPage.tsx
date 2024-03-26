


import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import Label from '../../../components/form/Label';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import rolesDb from '../../../mocks/db/roles.db';
import Avatar from '../../../components/Avatar';
import useSaveBtn from '../../../hooks/useSaveBtn';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Badge from '../../../components/ui/Badge';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams,GridRowParams } from '@mui/x-data-grid';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { TColors } from "../../../constants/facilitypage.constants";
import Button, { IButtonProps } from '../../../components/ui/Button';
import React from 'react'
import { LovMasterType } from "../../../interface/facility.interface";
import AddContacts from './AddContacts';


const ContactPage = ({...props}) => {
const id =props.id;
const [showAlert, setShowAlert] = useState(false);
const [entityContactmodalStatus, setEntityContactmodalStatus] = useState<boolean>(false);
const [alertMessage, setAlertMessage] = useState('');
const [alertColor, setAlertColor] = useState<TColors>(TColors.Red);
const [alertTitle, setAlertTitle] = useState('');
const [contactNumberData, setContactData] = useState([]);

const contactNumberColumns: GridColDef[] = [
  { field: 'contactValue', headerName: 'Contact Value', flex: 2 },
  { field: 'createdDate', headerName: 'Created Date', flex: 1 },
  { field: 'createdBy', headerName: 'Created By', flex: 1 },
  { field: 'contactType', headerName: 'Contact Type', flex: 1 },
];


const fetchContactData = async () => {
    try {
      const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Contact/get-entity-contact', {
        entityId: id,
        identifier: null,
        recordCount: null,
      });
  
      if (response.data && response.data.status === 'Success') {
          setContactData(response.data.dataList);
      } else {
        // Handle error
        console.error('Error fetching contact data');
      }
    } catch (error) {
      // Handle error
      console.error('Error fetching contact data', error);
    }
  };
  useEffect(() => {
    fetchContactData();
  }, []);

  return (
    <>
		<AddContacts/>
									
										<div style={{ height: 400, width: '100%' }}>
            <DataGrid
			className={props.classes.root}
              rows={contactNumberData}
              columns={contactNumberColumns}
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

export default ContactPage