import React from 'react';
import Navbar from './landing-nav';
import Hero from './landing-hero';
import Features from './landing-features';
import Footer from './landing-footer';
import { Button } from '../ui/button';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-y-auto space-y-10">


      <Navbar />

      <main className='w-full mx-auto flex flex-col gap-20 2xl:gap-32'>
        <Hero />

        <section className="border-y border-border bg-card/10 py-12">
          <div className="w-full mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl 2xl:text-4xl font-bold text-foreground-secondary">2,500+</div>
              <div className="text-sm lg:text-xl text-foreground-tertiary">Problems</div>
            </div>
            <div>
              <div className="text-3xl 2xl:text-4xl font-bold text-foreground-secondary">150k+</div>
              <div className="text-sm lg:text-xl text-foreground-tertiary">Users</div>
            </div>
            <div>
              <div className="text-3xl 2xl:text-4xl font-bold text-foreground-secondary">45k+</div>
              <div className="text-sm lg:text-xl text-foreground-tertiary">Submissions</div>
            </div>
            <div>
              <div className="text-3xl 2xl:text-4xl font-bold text-foreground-secondary">100+</div>
              <div className="text-sm lg:text-xl text-foreground-tertiary">Companies</div>
            </div>
          </div>
        </section>

        <Features />

        <section className="px-4 text-center">
          <div className="max-w-5xl mx-auto p-12 rounded-3xl bg-gradient-to-b from-card/70 to-primary/10 border border-border relative overflow-hidden">
            <h2 className="text-3xl lg:text-4xl font-normal mb-4 tracking-[1px]">Ready to ace your interview?</h2>
            <p className="text-foreground-secondary mb-8 tracking-[.5px]">Join thousands of developers who have leveled up their careers with CodeQuest.</p>
            <Button variant={'btn'}>
                <Link href={'/auth/sign-up'}>Get Started For Fre </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
