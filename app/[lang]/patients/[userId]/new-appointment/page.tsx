import React from 'react'
import {getDictionary} from "@/app/[lang]/dictionaries";
import Image from "next/image";
import AppointmentForm from "@/components/forms/Appointment";
import {getPatient} from "@/lib/actions/patient.actions";
import * as Sentry from '@sentry/nextjs';

// @ts-ignore
export default async function  NewAppointment({params: {userId, lang }} : SearchParamProps) {
    const dict = await getDictionary(lang);
    const patient = await getPatient(userId);
    Sentry.metrics.set("user_view_new-appointment", patient.name)
    return (
        <div className="flex h-screen max-h-screen">
            {/* TODO: OTP Verification | PasskeyModal */}
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[860px] flex-1 justify-between">
                    <Image
                        src={dict.home.logo.src}
                        width={dict.home.logo.size}
                        height={dict.home.logo.size}
                        alt = {dict.home.logo.alt}
                        className="mb-12 h-10 w-fit"
                    />
                    <AppointmentForm dict={dict.appointmentForm}
                                     type="create"
                                     userId={userId}
                                     patientId = {patient.$id}

                    />
                        <p className="copyright mt-10 py-12">
                            {dict.copyright}
                        </p>
                </div>
            </section>

            <Image
                src="/assets/images/appointment-img.png"
                height={1000}
                width={1000}
                alt="appintment"
                className="side-img max-w-[390px] bg-bottom "
            />
        </div>
    )
}
//export default NewAppointment
