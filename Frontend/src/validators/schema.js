import { z } from "zod";

export const checkoutSchema = z.object({

    name: z.string().min(1, "Name is required"),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid 10-digit Indian mobile number"),
    pincode: z.string().length(6, "Pincode must be exactly 6 digits"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(10, "Please provide a complete address (House No, Building)"),
    landmark: z.string().optional(),
}) 

