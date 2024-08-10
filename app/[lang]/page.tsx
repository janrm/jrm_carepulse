import Image from "next/image";
import {Button} from "@/components/ui/button";
import PatientForm from "@/components/forms/PatientForm";
import Link from "next/link";
import {getDictionary} from "@/app/[lang]/dictionaries";
import {BUCKET_ID} from "@/lib/appwrite.config";
import PasskeyModal from "@/components/PasskeyModal";

// @ts-ignore
export default async function Home({params: {lang}, searchParams} : SearchParamProps) {
    const dict = await getDictionary(lang);
    const isAdmin = searchParams.admin === 'true';

  return (
      <div className="flex h-screen max-h-screen">
          {isAdmin && <PasskeyModal />}
          {/* TODO: OTP Verification | PasskeyModal */}
        <section className="remove-scrollbar container my-auto">
            <div className="sub-container max-w-[496px]">
                <Image
                src={dict.home.logo.src}
                width={dict.home.logo.size}
                height={dict.home.logo.size}
                alt = {dict.home.logo.alt}
                className="mb-12 h-10 w-fit"
                />
                <PatientForm dict={dict.patientForm}/>
                <div className="text-14-regular mt-20 flex justify-between">
                    <p className="justify-items-end text-dark-600 xl:text-left">
                        {dict.copyright}
                    </p>
                    <Link href=".?admin=true" className="text-green-400">
                        {dict.admin.title}
                    </Link>
                </div>
            </div>
        </section>

          <Image
            src="/assets/images/onboarding-img.avif"
            height={1000}
            width={1000}
            alt="patient"
            className="side-img max-w-[50%]"
          />
      </div>
  )
}
