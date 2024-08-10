"use server"
import {ID, Query, Client, Databases} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {InputFile} from "node-appwrite/file";
import {
    APPOINTMENT_COLLECTION_ID,
    BUCKET_ID,
    DATABASE_ID, databases,
    ENDPOINT,
    PATIENT_COLLECTION_ID, PROJECT_ID,
    storage,
    users
} from "@/lib/appwrite.config";

export const createUser = async (user: CreateUserParams) => {
    try {
        return await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name
        )
    } catch (error: any) {
        if (error && error?.code === 409) {
            const existingUser = await users.list([
                Query.equal('email', [user.email])
            ])
            return existingUser?.users[0]
        }
        console.log(error)
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);
        console.log(user)
        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patient = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
            )
        return parseStringify(patient.documents[0]);
    }
    catch (err) {
        console.log(err);
    }

}
export const registerPatient1 = async(values : any)=> {
    console.log(values);
    return 1;
}


export const registerPatient = async ({identificationDocument, ...patient} : RegisterUserParams) => {
    console.log('Register Patient', identificationDocument?.get('fileName') as string );
    try {
        let file;
        if(identificationDocument?.get('fileName') as string)  {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile).catch(err => {console.log('Bucket error: ',err)});
        }

        console.log('Create Client',BUCKET_ID);

        const client = new Client()
            .setEndpoint(ENDPOINT!)
            .setProject(PROJECT_ID!);
        console.log('Create Database');
        const databases = new Databases(client);

        console.log('Create Patient', DATABASE_ID, PATIENT_COLLECTION_ID);
        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
                ID.unique(),
                {
                    ...patient,
                    identificationDocumentId: file?.$id || null,
                    identificationDocumentUrl: file?.$id ?`${ENDPOINT!}/storage/buckets/${BUCKET_ID!}/files/${file?.$id}/view?project=${PROJECT_ID}` : ""
                }
            ).catch((err) => console.log('Database error:', err))
        console.log(newPatient);

            return newPatient;
        }
        catch (error : any)
        {
            console.log(error);
        }

}
