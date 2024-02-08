import { Filters, ToDoList } from "./todo.js";
import { CustomComponent, createState, Css, init, registerRoute } from "../framework/index.js";
Css("src/styles.css")

let index = 0 //for counting the id of todos

const allTodos = createState([]) //ToDo objects
const currentView = createState("All")

//Class to hold info about the todo
class ToDo {
    isDone = false
    component = null //Component class
    constructor(isDone, component) {
        this.isDone = isDone
        this.component = component
    }
    setDone(isDone) {
        this.isDone = isDone
    }
    getDone() {
        return this.isDone
    }
}


function Home() {
    //Create a todo based on the title
    function createToDo(title) {
        index++
        const editMode = createState(false) //whether edit mode is active
        const completed = createState(false) //whether its marked as completed
        const titleState = createState(title) //title, needed for editing
        const EditElem = CustomComponent('input', {
            id: "edit", class: "edit", value: titleState.get(), onload: function (event) {
                event.target.focus()
            }, onkeyup: function (event) {
                titleState.set(event.target.value)
            }
        })
        const LabelElem = CustomComponent('label', {
            ondblclick: function () {
                editMode.set(!editMode.get())
            },
        }, titleState.getter())
        document.addEventListener("click", function (event) {
            if (editMode.get() && !EditElem.element.contains(event.target)) {
                editMode.set(false)
            }
        })
        const Container = CustomComponent('div', {
            class: "view"
        },
            CustomComponent('input', {
                class: "toggle",
                type: "checkbox",
                id: `todo-${index}`,
                onchange: function (e) {
                    const existing = allTodos.get().find(i => i.component.attributes.id === e.target.id)
                    existing.setDone(!existing.getDone())
                    completed.set(!completed.get())
                    allTodos.set(allTodos.get())
                }
            }),
            LabelElem,
            CustomComponent('button', {
                class: "destroy",
                id: `todo-${index}`,
                onclick: function (e) {
                    const currentArray = allTodos.get()
                    const newArray = currentArray.filter(i => i.component.attributes.id !== e.target.id)
                    allTodos.set(newArray)
                }
            }))
        const ListItem = CustomComponent('li', {
            id: `todo-${index}`,
            class: () => `${editMode.get() ? "editing " : ""}${completed.get() ? "completed" : ""}`
        }, Container, () => editMode.get() ? EditElem : null
        )
        editMode.subscribe(ListItem)
        completed.subscribe(ListItem)
        titleState.subscribe(LabelElem)
        return ListItem
    }
    const Counter = CustomComponent('span', {
        class: "todo-count"
    }, function () {
        const todos = allTodos.get()
        const filtered = todos.filter(item => !item.isDone)
        const count = filtered.length
        return `${count} items left`
    })
    const FooterElem = CustomComponent('footer', {
        class: "footer"
    },
        Counter,
        () => Filters(currentView),
        () => {
            return allTodos.get().filter(item => item.isDone).length > 0 ?
                CustomComponent('button', {
                    class: "clear-completed",
                    onclick: function () {
                        const todos = allTodos.get()
                        const newArray = todos.filter(todo => !todo.isDone)
                        allTodos.set(newArray)
                    }
                }, "Clear Completed") : null
        }
    )
    const Section = CustomComponent('section', {
        class: "todoapp"
    },
        CustomComponent('header', {
            class: "header"
        },
            CustomComponent('h1', {}, "Todos"),
            CustomComponent('p', { class: 'to-edit' }, "To edit a todo, double-click!"),
            CustomComponent('input', {
                class: "new-todo",
                placeholder: "New Task!!!",
                autofocus: true,
                id: 'new-todo',
                onkeydown: function (event) {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        if (event.target.value.length !== 0) {
                            const newElem = createToDo(event.target.value)
                            const newTodo = new ToDo(false, newElem)
                            const currentArray = allTodos.get()
                            currentArray.push(newTodo)
                            allTodos.set(currentArray)
                            event.target.value = ""
                        }
                    }
                }
            })
        ),
        CustomComponent('section', {
            class: "main"
        },
            CustomComponent('input', {
                id: "toggle-all",
                class: "toggle-all",
                type: "checkbox",
                onchange: function () {
                    const todos = allTodos.get()
                    todos.map(item => item.isDone = true)
                    allTodos.set(todos)
                }
            }),
            CustomComponent('label', {
                for: "toggle-all"
            }, "Mark all as complete"),
            () => ToDoList(allTodos, currentView)
        ),
        () => allTodos.get().length > 0 ? FooterElem : null
    )
    const MainApp = CustomComponent('div', {
        id: "app",
    }, Section, CustomComponent('footer', {
        class: "info"
    }, CustomComponent('p', {
        class: "author"
    }, "Authored by ", CustomComponent('a', {
        href: "https://01.kood.tech/git/suzoagba"
    }, "Samuel Uzoagba")),
    )
    )
    allTodos.subscribe(Counter)
    allTodos.subscribe(FooterElem)
    allTodos.subscribe(Section)
    return MainApp
}

registerRoute("/", Home)

init()
