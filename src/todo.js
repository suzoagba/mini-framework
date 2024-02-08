import { CustomComponent, navigate } from "../framework/index.js";
function FilterLink(title, currentView) {
    const link = CustomComponent('a', {
        href: `/${title.toLowerCase()}`,
        "data-link": true,
        onclick: () => {
            currentView.set(title);
            navigate(`/${title.toLowerCase()}`);
        },
        class: () => currentView.get() === title ? "selected" : ""
    }, title);
    const listItem = CustomComponent('li', {}, link);
    currentView.subscribe(link);
    return listItem;
}

export function Filters(currentView) {
    const elem = CustomComponent('ul', {
        class: "filters"
    },
        FilterLink("All", currentView),
        FilterLink("Active", currentView),
        FilterLink("Completed", currentView),
    );

    return elem;
}

export function ToDoList(allTodos, currentView) {
    const todoList = CustomComponent('ul', {
        class: "todo-list"
    }, function () {
        const todos = allTodos.get()
        if (currentView.get() === "Active") {
            return todos.filter(todo => !todo.isDone).map(todo => todo.component)
        } else if (currentView.get() === "Completed") {
            return todos.filter(todo => todo.isDone).map(todo => todo.component)
        }
        else {
            return todos.map(todo => todo.component)
        }
    })
    currentView.subscribe(todoList)
    allTodos.subscribe(todoList)
    return todoList
}