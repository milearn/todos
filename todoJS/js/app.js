(function(context){
    const ENTER_KEY = 13;
    function App(storageKey) {
        this.store = new Store(storageKey);
        this.todoState = this.store.store;
        
        this.$input = $.qs('.todos-input');
        this.$todosWrapper = $.qs('.todos-list');
        this.$todosFilters = $.qs('.todos-filters');

        this.attachListeners();
        this.render();
    }
    App.fn = App.prototype;
    App.fn.attachListeners = function(){
        $.on(this.$input, 'keypress', this.addTodo.bind(this));
        $.delegate(this.$todosWrapper, '.todo-delete', 'click', this.deleteTodo.bind(this))
        $.delegate(this.$todosWrapper, '.todo-is-completed', 'click', this.markCompleted.bind(this))
        $.on(this.$todosFilters, 'click', this.applyFilter.bind(this));
    }
    App.fn.render = function() {
        
        const todosNode = this.todoState.map((item) => {
            return getTodoHTML(item)
        })
        this.$todosWrapper.innerHTML = todosNode.join("\n");
    }
    App.fn.addTodo = function(event) {
        if(event.keyCode !== ENTER_KEY){
            return;
        }
        
        const text = event.target.value.trim();
        if(!text) {
            return;
        }
        const item = {
            text: event.target.value.trim(),
            completed: false
        }
        this.store.addTodo(item, function(item) {
            event.target.value = '';
            this.$todosWrapper.innerHTML += getTodoHTML(item);

        }.bind(this));
    }
    App.fn.deleteTodo = function(event) {
        const todoId = this.getTodoId(event.target);
        this.store.deleteTodo(todoId, function(id) {
            const todo = $.qs('#'+id);
            this.$todosWrapper.removeChild(todo);
        }.bind(this));
    }
    App.fn.markCompleted = function(event) {
        const todoId = this.getTodoId(event.target);
        this.store.markCompleted(todoId, (function(value){
            event.target.setAttribute('checked', value)
            const todoNode = $.parent(event.target, 'li');
            todoNode.classList.toggle('completed')
        }).bind(this));
    }
    App.fn.getTodoId = function(target) {
        const li =  $.parent(target, 'li');
        return li.getAttribute('id');
    }
    function getTodoHTML(item) {

        const html = [
            "<li class=\'todo-list-item" + (item.completed? " completed\'": "\'") + "id=" + item.id + " >",
            "<input type=\'checkbox\' class=\'todo-is-completed\'" + (item.completed? "checked": "") + "/>",
            "<span class=\'todo-text\'>",
            item.text,
            "</span>",
            "<button class=\'todo-delete\'>X</button>",
            "</li>"
        ].join("\n")
        return html

    }
    App.fn.getFilteredTodoState = function(type) {
        switch(type) {
            case 'ALL':
                return this.todoState;
            case 'ACTIVE':
                return this.todoState.filter((function(todo){
                    return !todo.completed
                }).bind(this));
            case 'COMPLETED':
                return this.todoState.filter((function(todo){
                    return todo.completed
                }).bind(this));
        }
    }
    App.fn.applyFilter = function(event) {
        const filterType = event.target.getAttribute('id');
        this.todoState = this.getFilteredTodoState(filterType);
        this.render();
        this.resetTodoState();
    }
    App.fn.resetTodoState = function() {
        this.todoState = this.store.store;
    }
    document.addEventListener('DOMContentLoaded', function(){
        new App('todos');
    })
})(this);