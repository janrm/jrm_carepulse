import React from 'react'
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Control} from "react-hook-form";
import {FormFieldType} from "@/components/forms/PatientForm";
import Image from "next/image";
import 'react-phone-number-input/style.css'
import PhoneInput from "react-phone-number-input";
import {E164Number} from "libphonenumber-js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import {Select, SelectContent, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";

interface CustomFormField {
    control?: Control<any>
    fieldType: FormFieldType
    dict?: any
}

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode,
    dict?: any
}

const RenderField = ({field, props}: { field: any; props: CustomProps; }) => {
    const {fieldType, iconSrc, iconAlt, dict, showTimeSelect, dateFormat, placeholder, renderSkeleton} = props
    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            alt={iconAlt || "Icon"}
                            width={24}
                            height={24}
                            className="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={dict?.placeholder || placeholder}
                            {...field}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        {...field}
                        defaultCountry="NL"
                        placeholder={dict?.placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="calendar"
                        className="ml-12"
                    />
                    <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat={dateFormat ?? (dict?.dateFormat || 'dd-MM-yyyy')}
                        timeFormat='HH:mm'
                        showTimeSelect={showTimeSelect ?? false}
                        timeInputLabel={dict?.timeLabel || "Time:"}
                        wrapperClassName="date-picker"
                    />
                </div>
            )
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange}
                            defaultValue={field.value}>
                        <FormControl >
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>

                </FormControl>
            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="shad-textarea"
                        disabled={props.disabled}
                    />
                </FormControl>
            )
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    <label className="checkbox-label" htmlFor={props.name}>
                        {props.label}
                    </label>
                    </div>
                </FormControl>
            )
        case FormFieldType.SKELETON:
            return(renderSkeleton ? renderSkeleton(field) : null);
    }
}

const CustomFormField = (props: CustomProps) => {
    const {control, fieldType, dict, name, label} = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && (
                        <FormLabel>{dict?.label || label}</FormLabel>
                    )}

                    <RenderField field={field} props={props}/>

                    <FormMessage className="shad-error"/>
                </FormItem>
            )}
        />

    )
}
export default CustomFormField
