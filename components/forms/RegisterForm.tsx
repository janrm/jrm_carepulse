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
import {PatientFormValidation, UserFormValidation} from "@/lib/validation";
import {useRouter} from "next/navigation";
import {FormFieldType} from "@/components/forms/PatientForm";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues} from "@/constants";
import {SelectItem} from "@/components/ui/select";
import Image from 'next/image'
import FileUploader from "@/components/FileUploader";
import {registerPatient} from "@/lib/actions/patient.actions";

interface RegisterFormProps {
    dict?: any
    user: User

}

const RegisterForm = ( props: RegisterFormProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const dict = props.dict;
    const user = props.user;

    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })

    async function onSubmit1(values : any) {
        console.log(values);
        router.push(`/nl/patients/${user.$id}/new-appointment/`);
    }
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);

        let formData;
        formData = new FormData();


        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {type : values.identificationDocument[0].type})

            formData.append('blobFile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name)

        }



        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
            }

            const patient = await registerPatient(patientData)

            if (patient) {
                router.push(`/nl/patients/${user.$id}/new-appointment/`)
            }
            setIsLoading(false);

        } catch (error) {

            alert(`Error: ${JSON.stringify(error)}`);
            setIsLoading(false);
        }

    }

    return (
        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-12 flex=1">
                <section className="space-y-4">
                    <h1 className="header">{dict?.title || "Registration Form"}</h1>
                    <p className="text-dark-700">{dict?.subTitle}</p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">{dict?.subHeaderPersonalInfo || 'Personal Information'}</h2>
                    </div>

                </section>

                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    dict={dict?.userNameField}
                    name="name"
                    placeholder={dict?.userNameField.placeholder}
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        dict={dict?.emailField}
                        name="email"
                        placeholder={dict?.emailField.placeholder}
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.PHONE_INPUT}
                        dict={dict?.phoneNumberField}
                        name="phone"
                        placeholder={dict?.phoneNumberField.placeholder}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.DATE_PICKER}
                        dict={dict?.birthDateField}
                        name="birthDate"
                        label="Date of Birth"
                        placeholder={dict?.birthDateField.placeholder}
                        iconSrc="/assets/icons/calendar.svg"
                        iconAlt="email"
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.SKELETON}
                        dict={dict?.genderField}
                        name="gender"
                        label={dict?.labelGender || "Gender"}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between" onChange={field.onChange}
                                            defaultValue={field.value}>
                                    {
                                        GenderOptions.map((option) => (
                                                <div key={option} className="radio-group">
                                                    <RadioGroupItem value={option.toLowerCase()} id={option}/>
                                                    <Label htmlFor={option} className="cursor-pointer">
                                                        {option}
                                                    </Label>
                                                </div>
                                            )
                                        )
                                    }

                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        dict={dict?.addressField}
                        label="Address"
                        name="address"
                        placeholder={dict?.addressField?.placeholder || "Provide your occupation"}
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        dict={dict?.occupationField}
                        label="Occupation"
                        name="occupation"
                        placeholder={dict?.occupationField?.placeholder || "Provide your occupation"}
                    />

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        dict={dict?.emergencyContactField}
                        label="Emergency contact name"
                        name="emergencyContactName"
                        placeholder={dict?.emailField?.placeholder || "Enter the emergency contact"}
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.PHONE_INPUT}
                        dict={dict?.emergencyPhoneNumberField}
                        label="Emergency contact number"
                        name="emergencyContactNumber"
                        placeholder={dict?.phoneNumberField.placeholder}
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">{dict?.subHeaderMedicalInfo || 'Medical Information'}</h2>
                    </div>

                </section>

                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.SELECT}
                    dict={dict?.emergencyContactField}
                    label="Primary Physician"
                    name="primaryPhysician"
                    placeholder={dict?.primaryPhysicianField?.placeholder || "Select a physician"}>
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

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        dict={dict?.addressField}
                        label="Insurance Provider"
                        name="insuranceProvider"
                        placeholder={dict?.addressField?.placeholder || "Enter your insurance company"}
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.INPUT}
                        dict={dict?.occupationField}
                        label="Insurance Policy Number"
                        name="insurancePolicyNumber"
                        placeholder={dict?.occupationField?.placeholder || "Your insurance ID"}
                    />

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        dict={dict?.allergiesField}
                        label="Allergies (if any)"
                        name="allergies"
                        placeholder={dict?.addressField?.placeholder || "Enter your insurance company"}
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        dict={dict?.medicationField}
                        label="Current Medication (if any)"
                        name="currentMedication"
                        placeholder={dict?.medicationField?.placeholder || "Medication"}
                    />

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        dict={dict?.allergiesField}
                        label="Family medical history"
                        name="familyMedicalHistory"
                        placeholder={dict?.addressField?.placeholder || "Family past deceases"}
                    />
                    <CustomFormField
                        control={form.control}
                        fieldType={FormFieldType.TEXTAREA}
                        dict={dict?.medicationField}
                        label="Past medical history"
                        name="pastMedicalHistory"
                        placeholder={dict?.medicationField?.placeholder || "Patients past deceases"}
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">{dict?.identificationVerification || 'Identification and Verification'}</h2>
                    </div>

                </section>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.SELECT}
                    dict={dict?.emergencyContactField}
                    label="Identification type"
                    name="identificationType"
                    placeholder={dict?.identificationTypeField?.placeholder || "Select an identification type"}>
                    {
                        IdentificationTypes.map((idType) => (
                                <SelectItem
                                    key={idType}
                                    value={idType}>
                                    {idType}

                                </SelectItem>
                            )
                        )
                    }
                </CustomFormField>
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    dict={dict?.identificationNumberField}
                    label="Identification Number"
                    name="identificationNumber"
                    placeholder={dict?.identificationNumberField?.placeholder || "0123456789"}
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.SKELETON}
                    dict={dict?.scannedCopyOfIdentificationDocumentField}
                    name="identificationDocument"
                    label={dict?.scannedCopyOfIdentificationDocumentField || "Scanned copy of identification document"}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange}/>
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">{dict?.consentAndPrivacy || 'Consent and Privacy'}</h2>
                    </div>

                </section>

                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="treatmentConsent"
                    label={dict?.treatmentConsentFieldLabel || "treatmentConsent"}
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="disclosureConsent"
                    label={dict?.disclosureConsentFieldLabel || "disclosureConsent"}
                />
                <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.CHECKBOX}
                    name="privacyConsent"
                    label={dict?.privacyConsentFieldLabel || "privacyConsent"}
                />

                <SubmitButton isLoading={isLoading} >{dict?.button.text}</SubmitButton>
            </form>
        </Form>
    )
}
export default RegisterForm
