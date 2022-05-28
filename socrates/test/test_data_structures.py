import unittest
import json
import sys ; sys.path.append('../') # path-setting hack
import data_structures as ds

class TestDataStructures(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        with ds.TEST_DATA_PATH.open() as f:
            cls.test_data = json.load(f)
        cls.nodes = ds.get_nodes(cls.test_data)
        cls.edges = ds.get_edges(cls.test_data)
        cls.socrates = cls.nodes[0]
        cls.therefore = cls.nodes[-1]
        cls.therefore_edge = cls.edges[-1]

    def test_load_lexicon(self):
        lexicon = ds.load_lexicon()
        self.assertEqual(type(lexicon), list)
        self.assertTrue(len(lexicon) > 0)
        self.assertEqual(type(lexicon[0]), dict)
        self.assertEqual(lexicon[0]['model'],  'graph.graph')
        self.assertEqual(
                set(['name', 'data', 'note']),
                set(lexicon[0]['fields'].keys())
            )

    def check_Node(self, node):
        self.assertTrue(type(node) == ds.Node)

    def check_Edge(self, edge):
        self.assertTrue(type(edge) == ds.Edge)

    def check_socrates(self, node):
        self.assertEqual(node.nid, '2fd4fc87-5ae4-4ddd-bb46-304fc36e415b')
        self.assertEqual(node.label, 'Socrates')
        self.assertEqual(node.level, 0)

    def check_therefore(self, edge):
        self.assertEqual(edge.nid, '2aed9889-a53a-48fa-b759-68e46497ab64')
        self.assertEqual(edge.label, 'therefore')
        self.assertEqual(edge.level, 3)

    def test_Node_from_dict(self):
        node = ds.Node.from_dict(self.socrates)
        self.check_Node(node)
        self.check_socrates(node)

    def test_Node_from_nid_and_json(self):
        node = ds.Node.from_nid_and_json(self.socrates[ds.ID], self.test_data)
        self.check_Node(node)
        self.check_socrates(node)

    def test_Edge_from_eid_and_json(self):
        edge = ds.Edge.from_eid_and_json(self.therefore_edge[ds.ID], self.test_data)
        self.check_Edge(edge)
        self.assertEqual(edge.eid, '2aed9889-a53a-48fa-b759-68e46497ab64')
        self.assertTrue(edge.directed)

        for node in edge.nodes:
            self.check_Node(node)

        self.check_therefore(edge.parent)

    def test_Tree(self):
        tree = ds.Tree.from_json(self.test_data)
        res = tree.parse()
        self.assertEqual(
                'Socrates is man and man is mortal therefore Socrates is mortal',
                ' '.join(n.label for n in res)
                )



if __name__ == '__main__':
    unittest.main()
