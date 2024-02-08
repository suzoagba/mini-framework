export function CustomComponent(tag, attributes, ...children) {
    const newComponent = new CustomComponentClass(tag, attributes, children)
    return newComponent;
}

class CustomComponentClass {
    tag = null
    attributes = {}
    children = null
    element = null
    customId = null

    constructor(tag, attributes, children) {
        this.tag = tag
        this.attributes = attributes
        this.children = children
        this.element = this.createCustomElement()
        this.customId = this.generateCustomID()
    }

    generateCustomID() {
        return crypto.randomUUID()
    }
    getCustomId() {
        return this.customId
    }

    refreshCustomElement() {
        const newElement = this.createCustomElement()
        replaceElementWithNew(this.element, newElement)
        this.element = newElement
    }

    createCustomElement() {
        const customElement = document.createElement(this.tag);
        for (let [key, value] of Object.entries(this.attributes)) {
            if (key.startsWith('on') && typeof value === 'function') {
                customElement[key] = value;
            } else {
                if (typeof value === "function") {
                    value = value()
                }
                customElement.setAttribute(key, value);
            }
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
    
            if (typeof child === 'function') {
                const result = child();
                if (typeof result === "string") {
                    customElement.appendChild(document.createTextNode(result));
                } else {
                    if (result instanceof CustomComponentClass) {
                        customElement.appendChild(result.getCustomElement());
                    } else if (Array.isArray(result)) {
                        for (let item of result) {
                            if (item instanceof CustomComponentClass) {
                                customElement.appendChild(item.getCustomElement());
                            }
                        }
                    } else {
                        if (result) {
                            customElement.appendChild(result.getCustomElement());
                        }
                    }
                }
            } else if (typeof child === 'string') {
                customElement.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                customElement.appendChild(child);
            } else if (child instanceof CustomComponentClass) {
                customElement.appendChild(child.getCustomElement());
            } else if (typeof child === 'object') {
                customElement.appendChild(child.getCustomElement());
            }
        }
        return customElement;
    }

    getCustomElement() {
        return this.element
    }

    destroyCustomElement() {
        this.element.remove()
    }
}

function replaceElementWithNew(oldElement, newElement) {
    oldElement.replaceWith(newElement)
}

export function getCustomElement(component) {
    return component.getCustomElement()
}
export function createState(initialValue) {
    let value = initialValue;
    const subscribedComponents = [];

    const get = () => value;

    const getter = () => () => value;

    const set = (newValue) => {
        value = newValue;
        subscribedComponents.forEach(component => {
            component.refreshCustomElement();
        });
    };

    const subscribe = (component) => {
        subscribedComponents.push(component);
    };

    return {
        get,
        getter,
        set,
        subscribe
    };
}

export function useState(initialValue) {
    const state = createState(initialValue);
    return [state.getter(), state.set, state.subscribe];
}


function createFramework() {
    const routes = {};

    function navigate(path) {
        history.pushState({}, "", path);
        render(path);
    }

    function Css(path) {
        const addedLink = document.createElement("link");
        addedLink.rel = 'stylesheet';
        addedLink.type = 'text/css';
        addedLink.href = path;
        document.head.append(addedLink);
        document.head.insertBefore(addedLink, document.head.firstChild);
    }

    function registerRoute(pathname, view) {
        routes[pathname] = view;
    }

    function render(path) {
        const existing = routes[path];
        if (existing) {
            document.body.innerHTML = "";
            document.body.append(getCustomElement(existing()));
        }
    }

    function init() {
        document.addEventListener("DOMContentLoaded", () => render(location.pathname));
        addEventListener("popstate", () => render(location.pathname));
        document.addEventListener('click', (event) => {
            if (event.target.matches("[data-link]")) {
                event.preventDefault();
                const href = event.target.getAttribute('href');
                navigate(href);
            }
        });
    }

    return {
        navigate,
        Css,
        registerRoute,
        render,
        init
    };
}

function createRoute(pathname, view) {
    return {
        pathname,
        view
    };
}

const { navigate, Css, registerRoute, render, init } = createFramework();
const createCustomElement = getCustomElement;

export {
    createRoute,
    navigate,
    Css,
    registerRoute,
    render,
    init,
    createCustomElement
};