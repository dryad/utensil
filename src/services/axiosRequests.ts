import axios from "libs/axios";

type DataProps = {
    id?: number | null;
    name: string;
    note: string;
    data: string;
    creator: string;
    private: string; 
}

export async function saveGraph (data: DataProps) {
    const response = await axios.post("/api/graphs/", {
        id: data.id, //id is sent along with the graph, so we can update the graph in the database, rather than create new.
        name: data.name, 
        note: data.note,
        data: data.data,
        creator: data.creator,
        private: data.private,
      }).then((res: any) => {
            return res
        });
    
    return response;    
}

export async function getAllGraphs (metaMaskAccount: string) {
    const data = await axios.get(`/api/graphs/${metaMaskAccount ? `?private=${metaMaskAccount}` : ''}`)
        .then((res: any) => {
            return res
        });
    return data;
  };

export async function deleteGraph(id: number) {
    const response = await axios.delete(`/api/graphs/${id}/`)
        .then((res: any) => {
            return res
        });
    return response;    
}


