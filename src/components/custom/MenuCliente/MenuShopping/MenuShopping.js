import React, { useState, useEffect } from 'react';
import useCart from '@/hook/useCart';
import Swal from 'sweetalert2';

const MenuShopping = ({ onItemRemoved }) => {
    const { getCart, removeFromCart, clearCart, addToCart } = useCart();
    const [subtotal, setSubtotal] = useState(0);

    const calculateSubtotal = () => {
        const cart = getCart();
        const total = cart
            .filter(item => !item.hasOwnProperty('id_mesa'))
            .reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        setSubtotal(total);
    };

    const handleRemoveFromCart = (index) => {
        removeFromCart(index);
        onItemRemoved();
        calculateSubtotal();
    };

    useEffect(() => {
        calculateSubtotal();
    }, []);

    const handleCheckout = () => {
        const inputAmount = parseFloat(document.getElementById("inputAmount").value);

        if (isNaN(inputAmount)) {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: 'Caracteres no válidos',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if (subtotal === 0) {
            Swal.fire({
                position: 'top-center',
                text: 'No hay productos en el carrito',
                icon: 'error',
                showConfirmButton: false,
                timer: 2500
            });
            return;
        }

        const mesa = getCart().find(item => item.hasOwnProperty('id_mesa'));
        if (!mesa) {
            Swal.fire({
                position: 'top-center',
                text: 'Debe seleccionar una mesa antes de realizar el pedido',
                icon: 'error',
                showConfirmButton: false,
                timer: 2500
            });
            return;
        }

        if (inputAmount < subtotal) {
            Swal.fire({
                position: 'top-center',
                text: 'Saldo insuficiente',
                icon: 'error',
                showConfirmButton: false,
                timer: 2500
            });
            return;
        }

        const cart = getCart();
        const productos = cart
            .filter(item => item.id && item.cantidad && item.precio)
            .map(item => ({
                id_producto: item.id,
                cantidad_producto: item.cantidad,
                valor_unitario: item.precio
            }));

        const payload = {
            productos,
            valor_total: subtotal,
            estado: "pagado",
            mesa_id: mesa.id_mesa,
            valor_pagado: inputAmount
        };

        fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar la solicitud');
            }
            return response.json();
        })
        .then(data => processData(data))
        .catch(error => {
            console.error('Error al enviar el pedido:', error);
            error();
        });
    };

    const processData = (data) => {
        if (data) {
            exito();
            handleDeleteCart();
        } else {
            error();
        }
    };

    const exito = () => {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Pedido realizado con éxito',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const error = () => {
        Swal.fire({
            position: 'top-center',
            title: 'Error',
            text: 'Se ha detectado un error',
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
        });
    };

    const handleDeleteCart = () => {
        const cart = getCart();
        const cartWithoutMesa = cart.filter(item => item.hasOwnProperty('id_mesa'));
        clearCart();
        cartWithoutMesa.forEach(item => addToCart(item));
        onItemRemoved();
        calculateSubtotal();
    };

    return (
        <div className="max-h-[540px] overflow-y-auto">
            <h2 className='text-slate-400'>Resumen de compra</h2>
            <div className='gap-5'>
                <ul className='pt-6'>
                    {getCart().map((item, index) => (
                        <li key={index}>
                            {item.hasOwnProperty('id_mesa') ? (
                                <>{<>Mesa: {item.id_mesa}<br /></>}</>
                            ) : (
                                <>
                                    <div className="rounded-md border border-gray-300 p-3 mb-3">
                                        {item.nombre} - Cantidad: {item.cantidad}
                                        <div className='flex flex-row'>
                                            Precio: ${item.precio.toLocaleString()}
                                            <button onClick={() => handleRemoveFromCart(index)} className='text-red-500 ml-2'>Eliminar</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}

                </ul>
            </div>

            <div className='flex flex-col space-y-3 pt-6'>
                <p>Subtotal: ${subtotal.toLocaleString()}</p>
                <input className='pl-3 h-8'
                    id='inputAmount'
                    type="number"
                    placeholder="Ingrese la cantidad a pagar"
                />
                <button onClick={handleCheckout} className='bg-green-600 rounded-lg h-8 text-white hover:bg-green-700'>Realizar pago</button>
                <button onClick={handleDeleteCart} className='bg-red-600 rounded-lg h-8 text-white hover:bg-red-700'>Cancelar Pedido</button>
            </div>
        </div>
    );
};

export default MenuShopping;
