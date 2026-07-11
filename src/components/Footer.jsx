import { Link } from "wouter";

export default function Footer (){
    return (
        <div className="md:mx-10 text-center md:text-left">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

                <div className="flex flex-col items-center md:items-start">
                    <p className="mb-5 w-40 text-3xl">Turn App</p>
                    <p className="w-full p-5 md:w-2/3 text-gray-600 leading-6">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti, enim. Est eaque illo esse impedit, unde cupiditate dicta sed similique cum optio ut dolorem natus necessitatibus voluptates a dolores libero?
                    </p>
                </div>

                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li><Link href="/">Inicio</Link></li>
                        <li><Link href="/profesionales">Profesionales</Link></li>
                        <li><Link href="/sobre-nosotros">Sobre Nosotros</Link></li>
                        <li><Link href="/contacto">Contacto</Link></li>
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