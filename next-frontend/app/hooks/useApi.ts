import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";

type Props = {
    axiosConfig?: AxiosRequestConfig;
    initCall?: boolean;
};

type TApi = (refetchAxiosConfig?: AxiosRequestConfig) => void;

function useApi({ axiosConfig = {}, initCall = true }: Props) {
    const [axiosResponse, setAxiosResponse] = useState<{
        loading: boolean;
        response: AxiosResponse | null;
        data: any;
        error: string;
    }>({
        loading: initCall,
        response: null,
        data: null,
        error: ""
    });

    const abortController = useRef<AbortController>();
    const api: TApi = (refetchAxiosConfig = undefined) => {
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();
        const config = refetchAxiosConfig || axiosConfig;
        setAxiosResponse({
            ...axiosResponse,
            loading: true,
            error: ""
        });

        axios
            .request({ signal: abortController.current?.signal, ...config })
            .then((response) => {
                setAxiosResponse({
                    loading: false,
                    response,
                    data: response?.data,
                    error: ""
                });
            })
            .catch((e) => {
                setAxiosResponse({
                    loading: e.message === "canceled",
                    response: e?.response,
                    data: null,
                    error: e.message === "canceled" ? "" : e.message
                });
            });
    };

    useEffect(() => {
        if (initCall && axiosConfig?.url) {
            api();
        }
    }, []);

    return { ...axiosResponse, refetch: api };
}

export default useApi;
