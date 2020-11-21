window.todoStore = {
    todos: JSON.parse(localStorage.getItem('todo-store') || '[]'),

    save() {
        localStorage.setItem('todo-store',JSON.stringify(this.todos))
    }
}

window.todos = function() {
    return {
        ...todoStore,

        editedTodo: null,
        newTodo: '',
        filter: 'all',

        get active() {
            return this.todos.filter(todo => ! todo.completed)
        },

        get completed() {
            return this.todos.filter(todo => todo.completed)
        },

        get filteredTodos() {
            return {
                all: this.todos,
                active: this.active,
                completed: this.completed
            }[this.filter]
        },

        get allComplete() {
            return this.todos.length === this.completed.length
        },

        addTodo() {
            if(! this.newTodo) return

            this.todos.push({
                id: Date.now(),
                body: this.newTodo,    
                completed: false,
            })

            this.save()
            this.newTodo = ''
        },

        deleteTodo(todo) {
            let position = this.todos.indexOf(todo)
            this.todos.splice(position,1)
            
            this.save()
        },

        editTodo(todo) {
            todo.cachedBody = todo.body
            this.editedTodo = todo 
        },

        editComplete(todo) {
            if(todo.body.trim() === '') {
                this.editedTodo = null
                return this.deleteTodo(todo)
            }

            this.editedTodo = null
            delete todo.cachedBody

            this.save()
        },

        cancelEdit(todo) {
            todo.body = todo.cachedBody
            this.editedTodo = null 

            delete todo.cachedBody
        },

        clearCompleted() {
            this.todos = this.active
            this.save()
        },

        toggleAllTodos() {
            let allComplete = this.allComplete

            this.todos.forEach(todo => {
                todo.completed = ! allComplete
            })

            this.save()
        },
        
        toggleCompletion(todo) {
            todo.completed = ! todo.completed
            this.save()
        }
    }
}
