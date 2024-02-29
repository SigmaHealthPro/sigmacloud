import React, { createContext, useContext, FC, useState, ReactNode } from 'react';
export interface Cart {
	product: string;
	vaccine: string;
	manufacturer: string;
	quantity: string;
	price: string;
}
export interface CartContext {
	cartItems: Cart[];
	setCartItems: (cartItems: Cart[]) => void;
}
