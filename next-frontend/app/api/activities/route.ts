import dbConnect from "../../../lib/mongodb";
import { IActivity, getActivityByFilter, getActivityByQuery } from "../../../models/Activity/Activity.queries";
import { ISupplierDetail } from "../../../models/Supplier/Supplier.queries";
import { generatePageMeta } from "../../utilities/urls";

export interface ActivityApiResponse {
    data: IActivity[];
    meta: IMetaData;
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 5);
    const sort = url.searchParams.get("sort") || "title";
    const sortOrder = url.searchParams.get("sort_order") === "asc" ? 1 : -1
    const search = url.searchParams.get("search")
    await dbConnect();

    const activityTitleSearchQuery: any = { title: { $regex: search ?? '', $options: 'i' } }

    const totalActivityCount: number = (await getActivityByQuery(activityTitleSearchQuery)).length;
    const activities: IActivity[] = await getActivityByFilter(activityTitleSearchQuery, limit, page, sort, sortOrder);

    const activitiesWithSupplier = activities.map(activityDetails => {
        const supplierDetail: ISupplierDetail = activityDetails.supplierDetail;
        let supplierAddress = [];
        if (supplierDetail?.address) {
            supplierAddress.push(supplierDetail.address)
        }

        if (supplierDetail?.zip) {
            supplierAddress.push(supplierDetail.zip)
        }

        if (supplierDetail?.city) {
            supplierAddress.push(supplierDetail.city)
        }


        if (supplierDetail?.country) {
            supplierAddress.push(supplierDetail.country)
        }
        return {
            ...activityDetails,
            formattedPrice: `${activityDetails.currency}${activityDetails.price}`,
            supplierName: supplierDetail?.name ?? "",
            supplierAddress: supplierAddress.join(", ")
        }
    })

    const totalPage = Math.round(totalActivityCount / limit);

    const response: ActivityApiResponse = {
        data: activitiesWithSupplier,
        meta: generatePageMeta(request.url, page, totalActivityCount, totalPage, limit)
    }

    return new Response(JSON.stringify(response), {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}