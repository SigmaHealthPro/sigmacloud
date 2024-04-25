import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';
import Input from '../../../components/form/Input';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { makeStyles } from '@mui/styles';
import Select from '../../../components/form/Select';
import {Provider, Site} from '../../../interface/facility.interface';


const AddEvent = () => {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [providerOptions, setProviderOptions] = useState<Provider[]>([]);
    const [siteOptions, setSiteOptions] = useState<Site[]>([]);
    const [eventForm, setEventForm] = useState({
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "createdDate": "2024-03-10T05:47:20.021Z",
        "createdBy": "string",
        "updatedBy": "string",
        "eventName": "",
        "eventDate": "",
        "cvxCodeId": "a3b3ebac-05f4-4014-917c-d59645bc1731",
        "providerId": "",
        "siteId": ""
      });
      
      const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {
        const { name, value } = e.target;
        setEventForm(prevState => ({
          ...prevState,
        //   [name]: name === 'eventDate' ? formatDateToBackend(value) : value
        [name]:value
        }));
      };
    
      const handleSubmitEvent = async () => {
        try {
          const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Event/createEvent', eventForm);
          console.log(response.data);
          setIsEventModalOpen(false); // Close modal on success
          // Optionally, fetch the updated events list here
        } catch (error) {
          console.error('Error creating event:', error);
          // Handle errors, e.g., show an error message
        }
      };
      useEffect(() => {
        
        axios.get('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Provider/AllProviders')
        .then(response => {
          setProviderOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching providers:', error);
        });
    
      // Fetch site options
      axios.get('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Site/AllSites')
        .then(response => {
          setSiteOptions(response.data);
        })
        .catch(error => {
          console.error('Error fetching sites:', error);
        });
    
      }, []);
  return (
    <div>
        <div className='flex items-center justify-between mb-4'>
        <div className='text-4xl font-semibold'>Events</div>
        <Button variant='solid' onClick={() => setIsEventModalOpen(true)} icon='HeroPlus'>
                New
        </Button>
      </div>
      <Modal isOpen={isEventModalOpen} setIsOpen={setIsEventModalOpen}>
        <ModalHeader>Add New Event</ModalHeader>
        <ModalBody>
          <div className='grid grid-cols-12 gap-4'>
            {/* Event Name */}
            <Input
              className="col-span-12"
              name="eventName"
              placeholder="Event Name"
              value={eventForm.eventName}
              onChange={handleEventInputChange}
            />

            {/* Event Date */}
			<Input
        className="col-span-12"
        type="date"
        name="eventDate"
        placeholder="Event Date"
        value={eventForm.eventDate}
        onChange={handleEventInputChange}
      />

            {/* Provider Name Dropdown */}
            <Select
              className="col-span-6"
              name="providerId"
              value={eventForm.providerId}
              onChange={handleEventInputChange}
            >
              <option value="">Select Provider</option>
              {providerOptions.map(provider => (
                <option key={provider.id} value={provider.id}>{provider.providerName}</option>
              ))}
            </Select>

            {/* Site Name Dropdown */}
            <Select
              className="col-span-6"
              name="siteId"
              value={eventForm.siteId}
              onChange={handleEventInputChange}
            >
              <option value="">Select Site</option>
              {siteOptions.map(site => (
                <option key={site.id} value={site.id}>{site.siteName}</option>
              ))}
            </Select>

          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='solid' onClick={handleSubmitEvent}>Save</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AddEvent