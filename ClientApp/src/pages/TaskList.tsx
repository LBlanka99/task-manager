import { IonButton, IonButtons, IonChip, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonPopover, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from "@ionic/react";
import "./TaskList.css";
import { useEffect, useState } from "react";
import { Group, Task } from "../theme/interfaces";
import TaskCard from "../components/TaskCard";
import { add, arrowDown, arrowUp, caretDownOutline, caretDownSharp, caretUpOutline, caretUpSharp, eye, toggle } from "ionicons/icons";

interface TaskListPageProps {
    group: Group | undefined;
}

const TaskListPage: React.FC<TaskListPageProps> = ({group}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isAscending, setIsAscending] = useState(true);
    const [arrowIcon, setArrowIcon] = useState(arrowDown);
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        if (isAscending) {
            setArrowIcon(arrowDown);
        } else {
            setArrowIcon(arrowUp);
        }
    }, [isAscending]);

    const fetchTasks = async () => {
        const apiAddress = `http://localhost:5180/api/v1/tasks/${group?.id}`;

        const response = await fetch(apiAddress, {credentials: "include"});
        return await response.json();
    }

    useEffect(() => {
        if (group) {
            fetchTasks().then(res => setTasks(res));
        }        
    }, [group])

    useEffect(() => {
        if (sortBy) {
            const direction = isAscending ? 1 : -1;
            tasks.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1*direction : -1*direction);
            setTasks([...tasks]);
        }

    }, [isAscending, sortBy])


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
            {group ?
            <>
            <IonItem lines="full">
                <IonChip>
                    <IonButton fill="clear" aria-label="desc/asc order" className="ion-no-padding ion-no-margin" style={{marginRight: "10px"}} onClick={() => setIsAscending(!isAscending)}>
                        <IonIcon slot="icon-only" aria-hidden icon={arrowIcon} color="light"></IonIcon>
                    </IonButton>                             
                    <IonSelect
                        placeholder="Rendezés..."
                        interface="popover"
                        toggleIcon={caretDownOutline}
                        expandedIcon={caretUpOutline}
                        onIonChange={(c) => setSortBy(c.detail.value)}
                    >
                        <IonSelectOption class="ion-text-center"value="" disabled>-- Rendezés --</IonSelectOption>             
                        <IonSelectOption value="title">Név</IonSelectOption>
                        <IonSelectOption value="deadline">Határidő</IonSelectOption>
                        <IonSelectOption value="points">Pont</IonSelectOption>
                    </IonSelect>
                </IonChip>                
                
            </IonItem>
            

            <IonContent>
                {tasks.length > 0 ? tasks.map((task, index) => (
                    <TaskCard key={index} taskModel={task}></TaskCard>
                ))
                :
                <IonText className="no-tasks"><p>Nincsenek feladatok.</p></IonText>
                }
                <IonFab slot="fixed" vertical="bottom" horizontal="end" class="ion-margin">
                    <IonFabButton aria-label="new-task" color={"primary"} routerLink="/new-task" routerDirection="forward">
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>
            </>
            :
            <div></div>
            }
        </IonPage>
    );
};

export default TaskListPage;