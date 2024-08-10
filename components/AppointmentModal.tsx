'use client'
import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import AppointmentForm from "@/components/forms/Appointment";
import {Appointment} from "@/types/appwrite.types";

const AppointmentModal = ({type, patientId, appointment, userId, } : {
    type: 'schedule' | 'cancel' | 'pending',
    patientId : string,
    userId: string,
    appointment: Appointment,

}) => {
    const [open, setOpen] = useState(false);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={`capitalize ${type === 'schedule' && 'text-green-500'} ${type === 'pending' && 'text-blue-500'}`}>
                    {type}
                </Button>
            </DialogTrigger>
            <DialogContent className="shad-dialog sm:max-w-md">
                <DialogHeader className="mb-4 space-y-3">
                    <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
                    <DialogDescription>
                        Please fill in the following details to {type} an appointment.
                    </DialogDescription>
                </DialogHeader>
                <AppointmentForm
                    type={type}
                    patientId = {patientId}
                    appointment = {appointment}
                    userId={userId}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>

    )
}
export default AppointmentModal
