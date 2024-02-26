import { FilterQuery } from "mongoose";
import Activity from "./Activity";
import { ISupplierDetail } from "../Supplier/Supplier.queries";

export interface IActivity {
    _id: string;
    id: number;
    title: string;
    price: number;
    currency: string;
    rating: number;
    specialOffer: boolean;
    supplierId: number;
    supplierDetail: ISupplierDetail;
    formattedPrice: string;
    supplierName: string;
    supplierAddress: string;
}

export const getActivityByQuery = (query: FilterQuery<any>) => {
    return Activity
        .aggregate()
        .lookup({
            from: "suppliers",
            localField: "supplierId",
            foreignField: "id",
            as: "supplierDetail",
        })
        .unwind("$supplierDetail")
        .match(query)
}

export const getActivityByFilter = async (query: FilterQuery<any>, limit: number, page: number, sort: string, sortOrder: 1 | -1) => {
    const activities = getActivityByQuery(query)
    if (sort) {
        activities.sort({ [sort]: sortOrder });
    }
    activities.skip((page - 1) * limit)
        .limit(limit)

    return activities;
}