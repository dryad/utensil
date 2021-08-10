import _ from "lodash";
import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";

import { Graph } from "models";
import axios from "libs/axios";
import VisCustomNetwork from "libs/vis-custom-network";
import VisNetwork from "./VisNetwork";
import GraphList from "./GraphList";

function App() {
  const networkRef = useRef<VisCustomNetwork | null>(null);

  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [graph, setGraph] = useState<Graph | null>(null);
  const [graphName, setGraphName] = useState("");
  const [graphNote, setGraphNote] = useState("");

  const refreshList = async () => {
    const { data } = await axios.get("/api/graphs/");
    setGraphs(data);
  };

  const handleGraphSelected = (id: any) => {
    const graph = graphs?.find((g: any) => g.id === id);
    if (graph !== null) {
      setGraph(graph);
      const data = JSON.parse(graph?.data);
      networkRef.current?.setData(data);
    }
  };

  const handleGraphDelete = async (id: any) => {
    await axios.delete(`/api/graphs/${id}/`);
    await refreshList();
  };

  const handleSave = async () => {
    // const clone = _.cloneDeepWith(networkRef.current?.network, (x: any) => {
    //   return x;
    // });
    // const edges = clone.body.data.edges.get();
    // const nodes = clone.body.data.nodes.get();

    const edges = networkRef.current?.edges.get();
    const nodes = networkRef.current?.nodes.get();
    const positions = networkRef.current?.network.getPositions();

    for (const node of nodes) {
      node.x = positions[node.id].x;
      node.y = positions[node.id].y;
    }

    console.log(nodes);

    await axios.post("/api/graphs/", {
      name: graphName,
      note: graphNote,
      data: JSON.stringify({ edges, nodes }),
    });

    await refreshList();
  };

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <Container>
      <Grid container>
        <Grid item xs={9}>
          <Paper>
            <VisNetwork ref={networkRef} />
            <Box m={1}>
              <TextField
                id="outlined-basic"
                label="Graph Name"
                variant="outlined"
                size="small"
                value={graphName}
                onChange={(e: any) => setGraphName(e.target.value)}
                fullWidth
              />
            </Box>
            <Box m={1}>
              <TextField
                id="outlined-basic"
                label="Note"
                multiline
                rows={4}
                variant="outlined"
                size="small"
                value={graphNote}
                onChange={(e: any) => setGraphNote(e.target.value)}
                fullWidth
              />
            </Box>
            <Box>
              <Button variant="outlined" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <GraphList
            graphs={graphs}
            onGraphSelected={handleGraphSelected}
            onGraphDelete={handleGraphDelete}
          />
          {graph && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="h2">
                  Note
                </Typography>
                <Typography variant="body2" component="p">
                  {graph.note}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
