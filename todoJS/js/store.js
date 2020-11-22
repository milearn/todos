(function(context){
    
    function Store(key){
        this.key = key;
        this.setStore([]);
    };
    Store.fn = Store.prototype;
    Store.fn.addTodo = function(item, cb){
        if(!item){
            return;
        }
        
        item.id = this.generateId();
        const updatedTodos = this.getAllTodos()
        updatedTodos.push(item);
        this.syncStore(updatedTodos);
        if(typeof cb === 'function') {
            cb(item);
        }
    }
    Store.fn.deleteTodo = function(id, cb) {
        if(!id) {
            return;
        }
        const updatedTodos = this.store.filter((todo) => todo.id !== id);
        this.syncStore(updatedTodos);
        if(typeof cb === 'function') {
            cb(id);
        }

    }
    Store.fn.getAllTodos = function(cb){
        return this.store.slice(0);
    }
    Store.fn.markCompleted = function(id, cb) {
        let item = undefined;
        const todos = this.store.map(function(todo){
            if(todo.id === id) {
                item = todo;
                todo.completed = !todo.completed;
            }
            return todo;
        })
        this.syncStore(todos);
        if(typeof cb === 'function') {
            cb(item.completed);
        }
    }
    Store.fn.syncStore = function(store) {
        window.localStorage.setItem(this.key, JSON.stringify(store));
        this.setStore();
    }
    Store.fn.setStore = function(store) {
        this.store = parseStorage(window.localStorage.getItem(this.key) || JSON.stringify(store));
    }
    Store.fn.generateId = function() {
        return "todo" + new Date().getTime();
    }
    context.Store = Store;
})(this)