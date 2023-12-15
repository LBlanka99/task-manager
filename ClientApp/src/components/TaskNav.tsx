import { IonNav } from "@ionic/react"
import TaskListPage from "../pages/TaskList"
import { Group } from "../theme/interfaces";

interface TaskNavProps {
    group: Group | undefined;
}

const TaskNav:React.FC<TaskNavProps> = ({group}) => {

    return <IonNav root={() => <TaskListPage group={group} />}></IonNav>;
};

export default TaskNav;