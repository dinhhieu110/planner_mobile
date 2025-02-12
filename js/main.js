import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

// Launch app
console.log("hello")

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
})

const initApp = () => {
    // Add listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    itemEntryForm.addEventListener("submit", (event) => {
        event.preventDefault();
        processSubmission();
    })

    const clearButtonElement = document.getElementById("clearItem");
    clearButtonElement.addEventListener("click", (event => {
        processClearAll();
    }))

    // Procedural
    // Load list items
    refreshPage();
}

const refreshPage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    console.log("parent: ", parentElement)
    deleteContents(parentElement);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    console.log("child:", child)
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList();
    list.forEach((item) => {
        buildListItem(item);
    })
}

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckBox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div)
}

const addClickListenerToCheckBox = (checkbox) => {
    checkbox.addEventListener("click", (event) => {
        toDoList.removeItem(checkbox.id);
        // TODO: remove from persistent data
        setTimeout(() => {
            refreshPage();
        }, 1000)
    })
}

const clearItemEntryField = () => {
    document.getElementById("newItem").value = "";
};
const setFocusOnItemEntry = () => {
    document.getElementById("newItem").focus();
};

const processSubmission = () => {
    const newEntryText = getNewEntry();
    console.log(newEntryText.length)
    if (!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const todoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItem(todoItem);

    // TODO: update persistent data
    refreshPage();
}

const processClearAll = () => {
    // for (let i = 0; i < toDoList.length; i++) {
    //     toDoList.removeItem(toDoList[i].getId());
    // }
    // refreshPage();
    const list = toDoList.getList();
    if (list.length) {
        const confirmed = confirm("Are you sure you want to clear the entire list?")
        if (confirmed) {
            toDoList.clearList();
            // TODO: Update persistent data
            refreshPage();
        }
    }

    console.log("todoList: ", toDoList.getList())
}

const getNewEntry = () => {
    return document.getElementById("newItem").value.trim();
}

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

const createNewItem = (itemId, itemText) => {
    const todo = new ToDoItem();
    todo.setId(itemId);
    todo.setItem(itemText);
    return todo;
}