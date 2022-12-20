const projectModule = (() => {
    let projectList = [];

    const projectFactory = (name) => {
        return {name: name}
    };

    const getProjectList = () => projectList;

    const addProject = (name) => {
        projectList.push(projectFactory(name));
    };

    return { 
            getProjectList, 
            addProject}
})();

export default projectModule;