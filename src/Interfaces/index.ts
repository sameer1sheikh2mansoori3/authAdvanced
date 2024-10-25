import { z } from "zod";

const registerUser = z.object({
    name: z.string(),
    email:z.string().email(),
    password:z.string().min(6).max(12)
});

interface Customreq extends Request{
    userId? : string,
    cookies?:any,
    cookie?:any
    }
type registerUsertype = z.infer<typeof registerUser>
export {registerUser , registerUsertype  , Customreq};