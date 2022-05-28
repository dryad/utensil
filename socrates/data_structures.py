#Module to standardize data structure formats and translate between them

import json
import numpy as np
import typing as tp
from pathlib import Path
from dataclasses import dataclass

CURRENT_PATH = Path('.').absolute()
LEXICON_PATH = CURRENT_PATH.parent / 'lexicon/graphs.json'
TEST_DATA_PATH = CURRENT_PATH / 'test/test_data.json'

FIELDS = 'fields'
DATA = 'data'
NAME = 'name'
EDGES = 'edges'
NODES = 'nodes'
LABEL = 'label'
LEVEL = 'level'
DIRECTED = 'directed'
ID = 'id'
EDGE_ID = 'to'
LEFT_CHILD = 'from'
RIGHT_CHILD = 'eventual'
IS_LABEL_NODE = 'isLabelNode'


def load_lexicon():
    with LEXICON_PATH.open() as f:
        lexicon = json.load(f)
    return lexicon

def json_to_adjacency_matrix(lex):
    ...



def get_lexeme(json_data: str):
    return json.loads(json_data[FIELDS][DATA])

def get_nodes(json_data: str):
    return [n for n in get_lexeme(json_data)[NODES] if not n.get(IS_LABEL_NODE, False)]

def get_label_nodes(json_data: str):
    return [n for n in get_lexeme(json_data)[NODES] if n.get(IS_LABEL_NODE, False)]

def get_edges(json_data: str):
    return get_lexeme(json_data)[EDGES]

def Nodes_from_json(json_data: str):
     Nodes = [Node.from_nid_and_json(n[ID], json_data) for n in get_nodes(json_data)]
     return Nodes

def Edges_from_json(json_data: str):
     Edges = [Edge.from_eid_and_json(e[ID], json_data) for e in get_edges(json_data)]
     return Edges

@dataclass
class Edge():
    '''
    A namedtuple-like container with some extra abilities
    '''
    eid: str
    directed: bool
    parent: 'Node'
    left_child: 'Node'
    right_child: 'Node'

    @property
    def nodes(self):
        return (self.left_child, self.parent, self.right_child)

    @staticmethod
    def from_eid_and_json(eid: str, json_data: str):
        edges = get_edges(json_data)
        edge = [e for e in edges if e[ID] == eid]
        assert not len(edge) > 1, (f'Non-unique edges found with id {eid}')
        assert not len(edge) < 1, (f'No edges found with id {eid}')
        edge = edge[0]

        left_child = Node.from_nid_and_json(edge[LEFT_CHILD], json_data)
        right_child = Node.from_nid_and_json(edge[RIGHT_CHILD], json_data)
        parent = Node.from_nid_and_json(edge[EDGE_ID], json_data)

        return Edge(
                edge[EDGE_ID],
                edge[DIRECTED],
                parent,
                left_child,
                right_child)


@dataclass
class Node:
    '''
    A namedtuple-like container with some extra abilities
    '''
    nid: str
    level: int
    label: str


    @staticmethod
    def from_nid_and_json(nid: str, json_data: str):
        node_list = [n for n in get_nodes(json_data) if n[ID] == nid]
        try:
            assert len(node_list) == 1, (f'Non-unique nodes found with id {nid}')
        except:
            breakpoint()

        return Node.from_dict(node_list[0])


    @staticmethod
    def from_dict(node: dict):
        nid = node[ID]
        level = node[LEVEL]
        label = node[LABEL]
        return Node(nid, level, label)


    def is_leaf(self):
        return self.level == 0


# @dataclass
class Tree:
    '''
    A finite binary rooted labeled planar tree
    A named-tuple like container of Nodes and Edges with some extra abilities
    '''

    def __init__(
            self,
            nodes: tp.Iterable['node'],
            edges: tp.Iterable['Edge']
            ):

        self.nodes = nodes
        self.edges = edges

        self.id_to_node = {n.nid : n for n in nodes}
        self.id_to_edge = {e.eid : e for e in edges}


    @staticmethod
    def from_json(json_data: str):
        nodes = Nodes_from_json(json_data)
        edges = Edges_from_json(json_data)
        return Tree(nodes, edges)

    def get_left_child(self, node):
        return self.id_to_node[self.id_to_edge[node.nid].left_child.nid]
        # return self.id_to_node[self.id_to_edge[node.nid][LEFT_CHILD]]

    def get_right_child(self, node):
        return self.id_to_node[self.id_to_edge[node.nid].right_child.nid]
        # return self.id_to_node[self.id_to_edge[node.nid][RIGHT_CHILD]]

    def _inorder_traversal(self, current_node, tree_list):
        if current_node.level > 0:
          tree_list = self._inorder_traversal(self.get_left_child(current_node), tree_list)
          tree_list.append(current_node)
          tree_list = self._inorder_traversal(self.get_right_child(current_node), tree_list)
        else:
          tree_list.append(current_node)

        return tree_list

    # selects the highest edge that has not yet been parsed
    def _get_start_node(self, traversed: list):
        difference = [x for x in self.nodes if x not in traversed]
        difference.sort(key= lambda x: x.level, reverse=True)
        return difference[0]

    def parse(self):

        assert len(self.nodes) > 0, ('Cannot parse an empty Tree')
        traversed = []
        for i in range(len(self.nodes)): # avoid while loop
            trees = []
            start_node = self._get_start_node(traversed)

            res = self._inorder_traversal(start_node, trees)

            traversed.extend(res) #inplace mutation
            if len(traversed) == len(self.nodes):
                break

            return res




  # var parseList = [];
  # if (to_traverse.length > 0) {
  #   var traversedSet = new Set();

  #   for (let i = 0; i < to_traverse.length; i++) { // avoid while loop
  #     var treeList = [];
  #     const startNode = getStartNode(traversedSet);

  #     const res = inOrderTraversal(startNode, treeList);
  #     parseList.push({ 'nodes': res });
  #     res.forEach(item => traversedSet.add(item))

  #     if (traversedSet.size == to_traverse.length) {
  #       break
  #     };
  #     // console.log('i', i+1); // the number of roots / highest edges
  #   }
  # };
class Forest:
    '''
    A Forest is a collection of Trees
    '''

    ...

class ThoughtForm:
    '''
    '''

    directed: bool
    note: str
    name: str
    left_child: 'ThoughtForm' = None
    right_child: 'ThoughtForm' = None

    # _raw_dict: dict
    def __init__(
            self,
            arrays: tp.Iterable[np.array],
            mapping: dict = {}):

        self.structure = arrays
        self.labels = [self.map_array(arr, mapping) for arr in arrays]
        self._mapping = mapping

        #properties of the representation
        self.rank = len(arrays)


        name = lex[FIELDS][NAME]
        note = lex[FIELDS][NOTE]
        nodes = get_nodes(lex)
        edges = get_edges(lex)

    def __getitem__(self, idx: int) -> np.array:
        return self.structure[idx]


    @staticmethod
    def map_array(array: np.array, mapping: dict) -> np.array:
        '''map all array elements to dict values, assumes no missing keys
        '''
        # breakpoint()
        copy = array.copy()
        if not all(type(k)==type(v) for k,v in mapping.items()):
            copy = copy.astype(object)

        for key, value in mapping.items():
            try:
                copy[array == key] = value
            except:
                breakpoint()
        return copy


    def gen_columns(self):
        '''list of columns from left to right, top element first
                Tree interpreatation: from left to right of branches from root to leaf
        '''
        for array in self.structure:
            for column_idx in range(array.shape[1]):
                yield array[:, column_idx].tolist()

