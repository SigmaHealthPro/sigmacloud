import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import { useParams,useNavigate,NavigateFunction   } from 'react-router-dom';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Descendant } from 'slate';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../../../context/authContext';
import Container from '../../../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import Card, { CardBody, CardFooter, CardFooterChild } from '../../../components/ui/Card';
import Button, { IButtonProps } from '../../../components/ui/Button';
import { TIcons } from '../../../types/icons.type';
import Label from '../../../components/form/Label';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import rolesDb from '../../../mocks/db/roles.db';
import Avatar from '../../../components/Avatar';
import useSaveBtn from '../../../hooks/useSaveBtn';
import FieldWrap from '../../../components/form/FieldWrap';
import Icon from '../../../components/icon/Icon';
import Badge from '../../../components/ui/Badge';
import useDarkMode from '../../../hooks/useDarkMode';
import { TDarkMode } from '../../../types/darkMode.type';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Button as AntButton, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { GridCellParams,GridRowParams } from '@mui/x-data-grid';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';
import Alert from '../../../components/ui/Alert';
import Providers from '../../Facility Management/Providers/Providers.page';
import EventsPage from '../../Facility Management/Events/EventsPage';
import {LovMasterType,Address} from '../../../interface/facility.interface';
import {TAB, TTab,TTabs, TColors} from '../../../constants/facilitypage.constants';
import SitesPage from '../../Facility Management/Sites/SitesPage';

const AddContacts = ({...props}) => {
    const {id}=props;
    const [showAlert, setShowAlert] = useState(false);
    const [contactNumberData, setContactData] = useState([]);
    const [entityContactmodalStatus, setEntityContactmodalStatus] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState<TColors>(TColors.Red);
    const [alertTitle, setAlertTitle] = useState('');
    const [contactTypes, setContactTypes] = useState<LovMasterType[]>([]);
    const [selectedContactType, setContactAddressType] = useState<string>('');
    const [contactValue, setContactValue] = useState('');
    
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
      const fetchContactTypes = async () => {
        try {
          const response = await axios.get(
            'https://dev-api-iis-sigmacloud.azurewebsites.net/api/MasterData/getlovmasterbylovtype?lovtype=ContactType'
          );
  
          console.log('Lov Types API Response:', response);
  
          if (response.data && Array.isArray(response.data)) {
            // Adding a default item at the beginning
            const defaultItem = {
              id: 'default',
              key: 'default',
              value: 'Select an Contact Type',
              lovType: 'ContactType',
              longDescription: 'Select an Contact Type',
            };
  
            setContactTypes([defaultItem, ...response.data]);
          } else {
            console.error('Error fetching contact type data');
          }
        } catch (error) {
          console.error('Error fetching contact type data', error);
        }
      };
  
      fetchContactTypes();
    }, []);
  
  
  
    const handleContactTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setContactAddressType(event.target.value);
    };
    const currentDate = new Date();
        const createdDate = currentDate.toISOString();
  
    const handleSaveEntityContact = async () => {
      try {
          if (!selectedContactType || !contactValue) {
              setAlertColor(TColors.Amber);
          setAlertTitle('Validation Fail')
          setAlertMessage('Please fill in all the fields.');
          setShowAlert(true);
              return;
            }
        const response = await axios.post(
          'https://dev-api-iis-sigmacloud.azurewebsites.net/api/Contact/create-entity-contact',
          {
            contactValue: contactValue,
            createdDate: createdDate,
            createdBy: 'quasif',
            isdelete: false,
            contactType: selectedContactType,
            entityId: id,
            entityType: 'facility',
          },
          {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (response.data && response.data.status === 'Success') {
  
          console.log(response.data.message);
          setAlertMessage(response.data.message);
          setAlertColor(TColors.Lime);
          setAlertTitle('Success')
          setShowAlert(true);
          fetchContactData();
          setEntityContactmodalStatus(false);
          
        } else {
          
          console.error('Error inserting entity contact:', response.data.message);
          setAlertColor(TColors.Red);
          setAlertTitle('Fail')
          setAlertMessage(response.data.message);
          setShowAlert(true);
        }
      } catch (error) {
        
        console.error('Error inserting entity contact:', error);
          setAlertColor(TColors.Red);
          setAlertTitle('Fail')
          setAlertMessage('Error deleting address.');
          setShowAlert(true);
      }
    };
  
  return (
    <>
    <div className='flex items-center justify-between mb-4'>
        <div className='text-4xl font-semibold'>Facility Contacts</div>
        {/* Add your button here */}
        <Button variant='solid' onClick={() => setEntityContactmodalStatus(true)} icon='HeroPlus'>
              New
            </Button>
      </div>
    <Modal isOpen={entityContactmodalStatus} setIsOpen={setEntityContactmodalStatus}>
    <ModalHeader>Add Facility Contact</ModalHeader>
    <ModalBody>
    <div className='grid grid-cols-12 gap-4'>
                            
    
                                <div className='col-span-12'>
                                    <Label htmlFor='position'>Contact Type</Label>
                                    <FieldWrap
                                        lastSuffix={
                                            <Icon
                                                icon='HeroChevronDown'
                                                className='mx-2'
                                            />
                                        }>
                                         <Select name='contactTypes'onChange={handleContactTypeChange} value={selectedContactType}>
                                            {contactTypes.map((contactType) => (
                                            <option key={contactType.id} value={contactType.value}>
                                            {contactType.value}
                                            </option>
                                            ))}
                                            </Select>
                                    </FieldWrap>
                                </div>
                                
                                </div>
                                <div className='col-span-12'>
                                    <Label htmlFor='position'>Contact Value</Label>

                                    <FieldWrap
                                        firstSuffix={
                                            <Icon
                                                icon='HeroBriefcase'
                                                className='mx-2'
                                            />
                                        }>
                                        <Input
                                            id='contactValue'
                                            name='contactValue'
                                            value={contactValue}
                                            onChange={(e) => setContactValue(e.target.value)}
                                        />
                                    </FieldWrap>
                                </div>

                            
    </ModalBody>
    <ModalFooter>
        <ModalFooterChild></ModalFooterChild>
        <ModalFooterChild>
            <Button variant='solid' onClick={handleSaveEntityContact}>Save</Button>
        </ModalFooterChild>
    </ModalFooter>
</Modal>

    </>
  )
}

export default AddContacts