using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SpeedCoreWeb.Codes
{
    public class TreeNode<T>
    {
        #region Properties

        [JsonIgnore]
        public TreeNode<T> Parent { get; set; }
        
        public LinkedList<TreeNode<T>> Children { get; set; }
        
        public T Data { get; set; }

        #endregion
        
        public TreeNode(T data)
        {
            Data = data;
            Children = new LinkedList<TreeNode<T>>();
        }

        public void AddChild(TreeNode<T> child)
        {
            if (child.Parent != null)
            {
                throw new ArgumentException("TreeNode: Child already has a parent");
            }
            Children.AddLast(child);
            child.Parent = this;
        }

        public void AddParent(TreeNode<T> parent)
        {
            parent.AddChild(this);
        }

        public TResult TraverseNLR<TResult>(TResult accumulate, Func<TResult, TreeNode<T>, TResult> visitAction)
        {
            TResult result = visitAction(accumulate, this);
            foreach (TreeNode<T> treeChild in Children)
            {
                result = treeChild.TraverseNLR(result, visitAction);
            }
            return result;
        }
    }
}