import React, { useEffect, useState ,FormEvent,useCallback } from 'react';
import Button, { IButtonProps } from '../../../components/ui/Button';
import Input from '../../../components/form/Input';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { makeStyles } from '@mui/styles';

const AddProvider = () => {
    const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
    const [providerForm, setProviderForm] = useState({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        createdDate: "2024-02-20T00:55:41.176Z",
        createdBy: "string",
        updatedBy: "string",
        providerId: "string",
        providerName: "",
        providerType: "",
        contactNumber: "",
        email: "",
        speciality: "",
        facilityId: "9b9a7d00-b684-48f0-8c39-8d9c35f8d1c0",
        facilityName: "string",
        cityName: "string",
        stateName: "string",
        zipCode: "string",
        addressId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        });
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setProviderForm(prevState => ({
            ...prevState,
            [name]: value,
            }));
        };
    const handleSubmitProvider = async () => {
        try {
        const response = await axios.post('https://dev-api-iis-sigmacloud.azurewebsites.net/api/Provider/createprovider', providerForm);
        console.log(response.data);
        setIsProviderModalOpen(false); // Close modal on success
        // Optionally, fetch the updated providers list here
        } catch (error) {
        console.error('Error creating provider:', error);
        // Handle errors, e.g., show an error message
        }
    };
  return (
    <div>
            
            <div className='flex items-center justify-between mb-4'>    
            <div className='text-4xl font-semibold'>Providers</div>
            <Button variant='solid' onClick={() => setIsProviderModalOpen(true)} icon='HeroPlus'>
                New
            </Button>
        </div>
    <Modal isOpen={isProviderModalOpen} setIsOpen={setIsProviderModalOpen}>
    <ModalHeader>Add New Provider</ModalHeader>
    <ModalBody>
    <div className='grid grid-cols-12 gap-4'>
      {/* Provider Name */}
      <Input
        className="col-span-12"
        name="providerName"
        placeholder="Provider Name"
        value={providerForm.providerName}
        onChange={e => setProviderForm({...providerForm, providerName: e.target.value})}
      />
  
      {/* Provider Type */}
      <Input
        className="col-span-12"
        name="providerType"
        placeholder="Provider Type"
        value={providerForm.providerType}
        onChange={e => setProviderForm({...providerForm, providerType: e.target.value})}
      />
  
      {/* Contact Number */}
      <Input
        className="col-span-6"
        name="contactNumber"
        placeholder="Contact Number"
        value={providerForm.contactNumber}
        onChange={e => setProviderForm({...providerForm, contactNumber: e.target.value})}
      />
  
      {/* Email */}
      <Input
        className="col-span-6"
        name="email"
        placeholder="Email"
        value={providerForm.email}
        onChange={e => setProviderForm({...providerForm, email: e.target.value})}
      />
  
      {/* Speciality */}
      <Input
        className="col-span-12"
        name="speciality"
        placeholder="Speciality"
        value={providerForm.speciality}
        onChange={e => setProviderForm({...providerForm, speciality: e.target.value})}
      />
  
     
      {/* Facility Name */}
     
      
    </div>
  </ModalBody>
    <ModalFooter>
      <Button variant='solid' onClick={handleSubmitProvider}>Save</Button>
    </ModalFooter>
  </Modal>
  </div>
  )
}

export default AddProvider