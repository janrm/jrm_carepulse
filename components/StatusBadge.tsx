import React from 'react'
import {LRUCache} from "lru-cache";
import {clsx} from "clsx";
import Image from "next/image";
import {StatusIcon} from "@/constants";

const StatusBadge = ({status}: { status: Status }) => {
    return (
        <div className={clsx('status-badge', {
                'bg-blue-600': status === 'pending',
                'bg-red-600': status === 'cancelled',
                'bg-green-600': status === 'scheduled',

            }
        )}>
            <Image src={StatusIcon[status]} alt={status} width={32} height={32} className="h-fit w-3"/>
            <p className={clsx('text-12-semibold', {
                'text-blue-500': status === 'pending',
                'text-red-500': status === 'cancelled',
                'text-green-500': status === 'scheduled',
            })}>{status}</p>
        </div>
    )
}
export default StatusBadge
