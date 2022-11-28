//! TODOLIST

/**
 * GET - получить данные
 * PATCH - частичное изменение
 * PUT - полная замена данных 
 * POST - добавление данных
 * DELETE - удаление данных
 * CRUD - Create(POST-request), Read(GET-request), Update(PUT/PATCH), Delete()
 */
// API - Application programming interface
//? npm i -g json-server

const API = "http://localhost:8000/todos"
let limit = 3;
let inpAdd = document.getElementById("input-add")
let btnAdd = document.getElementById("btn-add")
// console.log(inpAdd, btnAdd)
let inpSearch = document.getElementById("inp-search")



btnAdd.addEventListener("click", async ()=>{
    let newTodo = {
        todo: inpAdd.value,
    }
    console.log(newTodo)
    if(newTodo.todo.trim() === ""){
        alert("Заполните поле!")
        return
    }
    await fetch(API, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8"
        }
    })
    inpAdd.value = "";
    getTodos()
})
//! READ
//! Search

inpSearch.addEventListener("input", () => {
    // console.log("INPUT");
    getTodos()
})

// ! PAGINATION
let pagination = document.getElementById("pagination")
let page = 1;

let list = document.getElementById("list")
// console.log(list)
getTodos()
async function getTodos(){
   let response = await fetch(`${API}?q=${inpSearch.value}&_page=${page}&_limit=${limit}`).then((res) => res.json())
//    console.log(response);

let allTodos = await fetch(API).then((res) => res.json()).catch((e) => console.log(e))

let lastPage = Math.ceil(allTodos.length / 2)
console.log(lastPage)

list.innerHTML = ""
response.forEach((item) => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `
    <span>${item.todo}</span>
    <button class="btn-delete">Delete</button>
    <button class="btn-edit">Edit</button>
    `;
    // console.log(newElem)
    list.append(newElem)
})
// добавляем пагинацию
pagination.innerHTML = `
<button ${page === 1 ? "disabled" : ""} id="btn-prev">Назад</button>
<span>${page}</span>
<button ${page === lastPage ? "disabled" : ""} id="btn-next">Вперед</button>
`
}
document.addEventListener("click", async (e) => {
    if(e.target.className === "btn-delete"){
        let id = e.target.parentNode.id
        await fetch(`${API}/${id}`,{
            method: "DELETE",
        })
        getTodos()
    }
    //! update
    if(e.target.className === "btn-edit"){
        modalEdit.style.display = "flex";
        let id = e.target.parentNode.id;
        
        let response = await fetch(`${API}/${id}`).then((res) => res.json()).catch((err) => console.log(err))
        // console.log(response);
        inpEditTodo.value = response.todo;
        inpEditTodo.className = response.id;
    }
//! paginate
    if(e.target.id === "btn-next"){
        page++
        getTodos()
    }
    if(e.target.id === "btn-prev"){
        page--
        getTodos()
    }
})

let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close")
let inpEditTodo = document.getElementById("inp-edit-todo")
let btnSaveEdit = document.getElementById("btn-save-edit")
// console.log(modalEdit, modalEditClose, inpEditTodo, btnSaveEdit)

btnSaveEdit.addEventListener("click", async ()=>{
    let editedTodo = {
        todo: inpEditTodo.value,
    }
    let id = inpEditTodo.className
    await fetch(`${API}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editedTodo),
        headers: {
            "Content-type": "application/json; charset=utf-8" 
        }
    })
    modalEdit.style.display = "none"
    getTodos()
})
modalEditClose.addEventListener("click", function(){
    modalEdit.style.display ="none";
})

