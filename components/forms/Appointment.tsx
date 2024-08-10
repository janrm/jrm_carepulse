"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {Doctors} from "@/constants";
import {SelectItem} from "@/components/ui/select";
import Image from "next/image";
import {createAppointment, updateAppointment} from "@/lib/actions/appointment.actions";
import {getAppointmentSchema} from "@/lib/validation";
import {Appointment} from "@/types/appwrite.types";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}




interface AppointmentFormProps {
    dict?: any
    userId : string,
    patientId : string,
    type : 'create' | 'cancel' | 'schedule' | 'pending'
    appointment?: Appointment
    setOpen?: (open : boolean) => void
}

const AppointmentForm = ({userId, patientId, type, appointment, setOpen, dict}: AppointmentFormProps, params : {lang : string }) => {

    const [isLoading, setIsLoading] = useState(false)
    //const {dict} = props;
    const router = useRouter();
    const AppointmentFormValidation = getAppointmentSchema(type);

    // 1. Define your form.
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician : appointment?.primaryPhysician || "",
            schedule: appointment ? new Date(appointment.schedule) : new Date(),
            reason: appointment?.reason || "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",

        },
    })

    async function onSubmit1(values: any) {
        alert(values);
    }

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);
        let status;

        switch (type) {
            case 'cancel' :
                status = "cancelled";
                break;
            case 'create' :
                status = "pending";
                break;
            case 'schedule' :
                status = "scheduled";
                break;
            default:
                status = "pending";
                break;
        }
        try {
            if (type==="create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason,
                    note: values.note,
                    status: status as Status,
                    cancellationReason: values.cancellationReason
                }
                const appointment = await createAppointment(appointmentData);

                if (appointment) {
                    form.reset();
                    router.push(`/nl/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }
        else {
            const appointmentToUpdate = {
                userId,
                appointmentId: appointment?.$id!,
                appointment: {
                    primaryPhysician: values?.primaryPhysician,
                    schedule: new Date(values?.schedule),
                    status: status as Status,
                    cancellationReason: values?.cancellationReason,
                },
                type
            }
            const updatedAppointment = await updateAppointment(appointmentToUpdate);
            if (updatedAppointment) {
                setOpen && setOpen(false)
                form.reset()
            }
            }
        }
        catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    }

    let buttonLabel;

    switch (type) {
        case 'cancel' :
            buttonLabel = "Cancel Apppointment"
            break;
        case 'create' :
            buttonLabel = "Create Apppointment"
            break;
        case 'schedule' :
            buttonLabel = "Schedule Apppointment"
            break;
        default:
            buttonLabel = "Submit"
    }

    // @ts-ignore
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex=1">
                <section>
                    {type === 'create' && (
                        <section className="mb-12 space-y-4">
                        <h1 className="header">{dict?.title || "New Appointment"}</h1>
                        <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                    </section>
                    )}
                </section>

                {// @ts-ignore
                    type !== "cancel" && (
                    <>
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.SELECT}
                            dict={dict?.emergencyContactField}
                            label="Doctor"
                            name="primaryPhysician"
                            placeholder={dict?.primaryPhysicianField?.placeholder || "Select a doctor"}>
                            {
                                Doctors.map((doctor) => (
                                        <SelectItem
                                            key={doctor.name}
                                            value={doctor.name}>
                                            <div className="flex cursor-pointer items-center gap-2">
                                                <Image
                                                    src={doctor.image}
                                                    width={32}
                                                    height={32}
                                                    alt={doctor.name}
                                                    className="rounded-full border border-dark-500 "
                                                />
                                                <p>{doctor.name}</p>
                                            </div>

                                        </SelectItem>
                                    )
                                )
                            }
                        </CustomFormField>
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.DATE_PICKER}
                            name="schedule"
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="dd-MM=yyyy - HH:mm"
                        />
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="reason" label="Reason for appointment" placeholder="Enter a reason for the appointment" />
                            <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="note" label="Notes" placeholder="Enter notes" />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="cancellationReason" label="Reason for cancellation" placeholder="Enter a reason for cancellation" />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === "cancel" ? 'shad-danger-btn' : 'shad-primary-btn' } w-full`}
                >{dict?.button.text || `${buttonLabel}`}</SubmitButton>
            </form>

        </Form>
    )
}
export default AppointmentForm
