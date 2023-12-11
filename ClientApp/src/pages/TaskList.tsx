import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskList.css";
import { useEffect, useState } from "react";
import { Task } from "../theme/interfaces";
import TaskCard from "../components/TaskCard";

interface TaskListPageProps {
    userCookie: string;
}

const TaskListPage: React.FC<TaskListPageProps> = ({userCookie}) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const fetchTasks = async () => {
        const groupId = await getGroupId();
        const apiAddress = `http://localhost:5180/api/v1/tasks/${groupId}`;

        const response = await fetch(apiAddress, {credentials: "include"});
        return await response.json();
    }

    useEffect(() => {
        fetchTasks().then(res => setTasks(res));
    }, [])

    //kb ugyanez van a Menu.tsx-ben is, lehet hogy a groupot le lehetne kérni már az app.tsx-ben?
    const getGroupId = async () => {
        console.log(userCookie);
        const id = userCookie.split("=")[1];
        const apiAddress = `http://localhost:5180/api/v1/groups/${id}`;
        const response = await fetch(apiAddress, {credentials: "include"});
        const group = await response.json();
        return group.id;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Feladatok</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {tasks.length > 0 ? tasks.map((task, index) => (
                    <TaskCard key={index} taskModel={task}></TaskCard>
                ))
                :
                <IonText className="no-tasks"><p>Nincsenek feladatok.</p></IonText>
                }
            </IonContent>
        </IonPage>
    );
};

export default TaskListPage;