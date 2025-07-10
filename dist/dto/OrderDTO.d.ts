export declare class UpdateBidDTO {
    amount: number;
    timeEstimate: string;
}
export declare class TitleDescription {
    text: string;
}
declare class Coordinates {
    lat: number;
    lon: number;
}
declare class Location {
    city: string;
    coords: Coordinates;
}
export declare class OrderDTO {
    title: TitleDescription;
    description: TitleDescription;
    location: Location;
    budget: number;
    status: string;
    postedAt: string;
    category: string;
    customerId: string;
    allowBidding: boolean;
    isEnable: boolean;
    images?: string[];
}
export declare class UpdateOrderDTO {
    title?: TitleDescription;
    description?: TitleDescription;
    location?: Location;
    budget?: number;
    status?: string;
    images?: string[];
    acceptedBidRepairmanId?: string;
}
export declare class OrderResponseDTO {
    id: string;
    customerId: string;
    title: {
        en: string;
        hi: string;
    };
    description: {
        en: string;
        hi: string;
    };
    budget: number;
    location: {
        city: string;
    };
    status: string;
    createdAt: Date;
    updatedAt: Date;
    images: string[];
    bids: {
        repairmanId: string;
        amount: number;
        timeEstimate: string;
        bidAt: string;
        id: string;
    }[];
    acceptedBidRepairmanId?: string | null;
    allowBidding: boolean;
}
export {};
