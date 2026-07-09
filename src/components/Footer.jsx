import { assets } from "../assets/assets";

export default function Footer (){
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                <div>
                    <p className="mb-5 w-40 text-3xl">Turn App</p>
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, enim. Est eaque illo esse impedit, unde cupiditate dicta sed similique cum optio ut dolorem natus necessitatibus voluptates a dolores libero?</p>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Inicio</li>
                        <li>Sobre Nosotros</li>
                        <li>Contactanos</li>
                        <li>Politicas de privacidad</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">CONTACTANOS</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>+54 9 336 440-9058</li>
                        <li>contacto@gmail.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className="py-5 text-sm text-center">Copyright © 2026 All Rights Reserved</p>
            </div>
        </div>
    )
}