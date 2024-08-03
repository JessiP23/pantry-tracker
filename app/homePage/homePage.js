import React from "react";
import Image from "next/image";
import pantry from '../images/pantry.jpg'
import tracker from '../images/tracker.jpg';
import fruit from '../images/fruit.jpg';

const HomePage = () => {
  return (
    <div>
      <h1 className="text-center text-white text-5xl">Welcome <span className="text-purple-900"> to </span> my <span className="text-purple-900"> Pantry </span> Tracker <span className="text-purple-900"> App </span></h1>
      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              <div className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <Image src={pantry} className="h-full w-full object-cover object-center"/>
                </div>
              </div>
              <div className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <Image src={tracker} className="h-full w-full object-cover object-center"/>
                </div>
              </div>
              <div className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <Image src={fruit} alt="Insulated travel bottles" className="h-full w-full object-cover object-center"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
