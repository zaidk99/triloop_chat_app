class TrieNode {
    constructor() {
        this.children = new Map();
        this.count = 0 ;
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode ();
    }

    insert(tokens){
        let node = this.root;
        for(const token of tokens){
            if(!node.children.has(token)){
                node.children.set(token,new TrieNode());
            }
            node = node.children.get(token);
            node.count++;
        }
        node.isEnd = true;
    }

    

    predict(tokens){
        let node = this.root;
        for(const token of tokens){
            if(!node.children.has(token)) return [];
            node = node.children.get(token);
        }

        const predictions  = [];
        for(const [word , childNode] of node.children){
            predictions.push({word ,count : childNode.count});
        }

        predictions.sort((a,b) => b.count - a.count);

        return predictions;

    }

    serialize(){
        const serializeNode = (node) =>{
            return {
                count:node.count,
                isEnd:node.isEnd,
                children:Array.from(node.children).map(([key , child])=> [
                    key,
                    serializeNode(child),
                ])
            };
        };

        return serializeNode(this.root);
    };

    static deserialize(data){
        const buildNode = (dataNode) => {
            const node = new TrieNode();
            node.count = dataNode.count;
            node.isEnd = dataNode.isEnd;

            for(const [key , childData] of dataNode.children){
                node.children.set(key,buildNode(childData));
            }
            return node;
        };
        const trie = new Trie();
        trie.root = buildNode(data);
        return trie;
    }

    merge(otherTrie) {
        const mergeNodes = (nodeA,nodeB) =>{
            nodeA.count += nodeB.count;
            nodeA.isEnd = nodeA.isEnd || nodeB.isEnd;

        for(const [key ,childB] of nodeB.children){
            if(!nodeA.children.has(key)){
            nodeA.children.set(key,new TrieNode());
            }
            mergeNodes(nodeA.children.get(key),childB);
        }
      };
      mergeNodes(this.root , otherTrie.root);
    };

}

export {Trie , TrieNode};