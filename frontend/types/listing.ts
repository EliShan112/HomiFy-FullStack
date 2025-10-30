import { Review } from "./review";


export type Listing = {
        _id: string;
        title: string;
        description: string;
        image: {
            url: string;
        };
        price: number;
        location: string;
        country: string;
        review:Review[];
        owner: {
            _id: string;
            username: string;
            email: string;
        }
    }