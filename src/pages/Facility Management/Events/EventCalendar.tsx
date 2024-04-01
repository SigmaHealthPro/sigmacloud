import React, { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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


  const [eventData, setEventData] = useState<Event[]>([]);
  useEffect(() => {
         fetchEventData();
     }, []);
 const fetchEventData = async () => {
     try {
       const response = await fetch('https://localhost:7155/api/Event/searchevent', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'accept': '*/*'
         },
         body: JSON.stringify({
                 "keyword": null,
                 "pagenumber": 1,
                 "pagesize": 10,
                 "eventName": null,
                 "eventDate": null,
                 "vaccineName": null,
                 "providerName": null,
                 "siteName": null,
                 "orderby": null
         })
       });
       if (!response.ok) {
         throw new Error('Network response was not ok');
         console.log('response');
       }
       console.log('response',response);
       const data = await response.json();
       console.log('data',data);
       setEventData(data);
     } catch (error) {
       console.error('There was a problem fetching the data: ', error);
     }
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


  const formattedEventData = eventData.map(event => ({
    start: new Date(event.eventDate),
    end: new Date(event.eventDate), 
    title: event.eventName,
    
    data: {
      type: "App",
    },
  }));

  return (
    <BigCalendar
    events={formattedEventData}

      components={components}
      localizer={localizer}
    />
  );
};

export default EventCalendar;
