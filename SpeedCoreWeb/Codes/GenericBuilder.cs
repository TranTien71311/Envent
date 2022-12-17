using System;
using System.Collections.Generic;
using System.Linq;

namespace SpeedCoreWeb.Codes
{
    public abstract class GenericBuilder<TSubject, TSelf>
        where TSelf : GenericBuilder<TSubject, TSelf>
        where TSubject : new()
    {
        protected readonly List<Func<TSubject, TSubject>> Actions = new List<Func<TSubject, TSubject>>();

        public TSelf Do(Action<TSubject> action) => AddAction(action);

        public TSelf DoForemost(Action<TSubject> action) => AddAction(action, 0);
        
        public virtual TSubject Build() =>
            Actions.Aggregate(new TSubject(), (subject, action) => action(subject));
        
        private TSelf AddAction(Action<TSubject> action)
        {
            Actions.Add(s =>
            {
                action(s);
                return s;
            });
            return (TSelf) this;
        }

        private TSelf AddAction(Action<TSubject> action, int index)
        {
            Actions.Insert(index, s =>
            {
                action(s);
                return s;
            });
            return (TSelf) this;
        }
    }
}