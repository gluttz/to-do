import "./css/index.css"
import editSVG from "./css/images/edit.svg"
import removeSVG from "./css/images/trash.svg"
import elem from "./functions/elem"
import formPopup from "./pages/form"
import {format, parse, getWeek} from 'date-fns'
import taskModule from './functions/taskModule'
import projectModule from "./functions/projectModule"

//////////////////////////////////////////////////////////////////////
const storageModule = (() => {
    //???? local storage stuff
})();
//////////////////////////////////////////////////////////////////////

const filterModule = (() => {
  
    const todayFilter = () => {
        let today = new Date();
        let todaysDate = format(today, "yyyy-MM-dd",)
        let currentTaskList = taskModule.getTaskList();
        let filteredTaskList = [];
        currentTaskList.forEach((task) => {
            if(task.date === todaysDate){
                filteredTaskList.push(task)
            }
        })
        return filteredTaskList;
    }

    const weekFilter = () => {
        let today = new Date();
        let currentTaskList = taskModule.getTaskList();
        let filteredTaskList = [];
        let week = getWeek(today)
        currentTaskList.forEach((task) => {
            let parsedDate = parse(
                task.date,
                "yyyy-MM-dd",
                new Date()
            )
            let taskWeek = getWeek(parsedDate)
            if(week === taskWeek){
                filteredTaskList.push(task)
            }
        })
        
        return filteredTaskList
    }

    const projectFilter = (projName) => {
        let currentTaskList = taskModule.getTaskList();
        let filteredTaskList = [];
        
        currentTaskList.forEach((task) => {
            if(task.project === projName){
                filteredTaskList.push(task)
            }
        })

        return filteredTaskList;
    }

    return {todayFilter, weekFilter, projectFilter}
})();

//////////////////////////////////////////////////////////////////////
const controllerModule = (() => {
//TODO: set currentproj default on nav click home, today, week
    const onPageLoad = () => {      
         //load data
        let data = [
            ["elpmas", 0, "2022-12-19", "some detail", "Default", true],
            ["sample", 1, "2019-08-26", "shirt", "School"],
            ["afadfa", 2, "2019-08-26", "pants", "Default"],
            ["Jay", 1, "2022-12-19", "hello", "Gym"],
            ["Chris", 1, "2019-08-26", "details details details", "Default"]
        ]
        let defaultProjects = ["Gym", "School"]

        defaultProjects.forEach(projectModule.addProject)
        data.forEach(taskModule.addTask)

       //render to screen
        displayModule.homeDisplay();
        displayModule.projectNavDisplay();
        displayModule.navListen();
    };

    const onRemoveTask = (name) => {
        taskModule.removeTask(name);
    };

    
    const onFormPopupClick = () => {
        displayModule.displayForm();
    };

    const onFormCloseClick = () => {
        displayModule.closeForm();
    }

    const onFormSubmit = () => {
        let formValues = displayModule.getFormValues();
        if(formValues.length > 1){
            taskModule.addTask(formValues);
        }
        if(formValues.length == 1){
            projectModule.addProject(formValues[0]);
        }
        console.log(formValues)
        displayModule.closeForm();
        displayModule.renderTaskField();
        displayModule.displayCurrentDisplay();
        displayModule.newButtonListen();
        displayModule.renderNavDisplay();
        displayModule.projectNavDisplay();
        displayModule.navListen();
    }

    const onNavClick = (target) => {
        displayModule.removeNavSelected();
        if(target.id === "homeButton"){
            displayModule.renderTaskField();
            displayModule.setCurrentDisplay("home");
            displayModule.displayCurrentDisplay();
        }
        if(target.id === "todayButton"){
            displayModule.renderTaskField();
            displayModule.setCurrentDisplay("today");
            displayModule.displayCurrentDisplay()
        }
        if(target.id === "weekButton"){
            displayModule.renderTaskField();
            displayModule.setCurrentDisplay("week");
            displayModule.displayCurrentDisplay();
        }
        if(target.classList.contains("project")){
            console.log("project clicked")
            displayModule.renderTaskField();
            displayModule.setCurrentDisplay("project")
            displayModule.displayCurrentDisplay(target.id);
        }
    }

    const onEditTaskClick = (taskId) => {
        displayModule.displayEditForm(taskId);
    }

    const onEditTaskSubmit = (taskId) => {
        let formValues = displayModule.getFormValues();
        taskModule.editTask(taskId, formValues)
        displayModule.closeForm();
        displayModule.renderTaskField();
        displayModule.displayCurrentDisplay(); 
    }

    const onRemoveTaskClick = (taskId) => {
        taskModule.removeTask(taskId);
        displayModule.renderTaskField();
        displayModule.displayCurrentDisplay(); 
    }

    
    return { 
            onRemoveTask, 
            onFormPopupClick, 
            onPageLoad, 
            onFormCloseClick,
            onFormSubmit,
            onNavClick,
            onEditTaskClick,
            onEditTaskSubmit,
            onRemoveTaskClick,
    }
})();
////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
const displayModule = (() => {
    const newButton = document.querySelector("#headerContainer button");
    newButton.addEventListener('click', controllerModule.onFormPopupClick)
    const contentContainer = document.querySelector("#content");
    let currentDisplay = "home"

    const getCurrentDisplay = () => currentDisplay;

    const setCurrentDisplay = (display) => {
        currentDisplay = display
    }

    const displayCurrentDisplay = (projName) => {
        if(currentDisplay === "home"){
            homeDisplay();
        }else if(currentDisplay === "today"){
            todayDisplay();
        }else if(currentDisplay === "week"){
            weekDisplay();
        }else{
            projectDisplay(projName);
        }
    }
    const projectNavDisplay = () => {
        let currentProjects = projectModule.getProjectList();
        const projectsContainer = document.querySelector('#projects')
        

        currentProjects.forEach((project) => {
            if(project.name != "Default"){
                projectsContainer.appendChild(
                    elem({prop: "li", textContent: project.name, className: "project", id: project.name, children: [
                        elem({prop: "div", textContent: `X`, className: "project"})
                    ]}))
            }
        })
    }

    const renderNavDisplay = () => {
        const projectsContainer = document.querySelector('#projects')
        while(projectsContainer.firstChild){
            projectsContainer.removeChild(projectsContainer.firstChild);
        }
    }

    const displayForm = () => {
        formPopup();
        let closeButton = document.querySelector("#closeButton");
        closeButton.addEventListener('click', controllerModule.onFormCloseClick);
        
    }

    const getFormValues = () => {
        const titleField = document.querySelector('#title');
        const detailsField = document.querySelector('#toDoDetails');
        const dateField = document.querySelector('#dueDate');
        const priorityField = document.querySelector('.checked');
        
        let valueArray = []

        let titleValue = titleField.value;
        valueArray.push(titleValue)
        let priorityValue;
        if(priorityField){
            priorityValue = priorityField.for;
            let priority;
            if(priorityValue === "low"){
                priority = 0;
            }
            if(priorityValue === "medium"){
                priority = 1;
            }
            if(priorityValue === "high"){
                priority = 2;
            }
            valueArray.push(priority)
        }
        
        let dateValue;
        if(dateField){
            dateValue = dateField.value;
            valueArray.push(dateValue)
        }
        let detailsValue;
        if(detailsField){
            detailsValue = detailsField.value;
            valueArray.push(detailsValue)
        }
        if(dateField){
            valueArray.push(titleValue);
        }
        return valueArray;
    }

    const closeForm = () => {
        let form = document.querySelector("#formPopupContainer");
        contentContainer.removeChild(form);
    }

    const renderTaskField = () => {
        const field = document.querySelector('#listContainer');
        
        while(field.firstChild){
            field.removeChild(field.firstChild);
        }
    }

    const prepareTask = (task) => {
        //accept task object as param
        const editLogo = new Image();
        editLogo.src = editSVG;
        editLogo.classList.add('logo')
        editLogo.classList.add('editLogo')
        const removeLogo = new Image();
        removeLogo.src = removeSVG;
        removeLogo.classList.add('logo')
        removeLogo.classList.add('removeLogo')
        let parsedDate = parse(
            task.date,
            "yyyy-MM-dd",
            new Date()
        )
        
        let newDate = format(parsedDate, "MM/dd/yyyy")
        let newTask = elem({prop: "div", id: task.title, className: "task", children: [
            elem({prop: "input", className: "taskComplete", type: "checkbox", checked: task.checked}),
            elem({prop: "div", className: "taskTitle", textContent: task.title}),
            elem({prop: "div", className: "taskDetails", textContent: "Details"}),
            elem({prop: "div", className: "taskDate", textContent: newDate}),
            editLogo,
            removeLogo
        ]});
        newTask.classList.add(`priority${task.priority}`);

        let checkbox = newTask.querySelector('.taskComplete');
        checkbox.addEventListener('click', () => {
            taskModule.toggleChecked(checkbox.parentElement.id);
        })
        
        let detailsButton = newTask.querySelector('.taskDetails');
        detailsButton.addEventListener('click', () => {
            displayTaskDetails(detailsButton.parentElement.id);//edit this later
        })
        
        let editButton = newTask.querySelector('.editLogo');
        editButton.addEventListener('click', () => {
            controllerModule.onEditTaskClick(editButton.parentElement.id);
        })

        let removeButton = newTask.querySelector('.removeLogo');
        removeButton.addEventListener('click', () => {
            controllerModule.onRemoveTaskClick(removeButton.parentElement.id);
        })

        return newTask;
    }

    const displayTaskDetails = (taskId) => {
        let currentTaskList = taskModule.getTaskList();
        let selectedTask;
        currentTaskList.forEach((task) => {
            if(task.title === taskId)
            selectedTask = task;
        })

        let selectedTaskPrio;
        if(selectedTask.priority === 0){
            selectedTaskPrio = "Low"
        }
        if(selectedTask.priority === 1){
            selectedTaskPrio = "Medium"
        }
        if(selectedTask.priority === 2){
            selectedTaskPrio = "High"
        }
        let parsedDate = parse(
            selectedTask.date,
            "yyyy-MM-dd",
            new Date()
        )

        let formatDate = format(parsedDate, "LLLL dd yyyy")
        
        let detailsWindow = contentContainer.appendChild(elem({prop: "div", id: "detailsPopupContainer", children: [
            elem({prop: "div", id: "details", children: [
                elem({prop: "div", textContent: "X", id: "detailsCloseButton"}),
                elem({prop: "h1", textContent: `${selectedTask.title}`}),
                elem({prop: "div", textContent: `Project: ${selectedTask.project}`}),
                elem({prop: "div", textContent: `Priority: ${selectedTaskPrio}`}),
                elem({prop: "div", textContent: `Due Date: ${formatDate}`}),
                elem({prop: "div", textContent: `Details: ${selectedTask.details}`})
            ]})
        ]}))
        
        const closeButton = document.querySelector("#detailsCloseButton");
        closeButton.addEventListener('click', () => {
            contentContainer.removeChild(detailsWindow);
        })
    }

    const homeDisplay = () => {
        const field = document.querySelector('#listContainer');
        const homeButton = document.querySelector('#homeButton');
        let taskList = taskModule.getTaskList();
        homeButton.classList.add('selected');
        taskList.forEach((task) => {
            field.appendChild(prepareTask(task));
        })

    }

    const todayDisplay = () => {
        const field = document.querySelector('#listContainer');
        const todayButton = document.querySelector('#todayButton');
        todayButton.classList.add('selected');
        let taskList = filterModule.todayFilter();
        taskList.forEach((task) => {
            field.appendChild(prepareTask(task))
        })
    }

    const weekDisplay = () => {
        const field = document.querySelector('#listContainer');
        const weekButton = document.querySelector('#weekButton');
        weekButton.classList.add('selected');
        let taskList = filterModule.weekFilter();
        taskList.forEach((task) => {
            field.appendChild(prepareTask(task))
        })
    }

    const projectDisplay = (projName) => {
        const field = document.querySelector('#listContainer');
        let selectedProjectButton = document.querySelector(`#${projName}`)
        selectedProjectButton.classList.add('selected')
        let taskList = filterModule.projectFilter(projName);
        console.log(taskList);
        if(taskList[0]){
            taskList.forEach((task) => {
                field.appendChild(prepareTask(task))
            })
        }
    }

    const navListen = () => {
        const homeButton = document.querySelector('#homeButton');
        const todayButton = document.querySelector('#todayButton');
        const weekButton = document.querySelector('#weekButton');
        const projects = document.querySelectorAll('#projects li');
        
        homeButton.addEventListener('click', (e) => {
            controllerModule.onNavClick(e.target)
        });
        todayButton.addEventListener('click', (e) => {
            controllerModule.onNavClick(e.target)
        });
        weekButton.addEventListener('click', (e) => {
            controllerModule.onNavClick(e.target)
        });
        projects.forEach((project) => {
            project.addEventListener('click', (e) => {
                controllerModule.onNavClick(e.target)
            });
        });
    }

    const removeNavSelected = () => {
        const homeButton = document.querySelector('#homeButton');
        const todayButton = document.querySelector('#todayButton');
        const weekButton = document.querySelector('#weekButton');
        const projects = document.querySelectorAll('#projects li');

        homeButton.classList.remove('selected');
        todayButton.classList.remove('selected');
        weekButton.classList.remove('selected');
        projects.forEach((project) => {
            project.classList.remove('selected');
        })
    }

    const displayEditForm = (taskId) => {
        let tasks = taskModule.getTaskList();
        tasks.forEach((task) => {
            if(task.title === taskId){
                formPopup(task);
            }
        })
        let closeButton = document.querySelector('#closeButton')
        closeButton.addEventListener('click', closeForm)
        
        let submitButton = document.querySelector("#submitButton");
        const form = document.querySelector('#form');
        submitButton.addEventListener('click', (e) => {
            let isFormValid = form.checkValidity();
            if(!isFormValid){
                form.reportValidity();
            }else{
                e.preventDefault();
                controllerModule.onEditTaskSubmit(taskId);
            }
        });
    }

    return {
            displayForm, 
            closeForm,
            getFormValues,
            homeDisplay,
            renderTaskField,
            navListen,
            displayEditForm,
            todayDisplay,
            removeNavSelected,
            weekDisplay,
            getCurrentDisplay,
            setCurrentDisplay,
            displayCurrentDisplay,
            projectNavDisplay,
            renderNavDisplay
    }
})();
////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', controllerModule.onPageLoad());

export default controllerModule;