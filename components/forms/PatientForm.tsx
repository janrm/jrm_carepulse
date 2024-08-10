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
import {Input} from "@/components/ui/input"
import CustomFormField from "@/components/CustomFormField";
import SubmitButton from "@/components/SubmitButton";
import {useState} from "react";
import {UserFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {createUser} from "@/lib/actions/patient.actions";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}




interface PatientFormProps {
    dict?: any
}

const PatientForm = (props: PatientFormProps, params : {lang : string }) => {

    const [isLoading, setIsLoading] = useState(false)
    const {dict} = props;
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);

        try {
            const userData = {name, email, phone};

            const user = await createUser(userData)

            if (user) {
                router.push(`/nl/patients/${user.$id}/register`)
            }
        }
        catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex=1">
                <section>
                    <section className="mb-12 space-y-4">
                        <h1 className="header">{dict.title}</h1>
                        <p className="text-dark-700">Schedule your first appointment</p>
                    </section>
                </section>
                <CustomFormField
                    control={form.control}
                    fieldType ={FormFieldType.INPUT}
                    dict = {dict.userNameField}
                    name = "name"
                    placeholder = {dict.userNameField.placeholder}
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />
                <CustomFormField
                    control={form.control}
                    fieldType ={FormFieldType.INPUT}
                    dict = {dict.emailField}
                    name = "email"
                    placeholder = {dict.emailField.placeholder}
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />
                <CustomFormField
                    control={form.control}
                    fieldType ={FormFieldType.PHONE_INPUT}
                    dict = {dict.phoneNumberField}
                    name = "phone"
                    placeholder = {dict.phoneNumberField.placeholder}
                />
                <SubmitButton isLoading={isLoading}>{dict.button.text}</SubmitButton>
            </form>
        </Form>
    )
}
export default PatientForm
