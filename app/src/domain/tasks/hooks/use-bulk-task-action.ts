import { routes } from "@/constants/routes";
import axios from "axios";
import useSWRMutation from "swr/mutation";


const bulkDelete = async (_: string, { arg }: { arg: string[] }) => {
    await axios.delete(routes.api.tasks.index, {
        data: { ids: arg },
    }).then(res => res.data);
}

export const useBulkTaskAction = (ids: string[], onUpdate: () => void) => {
    const { trigger: bulkDeleteTrigger } = useSWRMutation(ids.length > 0 ? routes.api.tasks.index : null, bulkDelete, {
        onSuccess: () => {
            onUpdate();
        },
    })

    return {
        bulkDelete: () => bulkDeleteTrigger(ids),
    }
}