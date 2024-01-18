import Work from "@models/Work";
import { writeFile } from "fs/promises";
import { connectToDB } from "@mongodb/database";


export async function POST(req) {
    try {
        await connectToDB();

        const data = await req.formData()

        //pegando dados dos inputs
        const creator = data.get('creator')
        const category = data.get('category')
        const title = data.get('title')
        const description = data.get('description')
        const price = data.get('price')

        //pegando dados dos uploads de fotos
        const photos = data.getAll("workPhotoPaths")
        const workPhotoPaths = []

        for(const photo of photos) {
            const bytes = await photo.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const workImagePath = `C:/Users/FUNPREV/OneDrive/Área de Trabalho/artify/public/uploads/${photo.name}`
            
            await writeFile(workImagePath, buffer)

            workPhotoPaths.push(`/uploads/${photo.name}`)
        }

        const newWork = new Work({
            creator, category, title, description, price, workPhotoPaths
        })

        await newWork.save()

        return new Response(JSON.stringify(newWork), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Failed to create new work", { status: 500 })
    }
}