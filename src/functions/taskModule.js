const taskModule = (() => {
    
    let taskList = [];
    //model class
    const taskFactory = (title, priority, date, details, project, checked=false) => {
        return {
            title: title,
            priority: priority,
            date: date,
            details: details,
            project: project,
            checked: checked
        };
    };
    
    const addTask = (array) => {
        //TODO: remove all calls to this and replace with
        let newTask = taskFactory(array[0], array[1], array[2], array[3], array[4], array[5]);
        taskList.push(newTask)
    };

    const removeTask = (taskId) => {
        let toRemove = taskList.findIndex(task => task.title === taskId);
        taskList.splice(toRemove, 1);
    };

    const editTask = (taskId, formValues) => {
        taskList.forEach((task) => {
            if(task.title === taskId){
                task.title = formValues[0];
                task.priority = formValues[1];
                task.date = formValues[2];
                task.details = formValues[3];
            }
        })
    }

    const getTaskList = () => taskList;

    const getTaskInfo = (taskName) => {
        taskList.forEach((task) => {
            if(task.title === taskName){
                return task;
            }
        })
    }

    const toggleChecked = (taskId) => {
        taskList.forEach((task) => {
            if(task.title === taskId){
                if(task.checked){
                    task.checked = false;
                }else{
                    task.checked = true;
                }
            }
        })
    }


    return {addTask, removeTask, getTaskList, editTask, getTaskInfo, toggleChecked};
})();

export default taskModule