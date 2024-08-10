import React from 'react'
import {param} from "ts-interface-checker";
import Image from "next/image";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import {getDictionary} from "@/app/[lang]/dictionaries";
import RegisterForm from "@/components/forms/RegisterForm";
import {getUser} from "@/lib/actions/patient.actions";
import * as Sentry from '@sentry/nextjs';

const Register = async ({params: {lang, userId}} : SearchParamProps) => {
    const user = await getUser(userId);
    const dict = await getDictionary(lang)
    Sentry.metrics.set("user_view_register", user.name)
    return (
        <div className="flex h-screen max-h-screen">
            {/* TODO: OTP Verification | PasskeyModal */}
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
                    <Image
                        src={dict.home.logo.src}
                        width={dict.home.logo.size}
                        height={dict.home.logo.size}
                        alt={dict.home.logo.alt}
                        className="mb-12 h-10 w-fit"
                    />

                    <RegisterForm
                        dict={dict.registerForm}
                        user={user}
                    />

                    <p className="copyright py-12">
                        {dict.copyright}
                    </p>

                </div>
            </section>

            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="patient"
                className="side-img max-w-[30%]"
            />
        </div>
    )
}
export default Register
