import Image from "next/image";
import React from "react";
// import OAuth from "../auth/o-auth";
// import Logo from "../shared/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full relative flex items-center justify-center text-foreground">
      <div className="relative w-[90%] max-w-7xl h-[90%] max-h-[800px] bg-linear-to-br from-primary/[0.003] to-secondary/[0.003] backdrop-blur-xl rounded-3xl overflow-hidden  border">
        <div className="absolute top-5 left-5">
            <h1> Klaus Judge </h1>
        </div>
        <div className="flex flex-col lg:flex-row h-full">
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-6 items-center justify-center p-8 lg:p-12">
            <div className="w-full">{children}</div>
          </div>

          <div className="relative hidden lg:block lg:w-[55%] xl:w-[60%] h-full items-center justify-center overflow-hidden ">
            <div className="w-full h-[20%] flex flex-col items-center justify-center text-center">
              <h1 className="text-xl md:text-2xl 2xl:text-3xl font-light leading-tight ">
                See What&apos;s Happening <br />
                this{" "}
                <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  beautiful world
                </span>
                .
              </h1>
            </div>

            <div className="relative w-full h-[80%] flex items-start justify-center">
              <Image src={'/auth1.png'} alt="auth" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


