import { IonNav } from "@ionic/react"
import TaskListPage from "../pages/TaskList"
import { Group, User } from "../theme/interfaces";

interface TaskNavProps {
    group: Group | undefined;
    currentUser: User | undefined;
}

const TaskNav: React.FC<TaskNavProps> = ({ group, currentUser }) => {

    return (
        <IonNav root={() => <TaskListPage group={group} currentUser={currentUser} />}></IonNav>
    )
};

export default TaskNav;