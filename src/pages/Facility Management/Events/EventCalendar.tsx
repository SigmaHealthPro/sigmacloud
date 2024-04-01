import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button, { IButtonProps } from '../../../components/ui/Button';
import Input from '../../../components/form/Input';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import axios from 'axios';
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalFooterChild } from '../../../components/ui/Modal';
import { makeStyles } from '@mui/styles';
import Select from '../../../components/form/Select';
import {Provider, Site} from '../../../interface/facility.interface';
import { useNavigate } from "react-router";
const localizer = momentLocalizer(moment);

interface EventData {
  type: string;
}

interface Event {
  start: Date;
  end: Date;
  title: string;
  data: EventData;
  eventDate: string;
  eventName: string;
}

interface EventProps {
  event: Event;
}

const EventCalendar: React.FC = () => {

  const navigate = useNavigate()
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
        const response = await axios.post('https://localhost:7155/api/Event/createEvent', eventForm);
        console.log(response.data);
        setIsEventModalOpen(false); 
     //   navigate("/eventCalendar");
  
      } catch (error) {
        console.error('Error creating event:', error);
      }
    };
    useEffect(() => {
      
      axios.get('https://localhost:7155/api/Provider/AllProviders')
      .then(response => {
        setProviderOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching providers:', error);
      });
  
    // Fetch site options
    axios.get('https://localhost:7155/api/Site/AllSites')
      .then(response => {
        setSiteOptions(response.data);
      })
      .catch(error => {
        console.error('Error fetching sites:', error);
      });
  
    }, []);
  const [eventData, setEventData] = useState<Event[]>([]);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const response = await fetch("https://localhost:7155/api/Event/searchevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          keyword: null,
          pagenumber: 1,
          pagesize: 10,
          eventName: null,
          eventDate: null,
          vaccineName: null,
          providerName: null,
          siteName: null,
          orderby: null,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error("There was a problem fetching the data: ", error);
    }
  };

  const handleDateClick = (slotInfo: any) => {
    setIsEventModalOpen(true);
  
    const clickedDate = new Date(slotInfo.start);
 
    const year = clickedDate.getFullYear();
    const month = (clickedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = clickedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
  
    setEventForm(prevState => ({
      ...prevState,
      eventDate: formattedDate
    }));
  };
  

  const components: Record<string, React.ComponentType<EventProps>> = {
    event: ({ event }: EventProps) => {
      const eventType = event?.data?.type;
      let backgroundColor, titleColor;
      switch (eventType) {
        case "Reg":
          backgroundColor = "yellow";
          titleColor = "white";
          break;
        case "App":
          backgroundColor = "lightgreen";
          titleColor = "white";
          break;
        default:
          return null;
      }
      return (
        <div style={{ background: backgroundColor, color: titleColor, height: "100%" }}>
          {event.title}
        </div>
        
      );
    },
  };

  const formattedEventData = eventData.map((event) => ({
    start: new Date(event.eventDate),
    end: new Date(event.eventDate),
    title: event.eventName,

    data: {
      type: "App",
    },
  }));

  return (
  <>   <BigCalendar
      events={formattedEventData}
      components={components}
      localizer={localizer}
      selectable={true} // Enable selection
      onSelectSlot={handleDateClick} // Handle slot selection
    />
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


</>
 
    
  
  );
};

export default EventCalendar;
