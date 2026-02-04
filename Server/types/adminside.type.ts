import {Document,Types} from "mongoose"

export interface Product extends Document{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string; 
  isActive: boolean;
  
}

export interface Productinput{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string; 
  isActive?: boolean;
}

