import Supplier from "./Supplier";

export interface ISupplierDetail {
    _id: string;
    id: number;
    name: string;
    address: string;
    zip: string;
    city: string;
    country: string;
}

export const getSuppliers = async () => {
    const suppliers = Supplier
        .find()

    return suppliers.exec();
}