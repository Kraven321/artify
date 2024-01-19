import Work from "@models/Work";
import { connectToDB } from "@mongodb/database";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();

        const { query } = params;

        let works = []

        if(query === "all") {
            works = await Work.find().populate("creator")
        } else {
            works = await Work.find({
                $or: [
                    { 'title': { $regex: query, $options: "i" } },
                    { 'description': { $regex: query, $options: "i" } }
                ]
            }).populate("creator")
        }

        if(!works) return new Response("no works found", { status: 404 });

        return new Response(JSON.stringify(works), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
    