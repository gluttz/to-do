import elem from "../functions/elem";
import controllerModule from "../index.js";

const formPopup = (task) => {
    console.log("pop")
    if(!task){
        firstOpen();

        const toDoButton = document.querySelector("#toDoButton");
        const projectButton = document.querySelector("#projectButton");
        const notesButton = document.querySelector("#notesButton");
        

        toDoButton.addEventListener('click', () => {
            renderForm();
            toDoForm();
        });
        projectButton.addEventListener('click', () => {
            renderForm();
            projectForm();
        });
        notesButton.addEventListener('click', () => {
            renderForm();
            noteForm();
        });
    }
    if(task){
        editForm(task);
    }
}

const editForm = (task) => {
    const contentContainer = document.querySelector('#content');
    contentContainer.appendChild(elem({prop: "div", id: "formPopupContainer", children: [
        elem({prop: "div", id: "formDiv"})
    ]}))
    toDoForm(task);
}   

const firstOpen = () => {
    
    const contentContainer = document.querySelector('#content');

    contentContainer.appendChild(elem({prop: "div", id: "formPopupContainer", children: [
        {prop: "div", id: "formContainer", children: [
            {prop: "div", id: "formHeader", children: [
                {prop: "h2", textContent: "Create a new..."},
                {prop: "button", id: "closeButton", textContent: "X", type: "button"}
            ]},
            {prop: "div", id: "formNav", children: [
                {prop: "ul", children: [
                   {prop: "li", textContent: "To Do", id: "toDoButton"},
                    {prop: "li", textContent: "Project", id: "projectButton"},
                    {prop: "li", textContent: "Notes", id: "notesButton"}
                ]}
            ]}, 
            {prop: "div", id: "formDiv"}
        ]}
    ]}, 2))
    
    toDoForm();
}

const toDoForm = (task) => {

    const formDiv = document.querySelector("#formDiv");
    if(!task){
        const toDoButton = document.querySelector("#toDoButton");
        toDoButton.classList.add("selected");
    }
    formDiv.appendChild(elem({prop: "form", id: "form", children: [
        elem({prop: "div", children: [
            elem({prop: "label", for: "title", textContent: "Title"}),
            elem({prop: "input", type: "text", id: "title", name: "title", placeholder: "Title", required: "true"})
        ]}),
        elem({prop: "div", id: "formDetails", children: [
            elem({prop: "label", for: "toDoDetails", textContent: "Details"}),
            elem({prop: "textarea", id: "toDoDetails", name: "details", placeholder: "Details", spellcheck: "false"})
        ]}),
        elem({prop: "div", children: [
            elem({prop: "label", for: "dueDate", textContent: "Due Date"}),
            elem({prop: "input", type: "date", id: "dueDate", name: "dueDate", required: "true"})
        ]}),
        elem({prop: "div", id: "formFooter", children: [
            elem({prop: "fieldset", children: [
                elem({prop: "legend", textContent: "Priority"}),
                elem({prop: "label", for: "low", textContent: "Low", className: "radio", children: [
                    elem({prop: "input", type: "radio", name: "priority", id: "low", value: "low", required: "true"})
                ]}),
                elem({prop: "label", for: "medium", textContent: "Medium", className: "radio", children: [
                    elem({prop: "input", type: "radio", name: "priority", id: "medium", value: "medium", required: "true"})
                ]}),
                elem({prop: "label", for: "high", textContent: "High", className: "radio", children: [
                    elem({prop: "input", type: "radio", name: "priority", id: "high", value: "high", required: "true"})
                ]})
            ]}),
            elem({prop: "button", type: "submit", textContent: "Submit", id: "submitButton"})
        ]})
    ]}))
    
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    function changeSelected(){
        radioButtons.forEach((button) => {
            button.parentElement.classList.remove('checked');
        })
        this.parentElement.classList.add('checked');
    }

    radioButtons.forEach((button) => {
        button.addEventListener('click', changeSelected)
    })
    if(task){
        formDiv.insertBefore(elem({prop: "div", textContent: "X", id: "closeButton"}), formDiv.firstChild);
        
        const titleField = document.querySelector('#title');
        const detailsField = document.querySelector('#toDoDetails');
        const dateField = document.querySelector('#dueDate');
        const priorityLow = document.querySelector('#low')
        const priorityMed = document.querySelector('#medium')
        const priorityHigh = document.querySelector('#high')

        titleField.value = task.title;
        detailsField.value = task.details;
        dateField.value = task.date;
        console.log(task.date);
        if(task.priority == 0){
            console.log(priorityLow)
            priorityLow.checked = true;
            priorityLow.parentElement.classList.add('checked')
        }
        if(task.priority == 1){
            priorityMed.checked = true;
            priorityMed.parentElement.classList.add('checked')
        }
        if(task.priority == 2){
            priorityHigh.checked = true;
            priorityHigh.parentElement.classList.add('checked')
        }
    }
    let submitButton = document.querySelector("#submitButton");
        const form = document.querySelector('#form');
        submitButton.addEventListener('click', (e) => {
            let isFormValid = form.checkValidity();
            if(!isFormValid){
                form.reportValidity();
            }else{
                e.preventDefault();
                controllerModule.onFormSubmit();
            }
        });
}

const projectForm = () => {
    
    const formDiv = document.querySelector("#formDiv");
    const projectButton = document.querySelector("#projectButton");

    projectButton.classList.add("selected");

    formDiv.appendChild(elem({prop: "form", id: "form", className: "projectForm",children: [
        elem({prop: "div", children: [
            elem({prop: "label", for: "title", textContent: "Project Title"}),
            elem({prop: "input", type: "text", id: "title", name: "projectTitle", placeholder: "Project Name", required: true})
        ]}),
        elem({prop: "button", type: "submit", textContent: "CREATE PROJECT", id: "submitButton"})
    ]}));
    let submitButton = document.querySelector("#submitButton");
        const form = document.querySelector('#form');
        submitButton.addEventListener('click', (e) => {
            let isFormValid = form.checkValidity();
            if(!isFormValid){
                form.reportValidity();
            }else{
                e.preventDefault();
                controllerModule.onFormSubmit();
            }
        });
}

const noteForm = () => {
    const formDiv = document.querySelector("#formDiv");
    const notesButton = document.querySelector("#notesButton");

    notesButton.classList.add("selected");


}

const renderForm = () => {
    const formDiv = document.querySelector("#formDiv");
    const toDoButton = document.querySelector("#toDoButton");
    const projectButton = document.querySelector("#projectButton");
    const notesButton = document.querySelector("#notesButton");

    toDoButton.classList.remove("selected");
    projectButton.classList.remove("selected");
    notesButton.classList.remove("selected");

    while(formDiv.firstChild){
        formDiv.removeChild(formDiv.firstChild)
    }
}

export default formPopup;

