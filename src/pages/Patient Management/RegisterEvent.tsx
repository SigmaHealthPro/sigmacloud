import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Button from '../../components/ui/Button';
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { useNavigate } from "react-router";
const localizer = momentLocalizer(moment);
import { useLocation } from 'react-router-dom';


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

interface RegisterEventProps {
  userName: string; // Assuming userName is passed to this component
}

const RegisterEvent = () => {
  const navigate = useNavigate();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
      eventName: "",
      eventDate: "",
  });
  const [eventData, setEventData] = useState<Event[]>([]);
  const location = useLocation();
  const userName = location.state?.userName || 'Default User';

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

  const handleEventClick = (event: any) => {
    setIsEventModalOpen(true);
    const eventName = event.title;
    const eventDate = event.start.toLocaleDateString();
    setEventForm({ eventName, eventDate });
  };

  const handleSubmitEvent = async () => {
    try {
      console.log('Registration confirmed for:', userName);
      setIsEventModalOpen(false);
      navigate("/confirmationPage");
    } catch (error) {
      console.error('Error confirming registration:', error);
    }
  };

  const formattedEventData = eventData.map(event => ({
    start: new Date(event.eventDate),
    end: new Date(event.eventDate),
    title: event.eventName,
    data: {
      type: "App",
    },
  }));

  return (
    <>
      <BigCalendar
    events={formattedEventData}
    localizer={localizer}
    selectable={true}
    views={['month', 'week', 'day', 'agenda']}
    onSelectEvent={handleEventClick}
/>

      <Modal isOpen={isEventModalOpen} setIsOpen={setIsEventModalOpen}>
        <ModalHeader>Confirm Registration</ModalHeader>
        <ModalBody>
          <div className='grid grid-cols-12 gap-4'>
            {/* User Name */}
            <div className="col-span-12 mb-4">
              <strong>User:</strong> {userName}
            </div>

            {/* Event Name */}
            <div className="col-span-12 mb-4">
              <strong>Event:</strong> {eventForm.eventName}
            </div>

            {/* Event Date */}
            <div className="col-span-12">
              <strong>Date:</strong> {eventForm.eventDate}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant='solid' onClick={handleSubmitEvent}>Confirm Registration</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default RegisterEvent;
