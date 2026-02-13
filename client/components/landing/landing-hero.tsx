import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import Link from "next/link"
import Image from 'next/image';
const Hero = () => {
  return (
    <section id="home" className="w-full h-screen container mx-auto flex items-center justify-between relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-linear-to-b from-primary/5 to-secondary/10 blur-[120px]" />
        </div>

      <div className="w-full lg:w-[45%] flex flex-col space-y-2">
        <h1 className="text-3xl md:text-5xl font-normal text-foreground tracking-tight">
          Master the art of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Coding Interviews
          </span>
        </h1>
        <p className="text-lg md:text-xl text-foreground-secondary mb-4">
          The ultimate platform to practice data structures, algorithms, and system design. Level up your skills and land your dream job.
        </p>
        <div className="flex flex-col sm:flex-row  gap-4">
            <Button variant={"btn"}>
                <Link href={'/about'}> Learn More </Link>
            </Button>

            <Button variant={"btn2"}>
                <Link href={'/home/'}> Start Learning </Link>
                <ChevronRight width={4} height={4} />
            </Button>
        </div>
      </div>


        <div className='hidden lg:block lg:w-[50%]'>
            <Image src={'/images/auth/auth5.jpg'} alt="Hero Image" width={400} height={400} className='w-[100%] rounded-lg' />
        </div>

    </section>

  );
};

export default Hero;
