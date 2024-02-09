import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface PopUpProps {
	message: string;
}

function popUp(message: string){
	toast.success(message);
	return <Toaster />;
}

export default popUp;