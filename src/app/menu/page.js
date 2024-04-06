'use client'
import React, { useState, useEffect } from 'react';
import NavBarCliente from "@/components/custom/navbar/NavBarCliente";
import MenuOption from '@/components/custom/MenuCliente/MenuOption/MenuOption';
import Card from '@/components/custom/MenuCliente/vista/Card';  // Importa el componente Card para mostrar cada producto
import useStore from "@/hook/useSession.js";
import NavBarAdmin from '@/components/custom/navbar/navbarAdmin/NavBarAdmin';
import NavbarCashier from '@/components/custom/navbar/nabvarCashier/NavBarCashier';
import { FiShoppingCart } from "react-icons/fi";
import useCart from "@/hook/useCart";


const PgMenu = () => {
  const {getUserData} = useStore()
  const [products, setProducts] = useState([])
  const [url, setUrl]= useState('/api/products')
  const { getCart } = useCart();
    const cartItems = getCart().length;
  const recibirDatos = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setProducts(data.result)
  }

  useEffect(()=>{
    recibirDatos();
  },[url])

  const role = getUserData();
  



    return (
        <div className="w-full h-full  bg-[rgba(23,23,23,.5)]flex justify-center items-center overflow-y-auto">
            <div className="w-full h-full flex flex-col">
                <div className="w-full flex flex-col">
                     {role === 'admin' ? <NavBarAdmin/> : <NavBarCliente/>}
                     {role === 'cajero' ? <NavbarCashier/> :  " "}
                </div>
<<<<<<< HEAD
                <div className="flex flex-col items-end">
                        <MenuOption  setUrl={setUrl}/>
                        <div className="relative">
                       <FiShoppingCart size={24} />
                               {cartItems > 0 && (
                                 <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex justify-center items-center text-xs">
                               {cartItems}
                       </div>
                              )}
                     </div>
                    </div>

                <div className="flex flex-wrap gap-4 justify-center mt-11">
=======
                <div  >
                {role === 'admin' ? <div className="flex flex-col items-end mt-14"><MenuOption  setUrl={setUrl}/></div>: ""}
                {role === 'cajero' ? <div className="flex flex-col items-end "><MenuOption  setUrl={setUrl}/></div>: ""}
                {role !== 'cajero' && role !== 'admin' ? <div className="flex flex-col items-end "><MenuOption  setUrl={setUrl}/></div>: ""}
                
                </div>
                <div className="flex flex-wrap gap-4 justify-center ">
>>>>>>> 607eaf1ac32661aa612b790d4ba3ba2e15af26e7

                  {
                    products.map((product)=>{
                      return <Card  product={product} />
                    })
                  }
                   
                </div>
            </div>
        </div>
       
    );
};

export default PgMenu;

/*

*/