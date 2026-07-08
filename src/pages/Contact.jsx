import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
        
        <div className='text-center text-2xl pt-10 text-gray-200'>
            <p>CONTACT <span className='text-gray-400 font-semigold'>US</span></p>
        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
            <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

            <div className='flex flex-col justify-center items-start gap-6'>
                <p className='font-semibold text-lg text-white'>DIRECCION</p>
                <p className='text-gray-300'>Ponce de leon 342 <br /> San Nicolás de los Arroyos</p>
                <p className='text-gray-300'>Tel: (+54) 9 336 453-2245 <br /> Email: contacto@gmail.com</p>
                <p className='font-semibold text-lg text-white'>TRABAJA CON NOSOTROS</p>
                <p className='text-gray-300'>Postulate como doctor y nos contactaremos contigo.</p>
                <button className='bg-primary border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>POSTULARME</button>
            </div>
        </div>

    </div>
  )
}

export default Contact